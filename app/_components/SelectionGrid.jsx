import React, { useMemo } from "react";
import VaryingLine from "./VaryingLine";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CARD_CONFIGS = {
  sales: {
    colors: {
      primary: '#4f46e5',
      secondary: '#818cf8',
      line: '#4f46e5'
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

const SelectionGrid = ({ onCardSelect, selectedCard, periodValues }) => {
  // Defensive check for periodValues
  if (!periodValues || typeof periodValues !== 'object') {
    return null;
  }

  const config = CARD_CONFIGS[selectedCard];
  const value = useMemo(() => {
    const baseValue = selectedCard === 'sales' 
      ? periodValues.sales
      : selectedCard === 'services' 
        ? periodValues.services 
        : periodValues.others;
    
    return baseValue || 0; // Ensure we always have a number
  }, [selectedCard, periodValues]);

  const count = useMemo(() => {
    if (!periodValues.counts) return 0;
    return selectedCard === 'sales' 
      ? periodValues.counts.sales
      : selectedCard === 'services' 
        ? periodValues.counts.services 
        : periodValues.counts.others;
  }, [selectedCard, periodValues]);

  const ownValue = Math.round(value * config.ownRatio);
  const subValue = Math.round(value * config.subRatio);
  const ownCount = Math.round(count * config.ownRatio);
  const subCount = Math.round(count * config.subRatio);
  const totalCount = ownCount + subCount; // Add this line to calculate totalCount

  const chartData = useMemo(() => ({
    labels: [`Own ${selectedCard}`, `Sub ${selectedCard}`],
    datasets: [{
      data: [ownValue, subValue],
      backgroundColor: [config.colors.primary, config.colors.secondary],
      borderColor: [config.colors.primary, config.colors.secondary],
      borderWidth: 1,
      hoverOffset: 4,
    }],
    _counts: [ownCount, subCount]
  }), [ownValue, subValue, ownCount, subCount, selectedCard, config]);

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

  return (
    <div className="space-y-6">
      <div 
        className="p-4 rounded-lg shadow-md border-2 border-blue-500 cursor-pointer hover:border-blue-600 transition-colors"
        onClick={() => onCardSelect && onCardSelect(selectedCard)}
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
            <p className="text-xl font-bold mb-2">₹{formatCurrency(value)}</p>
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center">
              <div className="w-48">
                <VaryingLine color={config.colors.line} />
              </div>
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: config.colors.primary }}>
                  {totalCount}
                </div>
                <div className="text-sm text-gray-500">Total Count</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SelectionGrid);
