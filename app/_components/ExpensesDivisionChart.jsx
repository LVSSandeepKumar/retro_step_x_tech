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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

export const ExpensesDivisionChart = ({ expensesData }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (!expensesData) return;

    const total = Object.values(expensesData).reduce((a, b) => a + b, 0);

    // Prepare table data
    const processedData = expenses.map(expense => ({
      name: expense,
      amount: expensesData[expense],
      percentage: ((expensesData[expense] / total) * 100).toFixed(1)
    }));

    setTableData(processedData);

    setChartData({
      labels: expenses,
      datasets: [{
        data: expenses.map(expense => expensesData[expense]),
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
  }, [expensesData]);

  // Modify options to remove legend since we'll show data in table
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.7,
    plugins: {
      legend: {
        display: false // Hide legend since we have table
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
    <div className="p-4">
      <div className="flex items-center">
        {/* Pie Chart Section */}
        <div className="w-1/2">
          <div className="h-[400px] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {chartData.labels.length > 0 && (
                <Pie data={chartData} options={options} />
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-1/2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.percentage}%</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold bg-muted/50">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">
                  ₹{tableData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesDivisionChart;
