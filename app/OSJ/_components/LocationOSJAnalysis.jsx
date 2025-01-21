"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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
  YESTERDAY: "Yesterday",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YTD: "Year to Date",
};

const LocationOSJAnalysis = ({ period, data, onPeriodChange }) => {
  if (!data) return null;

  // Calculate total amount
  const totalAmount = data.reduce((sum, item) => sum + item.total, 0);

  const formatCurrency = (amount) => {
    const formattedValue = Math.abs(amount).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
    return amount >= 0 ? formattedValue : `-${formattedValue}`;
  };

  const chartData = {
    labels: data.map(item => item.location),
    datasets: [
      {
        label: 'OSJ Profit',
        data: data.map(item => item.osjProfit),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',  // Green for profit
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: 'OSJ Loss',
        data: data.map(item => item.osjLoss),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',  // Red for loss
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: 'Expense Not Punched',
        data: data.map(item => item.expenseNotPunched),
        backgroundColor: 'rgba(234, 179, 8, 0.6)',  // Yellow for expense
        borderColor: 'rgb(234, 179, 8)',
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: 'Collection Not Found',
        data: data.map(item => item.collectionNotFound),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',  // Indigo for collection
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
        borderRadius: 5,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${Math.round(value/1000)}K`
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: (tooltipItem) => {
            const value = Math.round(tooltipItem.raw);
            if (value === 0) return null;
            
            const formattedValue = Math.abs(value).toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            });
            
            return tooltipItem.dataset.label === 'OSJ Loss' || tooltipItem.dataset.label === 'Collection Not Found'
              ? `${tooltipItem.dataset.label}: -${formattedValue}`
              : `${tooltipItem.dataset.label}: ${formattedValue}`;
          }
        }
      },
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">OSJ Analysis by Location</h2>
        <div className={`text-lg font-bold ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(totalAmount)}
        </div>
      </div>

      <div className="h-[400px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LocationOSJAnalysis;
