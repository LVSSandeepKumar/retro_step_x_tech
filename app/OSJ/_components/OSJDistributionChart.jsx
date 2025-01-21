"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const OSJDistributionChart = ({ totals }) => {
  if (!totals) return null;

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  // Filter out zero values and prepare data
  const chartItems = [
    {
      label: 'Profits',
      value: totals.profits,
      color: 'rgba(34, 197, 94, 0.6)',
      borderColor: 'rgb(34, 197, 94)'
    },
    {
      label: 'Losses',
      value: Math.abs(totals.losses), // Convert to positive for display
      color: 'rgba(239, 68, 68, 0.6)',
      borderColor: 'rgb(239, 68, 68)'
    },
    {
      label: 'Expense Not Punched',
      value: totals.expenseNotPunched,
      color: 'rgba(234, 179, 8, 0.6)',
      borderColor: 'rgb(234, 179, 8)'
    },
    {
      label: 'Collection Not Found',
      value: Math.abs(totals.collectionNotFound),
      color: 'rgba(99, 102, 241, 0.6)',
      borderColor: 'rgb(99, 102, 241)'
    }
  ].filter(item => item.value > 0);

  const data = {
    labels: chartItems.map(item => `${item.label} (${formatCurrency(item.value)})`),
    datasets: [{
      data: chartItems.map(item => item.value),
      backgroundColor: chartItems.map(item => item.color),
      borderColor: chartItems.map(item => item.borderColor),
      borderWidth: 1
    }]
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${formatCurrency(value)} (${((value / chartItems.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">OSJ Distribution</h2>
        <div className={`text-lg font-bold ${totals.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(totals.total)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-[350px] flex items-center justify-center">
          <Pie data={data} options={options} />
        </div>
        <div className="h-[350px] flex items-center">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartItems.map((item) => {
                // Calculate display value (negative for losses and collection not found)
                const displayValue = item.label === 'Losses' || item.label === 'Collection Not Found' 
                  ? -item.value 
                  : item.value;
                
                // Calculate total value for percentage (using absolute values)
                const totalValue = chartItems.reduce((sum, i) => sum + i.value, 0);
                const percentage = ((item.value / totalValue) * 100).toFixed(1);
                
                return (
                  <TableRow key={item.label}>
                    <TableCell className="font-medium">{item.label}</TableCell>
                    <TableCell className={`text-right ${
                      displayValue < 0 ? 'text-red-600' : ''
                    }`}>
                      {formatCurrency(displayValue)}
                    </TableCell>
                    <TableCell className="text-right">{percentage}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow className="border-t-2">
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className={`text-right font-bold ${
                  totals.total >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(chartItems.reduce((sum, item) => {
                    // Subtract losses and collection not found
                    if (item.label === 'Losses' || item.label === 'Collection Not Found') {
                      return sum - item.value;
                    }
                    return sum + item.value;
                  }, 0))}
                </TableCell>
                <TableCell className="text-right font-bold">100%</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default OSJDistributionChart;