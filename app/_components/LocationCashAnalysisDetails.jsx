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

const LocationCashAnalysisDetails = () => {
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

    const baseAmount = 100000; // Base amount for cash
    const multiplier = baseMultipliers[period];
    
    const data = locationList.map(city => {
      const currentBalance = Math.round(baseAmount * multiplier * (0.8 + Math.random() * 0.4));
      const lastDayBalance = Math.round(currentBalance * (0.85 + Math.random() * 0.3));
      // Generate smaller random number of pending verifications between 2 and 10
      const pendingVerifications = -Math.floor(Math.random() * 8 + 2);
      
      return {
        city,
        currentBalance,
        lastDayBalance,
        difference: currentBalance - lastDayBalance,
        pendingVerifications
      };
    });

    return data.sort((a, b) => b.currentBalance - a.currentBalance);
  };

  useEffect(() => {
    const data = generateData(selectedPeriod);
    
    setChartData({
      labels: data.map(item => item.city),
      datasets: [
        {
          label: 'Current Balance',
          data: data.map(item => item.currentBalance),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          borderRadius: 5,
          stack: 'Stack 0',
        },
        {
          label: 'Last Day Balance',
          data: data.map(item => item.lastDayBalance),
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          borderRadius: 5,
          stack: 'Stack 1',
        },
        {
          label: 'Pending Verifications',
          data: data.map(item => item.pendingVerifications),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          borderRadius: 5,
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
        suggestedMin: -50, // Increased negative range
        suggestedMax: Math.max(...(chartData?.datasets[0]?.data || []) ) * 1.1,
        ticks: {
          stepSize: 10, // Forces ticks at intervals of 10
          callback: (value) => {
            if (value >= 0) {
              return `₹${(value/1000).toFixed(0)}K`;
            } else {
              // Multiply the pending count by 5 for display only
              return (Math.abs(value) * 5) + ' pending';
            }
          }
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
            const difference = locationData.difference;
            const changeIndicator = difference >= 0 ? '▲' : '▼';
            
            return [
              `Current Balance: ₹${locationData.currentBalance.toLocaleString()}`,
              `Last Day Balance: ₹${locationData.lastDayBalance.toLocaleString()}`,
              '',
              `Change: ${changeIndicator} ₹${Math.abs(difference).toLocaleString()}`,
              `Percentage: ${((difference / locationData.lastDayBalance) * 100).toFixed(1)}%`,
              '',
              `Pending Verifications: ${Math.abs(locationData.pendingVerifications * 5)}`
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
        <h2 className="text-lg font-bold text-gray-700">Location-wise Closing Balance Analysis</h2>
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

export default LocationCashAnalysisDetails;
