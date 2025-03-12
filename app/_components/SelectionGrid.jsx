import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import VaryingLine from "./VaryingLine";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { DetailDialog } from "./DetailDialog";
import { BRANDS, SERVICE_TYPES, OTHER_TYPES } from '../_constants/chartConstants'; // Add this import

ChartJS.register(ArcElement, Tooltip, Legend);

const CARD_CONFIGS = {
  sales: {
    colors: {
      primary: '#3b82f6',    // Changed to bright blue
      secondary: '#f97316',   // Changed to bright orange for contrast
      line: '#3b82f6'
    },
    ownRatio: 0.65,
    subRatio: 0.35
  },
  services: {
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      line: '#10b981'
    },
    ownRatio: 1.0,
    subRatio: 0.0
  },
  others: {
    colors: {
      primary: '#f59e0b',
      secondary: '#fcd34d',
      line: '#f59e0b'
    },
    ownRatio: 1.0,
    subRatio: 0.0
  }
};

const formatCurrency = (amount) => {
  // Format number with Indian comma system (eg: 1,00,000)
  const numStr = Math.round(amount).toString();
  if (numStr.length > 3) {
    const lastThree = numStr.substring(numStr.length - 3);
    const otherNumbers = numStr.substring(0, numStr.length - 3);
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return numStr;
};


const SelectionGrid = ({ onCardSelect, selectedCard, periodValues,numericalData, showLocationAnalysis }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  
  // Defensive check for periodValues
  if (!periodValues || typeof periodValues !== 'object') {
    return null;
  }

  const config = CARD_CONFIGS[selectedCard];
  const value = useMemo(() => {
    const baseValue = selectedCard === 'sales' 
      ? periodValues.sales
      : selectedCard === 'services' 
        ?  numericalData?.totalAmount
        : periodValues.others;
    
    return Math.round(baseValue) || 0; // Ensure we always have a rounded number
  }, [selectedCard, periodValues, numericalData]);

  const count = useMemo(() => {
    if (!periodValues.counts) return 0;
    const baseCount = selectedCard === 'sales' 
      ? periodValues.counts.sales
      : selectedCard === 'services' 
        ? numericalData?.totalAmount 
        : periodValues.counts.others;
    
    return Math.round(baseCount) || 0; // Ensure we always have a rounded number
  }, [selectedCard, periodValues, numericalData]);

  const ownValue = Math.round(value * config.ownRatio);
  const subValue = Math.round(value * config.subRatio);
  const ownCount = Math.round(count * config.ownRatio);
  const subCount = Math.round(count * config.subRatio);
  const totalCount = ownCount + subCount; // Add this line to calculate totalCount

  const chartData = useMemo(() => {
    // Only include sub data if it exists (i.e., for sales)
    const labels = [
      `Own ${selectedCard}`,
      ...(config.subRatio > 0 ? [`Sub ${selectedCard}`] : [])
    ];
    const data = [
      ownValue,
      ...(config.subRatio > 0 ? [subValue] : [])
    ];
    const backgroundColor = [
      config.colors.primary,
      ...(config.subRatio > 0 ? [config.colors.secondary] : [])
    ];
    const borderColor = [
      config.colors.primary,
      ...(config.subRatio > 0 ? [config.colors.secondary] : [])
    ];
    const counts = [
      ownCount,
      ...(config.subRatio > 0 ? [subCount] : [])
    ];

    return {
      labels,
      datasets: [{
        data,
        backgroundColor,
        borderColor,
        borderWidth: 1,
        hoverOffset: 4,
      }],
      _counts: counts
    };
  }, [ownValue, subValue, ownCount, subCount, selectedCard, config]);

  const chartOptions = {
    cutout: "85%",
    aspectRatio: 1.1,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: config.colors.primary
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const count = chartData._counts[context.dataIndex];
            return [
              `Value: ₹${formatCurrency(value)}`,
              `Count: ${count}`,
            ];
          },
        },
      },
    },
  };

  // Fixed change values based on card type
  const change = useMemo(() => (
    selectedCard === 'sales' ? 5.2 
    : selectedCard === 'services' ? -3.4 
    : 2.8
  ), [selectedCard]);

  const generateDetailChartData = () => {
    const distributions = {
      sales: [0.4, 0.3, 0.2, 0.1],
      services: [0.4, 0.3, 0.2, 0.1],
      others: [0.35, 0.3, 0.2, 0.15]
    };

    const items = selectedCard === "sales" ? BRANDS 
                : selectedCard === "services" ? SERVICE_TYPES 
                : OTHER_TYPES;
    
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];
    const distribution = distributions[selectedCard];

    let remainingValue = value;
    let remainingCount = count;

    return items.map((item, index) => {
      const ratio = distribution[index];
      const itemValue = index === items.length - 1 
        ? remainingValue 
        : Math.round(remainingValue * ratio);
      
      const itemCount = index === items.length - 1
        ? remainingCount
        : Math.round(remainingCount * ratio);

      remainingValue -= itemValue;
      remainingCount -= itemCount;

      return {
        name: item,
        value: itemValue,
        count: itemCount,
        fill: colors[index],
      };
    });
  };

  return (
    <div className="space-y-6">
      <div 
        className="p-4 rounded-lg shadow-md border-2 border-blue-500 cursor-pointer hover:border-blue-600 transition-colors"
        onClick={(e) => {
          e.preventDefault();
          onCardSelect?.(selectedCard);
        }}
      >
        <h3 className="text-lg font-semibold mb-2">
          {selectedCard === 'sales' 
            ? 'Total Sales'
            : selectedCard === 'services' 
              ? 'Total Services' 
              : 'Other Revenue'}
        </h3>
        <div className="flex items-center gap-8">
          <div>
            <p className="text-xl font-bold mb-2">₹{numericalData?.totalAmount || "N/A"} </p>
            <p className={`text-sm flex items-center ${
              parseFloat(change) >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {parseFloat(change) >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(parseFloat(change))}% since last year
            </p>
          </div>
        </div>

        <div className="relative mt-4">
          <div className="relative z-10">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="flex flex-col items-center">
              <div className="w-48">
                <VaryingLine color={config.colors.line} />
              </div>
              <div 
                className="text-center cursor-pointer"
                style={{ pointerEvents: 'all' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDialogOpen(true);
                }}
              >
                <div 
                  className="text-xl font-bold hover:opacity-80"
                  style={{ color: config.colors.primary }}
                >
                  {numericalData?.totalCount || "N/A"} 
                </div>
                <div className="text-sm text-gray-500">Total Count</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedCard={selectedCard}
        period={periodValues.period}
        chartData={generateDetailChartData()}
        showLocationAnalysis={showLocationAnalysis}
      />
    </div>
  );
};

export default React.memo(SelectionGrid);
