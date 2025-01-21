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

const OSJLossesPieChart = ({ data }) => {
  if (!data) return null;

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  // Updated color generation function
  const generateGradientColors = (values) => {
    const count = [...values].length;
    const maxValue = 180;
    const minValue = 0;
    const difference = maxValue - minValue;
    const sortedValues = [...values].sort((a, b) => a - b);
    return sortedValues.map( (val, i) => {
      const normalizedValue = difference/count;

      const color = 
      minValue + (i * normalizedValue);
      return {
        backgroundColor: `rgba(255, ${color}, ${color}, 0.6)`,
        borderColor: `#000000`,
      };
    });
  };

  // Filter locations with losses and prepare data
  const locationLosses = data
    .filter(item => item.osjLoss < 0)
    .map(item => ({
      location: item.location,
      value: Math.abs(item.osjLoss)  // Convert to positive for display
    }))
    .sort((a, b) => b.value - a.value);  // Sort by loss amount

  const totalLosses = locationLosses.reduce((sum, item) => sum + item.value, 0);

  // Get gradient colors based on loss values
  const colors = generateGradientColors(locationLosses.map(item => item.value));

  const chartData = {
    labels: locationLosses.map(item => item.location),
    datasets: [{
      data: locationLosses.map(item => item.value),
      backgroundColor: colors.map(c => c.backgroundColor),
      borderColor: colors.map(c => c.borderColor),
      borderWidth: 1
    }]
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / totalLosses) * 100).toFixed(1);
            return `Loss: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">OSJ Location-wise Losses Distribution</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-[350px] flex items-center justify-center">
          <Pie data={chartData} options={options} />
        </div>
        <div className="h-[350px] flex items-center">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Loss Amount</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locationLosses.map((item) => {
                const percentage = ((item.value / totalLosses) * 100).toFixed(1);
                return (
                  <TableRow key={item.location}>
                    <TableCell className="font-medium">{item.location}</TableCell>
                    <TableCell className="text-right text-red-600">
                      -{formatCurrency(item.value)}
                    </TableCell>
                    <TableCell className="text-right">{percentage}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow className="border-t-2">
                <TableCell className="font-bold">Total Losses</TableCell>
                <TableCell className="text-right font-bold text-red-600">
                  -{formatCurrency(totalLosses)}
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

export default OSJLossesPieChart;
