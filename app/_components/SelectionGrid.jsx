import React, { useState, useEffect } from "react";
import VaryingLine from "./VaryingLine";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SelectionGrid = ({ onCardSelect, selectedCard, periodValues }) => {
  const [cardData, setCardData] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const baseValue = selectedCard === 'sales' 
      ? periodValues.sales
      : selectedCard === 'services' 
        ? periodValues.services 
        : periodValues.others;

    let data = {
      id: selectedCard,
      title: selectedCard === 'sales' 
        ? 'Total Sales'
        : selectedCard === 'services' 
          ? 'Total Services' 
          : 'Other Revenue',
      value: baseValue.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }),
      change: (Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1)).toFixed(1),
    };

    setCardData(data);
    setChartData(generateChartData(baseValue));
  }, [selectedCard, periodValues]);

  const generateChartData = (baseValue) => {
    if (selectedCard === "sales") {
      const ownValue = baseValue * (0.6 + Math.random() * 0.1);
      const subValue = baseValue * (0.3 + Math.random() * 0.1);
      return {
        labels: ["Own Sales", "Sub Sales"],
        datasets: [
          {
            data: [ownValue, subValue],
            backgroundColor: ["#4f46e5", "#818cf8"],
            borderColor: ["#4338ca", "#6366f1"],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
        _counts: [Math.floor(ownValue / 10000), Math.floor(subValue / 10000)],
      };
    } else if (selectedCard === "services") {
      const ownValue = baseValue * (0.8 + Math.random() * 0.2);
      return {
        labels: ["Own Services"],
        datasets: [
          {
            data: [ownValue],
            backgroundColor: ["#4f46e5"],
            borderColor: ["#4338ca"],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
        _counts: [Math.floor(ownValue / 5000)],
      };
    } else if (selectedCard === "others") {
      const ownValue = baseValue * (0.4 + Math.random() * 0.1);
      return {
        labels: ["Own Other Revenue"],
        datasets: [
          {
            data: [ownValue],
            backgroundColor: ["#4f46e5"],
            borderColor: ["#4338ca"],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
        _counts: [Math.floor(ownValue / 15000)],
      };
    }
    return null;
  };

  const chartOptions = {
    cutout: "85%",
    aspectRatio: 1.1,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const count = chartData._counts[context.dataIndex];
            return [
              `Value: ₹${Math.round(value).toLocaleString("en-IN")}`,
              `Count: ${count}`,
            ];
          },
        },
      },
    },
  };

  if (!cardData) return null;

  return (
    <div className="space-y-6">
      <div 
        className="p-4 rounded-lg shadow-md border-2 border-blue-500 cursor-pointer hover:border-blue-600 transition-colors"
        onClick={() => onCardSelect && onCardSelect(selectedCard)}
      >
        <div className="flex items-center gap-2"></div>
        <h3 className="text-lg font-semibold mb-2">{cardData.title}</h3>
        <div className="flex items-center gap-8">
          <div>
            <p className="text-xl font-bold mb-2">{cardData.value}</p>
            <p
              className={`text-sm flex items-center ${
                parseFloat(cardData.change) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {parseFloat(cardData.change) >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(parseFloat(cardData.change))}% since last year
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
              <VaryingLine color="#4f46e5" />
            </div>
              <div className="text-center">
                <div className="text-xl font-bold">
                  {chartData._counts.reduce((a, b) => a + b, 0)}
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

export default SelectionGrid;
