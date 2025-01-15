import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { locations } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PERIODS = [
  { label: "Yesterday", value: "YESTERDAY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Year to Date", value: "YTD" }
];

const LocationStockAnalysisDetails = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('WEEKLY');
  const [chartData, setChartData] = useState(null);

  const generateData = (period) => {
    const locationList = locations.find(loc => loc.type === 'own')?.cities || [];
    const baseMultipliers = {
      'YESTERDAY': 1,
      'WEEKLY': 2.5,
      'MONTHLY': 4,
      'YTD': 8
    };

    const baseCount = 100; // Base count for bikes
    const baseValue = 100000; // Base value for bikes
    const multiplier = baseMultipliers[period];
    
    const data = locationList.map(city => {
      // Generate new bikes data
      const newBikesCount = Math.round(baseCount * multiplier * (0.6 + Math.random() * 0.4));
      const newBikesValue = Math.round(baseValue * multiplier * (0.8 + Math.random() * 0.4));
      
      // Generate old/exchange bikes data
      const oldBikesCount = Math.round(baseCount * multiplier * (0.3 + Math.random() * 0.2));
      const oldBikesValue = Math.round(baseValue * multiplier * (0.4 + Math.random() * 0.2));
      
      return {
        city,
        newBikesCount,
        newBikesValue,
        oldBikesCount,
        oldBikesValue,
        totalCount: newBikesCount + oldBikesCount,
        totalValue: newBikesValue + oldBikesValue
      };
    });

    return data.sort((a, b) => b.totalCount - a.totalCount);
  };

  useEffect(() => {
    const data = generateData(selectedPeriod);
    
    setChartData({
      labels: data.map(item => item.city),
      datasets: [
        {
          label: 'New Bikes',
          data: data.map(item => item.newBikesCount),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          borderRadius: 5,
          stack: 'Stack 0',
        },
        {
          label: 'Old/Exchange Bikes',
          data: data.map(item => item.oldBikesCount),
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          borderRadius: 5,
          stack: 'Stack 1',
        }
      ],
      _custom: data,
    });
  }, [selectedPeriod]);

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
          callback: (value) => `${value} units`
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: () => '',
          afterBody: (context) => {
            const locationData = chartData._custom[context[0].dataIndex];
            
            return [
              `New Bikes:`,
              `  • Count: ${locationData.newBikesCount} units`,
              `  • Value: ₹${locationData.newBikesValue.toLocaleString()}`,
              '',
              `Old/Exchange Bikes:`,
              `  • Count: ${locationData.oldBikesCount} units`,
              `  • Value: ₹${locationData.oldBikesValue.toLocaleString()}`,
              '',
              `Total Stock:`,
              `  • Count: ${locationData.totalCount} units`,
              `  • Value: ₹${locationData.totalValue.toLocaleString()}`
            ];
          }
        },
        padding: 12,
        displayColors: false
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-700">Location-wise Stock Analysis</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="h-[400px]">
        {chartData && <Bar data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default LocationStockAnalysisDetails;
