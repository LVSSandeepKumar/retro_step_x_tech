import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PERIODS = {
  WEEKLY: "Weekly",
  YESTERDAY: "Yesterday",
  MONTHLY: "This Month",
  YTD: "Year to Date",
};

const ExpensesVsCollectionsChart = ({ periodValues }) => {
  const data = {
    labels: ['Collections vs Expenses'],
    datasets: [
      {
        label: 'Collections',
        data: [periodValues.cash + periodValues.upi],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: [periodValues.expenses],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${(value).toLocaleString('en-IN')}`,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${context.dataset.label}: ₹${value.toLocaleString('en-IN')}`;
          },
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-700">Collections vs Expenses</h2>
        <span className="text-sm font-medium text-gray-700">
          {periodValues.period}
        </span>
      </div>

      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Collections</p>
          <p className="text-lg font-bold text-emerald-600">
            ₹{(periodValues.cash + periodValues.upi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-lg font-bold text-red-500">
            ₹{periodValues.expenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpensesVsCollectionsChart;