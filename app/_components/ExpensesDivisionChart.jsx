import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { expenses } from '@/lib/constants';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

export const ExpensesDivisionChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Generate random amounts following the specified hierarchy
    const baseAmount = Math.floor(Math.random() * (100000 - 50000) + 50000);
    const amounts = {
      'Salaries': baseAmount,
      'OSJ': baseAmount * 0.8,
      'Electricity Charges': baseAmount * 0.6,
      'Other Expenses': baseAmount * 0.4,
      'Branch Maintenance': baseAmount * 0.3,
      'Transportation Charges': baseAmount * 0.2
    };

    setChartData({
      labels: expenses,
      datasets: [{
        data: expenses.map(expense => amounts[expense]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',   // Reddish
          'rgba(54, 162, 235, 0.8)',   // Blue
          'rgba(255, 206, 86, 0.8)',   // Yellow
          'rgba(75, 192, 192, 0.8)',   // Teal
          'rgba(153, 102, 255, 0.8)',  // Purple
          'rgba(255, 159, 64, 0.8)',   // Orange
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }],
    });
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.7,
    layout: {
      padding: {
        right: 150  // Increased right padding for labels
      }
    },
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          boxWidth: 15,
          padding: 20,  // Increased padding between labels
          font: {
            size: 13
          },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets[0];
            return chart.data.labels.map((label, index) => {
              const value = datasets.data[index];
              const total = datasets.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return {
                text: `${label}\n₹${value.toLocaleString()}\n(${percentage}%)`,
                fillStyle: datasets.backgroundColor[index],
                strokeStyle: datasets.borderColor[index],
                lineWidth: 1,
                hidden: false,
                index: index
              };
            });
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `₹${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">  {/* Reduced padding from p-6 to p-4 */}
      <h2 className="text-lg font-bold text-gray-700 mb-4">Expenses Distribution</h2>
      <div className="relative h-[400px] w-full px-2">  {/* Added horizontal padding */}
        <div className="absolute inset-0 flex items-center justify-center">
          {chartData.labels.length > 0 && (
            <Pie data={chartData} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesDivisionChart;
