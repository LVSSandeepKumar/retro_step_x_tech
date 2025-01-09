import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { totals } from '../../lib/relations';

ChartJS.register(ArcElement, Tooltip, Legend);

const SubOwnOverviewChart = ({ selectedCard }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const getTotalCount = () => {
    if (selectedCard === 'sales') {
      return totals.sales.own.salesCount + totals.sales.sub.salesCount;
    } else if (selectedCard === 'services') {
      return totals.services.own.servicesCount;
    }
    return 0;
  };

  useEffect(() => {
    if (selectedCard === 'sales') {
      setChartData({
        labels: ['Own Sales', 'Sub Sales'],
        datasets: [{
          data: [totals.sales.own.salesValue, totals.sales.sub.salesValue],
          backgroundColor: ['#4f46e5', '#818cf8'],
          borderColor: ['#4338ca', '#6366f1'],
          borderWidth: 1,
          hoverOffset: 4
        }]
      });
    } else if (selectedCard === 'services') {
      setChartData({
        labels: ['Own Services'],
        datasets: [{
          data: [totals.services.own.servicesValue],
          backgroundColor: ['#4f46e5'],
          borderColor: ['#4338ca'],
          borderWidth: 1,
          hoverOffset: 4
        }]
      });
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
        enabled: true,
        position: 'nearest',
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 15,
        titleColor: 'white',
        bodyColor: 'white',
        displayColors: false,
        callbacks: {
          title: function(tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            const count = selectedCard === 'sales' 
              ? (label === 'Own Sales' ? totals.sales.own.salesCount : totals.sales.sub.salesCount)
              : totals.services.own.servicesCount;
            
            return [
              `Value: ₹${value.toLocaleString('en-IN')}`,
              `Count: ${count}`
            ];
          }
        }
      }
    }
  };

  if (!selectedCard) {
    return <div className="flex items-center justify-center h-64">Please select a card to see it's analytics</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-[404px]">
      <h3 className="text-lg font-semibold mb-4">
        {selectedCard === 'sales' ? 'Sales Distribution' : 'Services Distribution'}
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