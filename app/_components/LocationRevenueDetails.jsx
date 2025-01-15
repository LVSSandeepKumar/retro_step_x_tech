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

const TYPES_CONFIG = {
  sales: {
    title: "Location-wise Sales Analysis",
    categories: ["New Vehicle Sales", "Exchange Sales"],
    colors: ['rgba(54, 162, 235, 0.8)', 'rgba(54, 162, 235, 0.4)'],
    borders: ['rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.6)'],
    baseAmount: 50000,
    valueKey: 'Amount',
    countKey: 'vehicles'
  },
  services: {
    title: "Location-wise Service Analysis",
    categories: ["Part Sales", "Service Sales", "Bajaj Claims Warranty", "Bajaj Claims Free Service"],
    colors: ['rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(255, 159, 64, 0.8)', 'rgba(153, 102, 255, 0.8)'],
    borders: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)'],
    baseAmount: 30000,
    valueKey: 'Amount',
    countKey: 'services'
  },
  others: {
    title: "Location-wise Other Revenue Analysis",
    categories: ["Insurance", "Vehicle Finance", "Accessories", "Apparels"],
    colors: ['rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(255, 159, 64, 0.8)', 'rgba(153, 102, 255, 0.8)'],
    borders: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)'],
    baseAmount: 20000,
    valueKey: 'Amount',
    countKey: 'transactions'
  }
};

const PERIODS = [
  { label: "Yesterday", value: "YESTERDAY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Year to Date", value: "YTD" }
];

const LocationRevenueDetails = ({ type = 'sales' }) => {
  const [selectedType, setSelectedType] = useState('own');
  const [selectedPeriod, setSelectedPeriod] = useState('YESTERDAY');
  const [chartData, setChartData] = useState(null);

  const config = TYPES_CONFIG[type];

  const generateData = (locationType, period) => {
    const locationList = locations.find(loc => loc.type === locationType)?.cities || [];
    const baseMultipliers = {
      'YESTERDAY': 1,
      'WEEKLY': 2.5,
      'MONTHLY': 4,
      'YTD': 8
    };

    const multiplier = baseMultipliers[period];
    
    const data = locationList.map(city => {
      const categoryData = config.categories.map(category => {
        const amount = Math.round(config.baseAmount * multiplier * (0.4 + Math.random() * 0.6));
        const count = Math.round(amount / (Math.random() * (type === 'sales' ? 50000 : 2000) + 1000));
        return { category, amount, count };
      });

      return {
        city,
        categoryData,
        totalAmount: categoryData.reduce((sum, item) => sum + item.amount, 0),
        totalCount: categoryData.reduce((sum, item) => sum + item.count, 0)
      };
    });

    return data.sort((a, b) => b.totalAmount - a.totalAmount);
  };

  useEffect(() => {
    const data = generateData(selectedType, selectedPeriod);
    
    setChartData({
      labels: data.map(item => item.city),
      datasets: config.categories.map((category, index) => ({
        label: category,
        data: data.map(item => 
          item.categoryData.find(c => c.category === category)?.amount || 0
        ),
        backgroundColor: config.colors[index],
        borderColor: config.borders[index],
        borderWidth: 1,
        borderRadius: 5,
        stack: type === 'sales' ? 'Stack 0' : 'Stack 0',
      })),
      _custom: data,
    });
  }, [selectedType, selectedPeriod, type]);

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
          label: () => '',
          afterBody: (context) => {
            const cityData = chartData._custom[context[0].dataIndex];
            const lines = [];

            config.categories.forEach(category => {
              const data = cityData.categoryData.find(c => c.category === category);
              lines.push(
                category + ':',
                `  • Amount: ₹${data.amount.toLocaleString()}`,
                `  • Count: ${data.count} ${config.countKey}`,
                ''
              );
            });

            lines.push(
              `Total ${type.charAt(0).toUpperCase() + type.slice(1)}:`,
              `  • Amount: ₹${cityData.totalAmount.toLocaleString()}`,
              `  • Count: ${cityData.totalCount} ${config.countKey}`
            );

            return lines;
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
        <h2 className="text-lg font-bold text-gray-700">{config.title}</h2>
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

export default LocationRevenueDetails;
