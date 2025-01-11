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

const LocationSalesDetails = () => {
  const [selectedType, setSelectedType] = useState('own');
  const [selectedPeriod, setSelectedPeriod] = useState('WEEKLY');
  const [chartData, setChartData] = useState(null);

  const generateData = (type, period) => {
    const locationList = locations.find(loc => loc.type === type)?.cities || [];
    const baseMultipliers = {
      'YESTERDAY': 1,
      'WEEKLY': 2.5,
      'MONTHLY': 4,
      'YTD': 8
    };

    const baseAmount = 50000;
    const multiplier = baseMultipliers[period];
    
    const data = locationList.map(city => {
      const totalAmount = Math.round(baseAmount * multiplier * (1 + Math.random()));
      const newVehicleRatio = 0.6 + Math.random() * 0.2; // 60-80% new vehicles
      
      const newVehicleAmount = Math.round(totalAmount * newVehicleRatio);
      const exchangeAmount = totalAmount - newVehicleAmount;
      
      // Generate counts
      const totalCount = Math.round(totalAmount / 50000); // Adjust divisor for reasonable count
      const newVehicleCount = Math.round(totalCount * newVehicleRatio);
      const exchangeCount = totalCount - newVehicleCount;

      return {
        city,
        totalAmount,
        newVehicleAmount,
        exchangeAmount,
        totalCount,
        newVehicleCount,
        exchangeCount
      };
    });

    return data.sort((a, b) => a.totalAmount - b.totalAmount);
  };

  useEffect(() => {
    const data = generateData(selectedType, selectedPeriod);
    
    setChartData({
      labels: data.map(item => item.city),
      datasets: [
        {
          label: 'New Vehicle Sales',
          data: data.map(item => item.newVehicleAmount),
          backgroundColor: selectedType === 'own' ? 
            'rgba(54, 162, 235, 0.8)' : 'rgba(255, 99, 132, 0.8)',
          borderColor: selectedType === 'own' ? 
            'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          borderRadius: 5,
          stack: 'Stack 0',
        },
        {
          label: 'Exchange Sales',
          data: data.map(item => item.exchangeAmount),
          backgroundColor: selectedType === 'own' ? 
            'rgba(54, 162, 235, 0.4)' : 'rgba(255, 99, 132, 0.4)',
          borderColor: selectedType === 'own' ? 
            'rgba(54, 162, 235, 0.6)' : 'rgba(255, 99, 132, 0.6)',
          borderWidth: 1,
          borderRadius: 5,
          stack: 'Stack 0',
        }
      ],
      _custom: data, // Store full data for tooltip access
    });
  }, [selectedType, selectedPeriod]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${(value/1000).toFixed(0)}K`
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: () => '', // Return empty to avoid default labels
          afterBody: (context) => {
            const cityData = chartData._custom[context[0].dataIndex];
            return [
              'New Vehicle Details:',
              `  • Amount: ₹${cityData.newVehicleAmount.toLocaleString()}`,
              `  • Count: ${cityData.newVehicleCount} vehicles`,
              '',
              'Exchange Vehicle Details:',
              `  • Amount: ₹${cityData.exchangeAmount.toLocaleString()}`,
              `  • Count: ${cityData.exchangeCount} vehicles`,
              '',
              'Total Details:',
              `  • Amount: ₹${cityData.totalAmount.toLocaleString()}`,
              `  • Count: ${cityData.totalCount} vehicles`
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
        <h2 className="text-lg font-bold text-gray-700">Location-wise Sales Analysis</h2>
        <div className="flex gap-4">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="own">Own</SelectItem>
              <SelectItem value="sub">Sub</SelectItem>
            </SelectContent>
          </Select>

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
      </div>

      <div className="h-[400px]">
        {chartData && <Bar data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default LocationSalesDetails;