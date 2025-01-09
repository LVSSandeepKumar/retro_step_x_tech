import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const VerifiedUnverifiedChart = ({ cashCollections = 0 }) => {
  const [verifiedPercentage, setVerifiedPercentage] = useState(0);

  useEffect(() => {
    // Generate random percentage between 65% and 85%
    setVerifiedPercentage(Math.random() * (85 - 65) + 65);
  }, [cashCollections]);

  const verifiedAmount = (cashCollections * verifiedPercentage) / 100;
  const unverifiedAmount = cashCollections - verifiedAmount;

  const data = {
    labels: ['Verified', 'Unverified'],
    datasets: [{
      data: [verifiedAmount, unverifiedAmount],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / cashCollections) * 100).toFixed(1);
            return `${context.label}: ₹${value.toLocaleString('en-IN', { 
              maximumFractionDigits: 0 
            })} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Cash Deposits Verification Status</h2>
      <div className="h-[300px]">
        <Pie data={data} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Verified</p>
          <p className="text-lg font-bold text-emerald-600">
            ₹{verifiedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Unverified</p>
          <p className="text-lg font-bold text-red-500">
            ₹{unverifiedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifiedUnverifiedChart;
