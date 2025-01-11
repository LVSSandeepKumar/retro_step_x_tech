import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const SubOwnOverviewChart = ({ selectedCard }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const generateRandomData = (period = 'WEEKLY') => {
    // Base values
    const baseValues = {
      'YESTERDAY': Math.random() * (99999 - 10000) + 10000,
      'WEEKLY': Math.random() * (999999 - 100000) + 100000,
      'MONTHLY': Math.random() * (999999 - 500000) + 500000,
      'YTD': Math.random() * (9999999 - 1000000) + 1000000,
    };

    const baseValue = baseValues['WEEKLY'];

    if (selectedCard === 'sales') {
      const ownValue = baseValue * (0.6 + Math.random() * 0.1); // 60-70% for own
      const subValue = baseValue * (0.3 + Math.random() * 0.1); // 30-40% for sub
      return {
        values: [ownValue, subValue],
        counts: [
          Math.floor(ownValue / 10000),
          Math.floor(subValue / 10000)
        ]
      };
    } else if (selectedCard === 'services') {
      const ownValue = baseValue * (0.8 + Math.random() * 0.2); // 80-100% for own
      return {
        values: [ownValue],
        counts: [Math.floor(ownValue / 5000)]
      };
    } else if (selectedCard === 'others') {
      const ownValue = baseValue * (0.4 + Math.random() * 0.1); // 40-50% for own
      return {
        values: [ownValue],
        counts: [Math.floor(ownValue / 15000)]
      };
    }
    return { values: [], counts: [] };
  };

  const getTotalCount = () => {
    if (!chartData.datasets[0]?.data) return 0;
    return chartData.datasets[0].data.reduce((acc, curr, idx) => 
      acc + (chartData._counts?.[idx] || 0), 0
    );
  };

  useEffect(() => {
    if (selectedCard) {
      const { values, counts } = generateRandomData();
      const data = {
        labels: selectedCard === 'sales' 
          ? ['Own Sales', 'Sub Sales']
          : selectedCard === 'services'
            ? ['Own Services']
            : ['Own Other Revenue'],
        datasets: [{
          data: values,
          backgroundColor: ['#4f46e5', '#818cf8'],
          borderColor: ['#4338ca', '#6366f1'],
          borderWidth: 1,
          hoverOffset: 4
        }],
        _counts: counts
      };
      setChartData(data);
    }
  }, [selectedCard]);

  const options = {
    cutout: '75%',
    aspectRatio: 1.2,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          title: function(tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function(context) {
            const value = context.raw;
            const count = chartData._counts[context.dataIndex];
            return [
              `Value: ₹${Math.round(value).toLocaleString('en-IN')}`,
              `Count: ${count}`
            ];
          }
        }
      }
    }
  };

  if (!selectedCard) {
    return (
      <div className="flex items-center justify-center h-64">
        Please select a card to see analytics
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-[404px]">
      <h3 className="text-lg font-semibold mb-4">
        {selectedCard === 'sales' 
          ? 'Sales Distribution' 
          : selectedCard === 'services'
            ? 'Services Distribution'
            : 'Other Revenue Distribution'}
      </h3>
      <div className="relative">
        <div className="relative z-10">
          <Doughnut data={chartData} options={options} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold">{getTotalCount()}</div>
            <div className="text-sm text-gray-500">Total Count</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubOwnOverviewChart;