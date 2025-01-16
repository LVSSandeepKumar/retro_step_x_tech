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
    colors: {
      own: ['rgba(54, 162, 235, 0.8)', 'rgba(54, 162, 235, 0.4)'],
      sub: ['rgba(236, 72, 153, 0.8)', 'rgba(236, 72, 153, 0.4)']
    },
    borders: {
      own: ['rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.6)'],
      sub: ['rgba(236, 72, 153, 1)', 'rgba(236, 72, 153, 0.6)']
    }
  },
  services: {
    title: "Location-wise Service Analysis",
    categories: ["Part Sales", "Service Sales", "Bajaj Claims Warranty", "Bajaj Claims Free Service"],
    colors: {
      own: ['rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
      sub: ['rgba(236, 72, 153, 0.8)', 'rgba(244, 114, 182, 0.8)', 'rgba(236, 72, 153, 0.6)', 'rgba(244, 114, 182, 0.6)']
    },
    borders: {
      own: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)'],
      sub: ['rgba(236, 72, 153, 1)', 'rgba(244, 114, 182, 1)', 'rgba(236, 72, 153, 0.8)', 'rgba(244, 114, 182, 0.8)']
    }
  },
  others: {
    title: "Location-wise Other Revenue Analysis",
    categories: ["Insurance", "Vehicle Finance", "Accessories", "Apparels"],
    colors: {
      own: ['rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
      sub: ['rgba(236, 72, 153, 0.8)', 'rgba(244, 114, 182, 0.8)', 'rgba(236, 72, 153, 0.6)', 'rgba(244, 114, 182, 0.6)']
    },
    borders: {
      own: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)'],
      sub: ['rgba(236, 72, 153, 1)', 'rgba(244, 114, 182, 1)', 'rgba(236, 72, 153, 0.8)', 'rgba(244, 114, 182, 0.8)']
    }
  }
};

const PERIODS = [
  { label: "Yesterday", value: "YESTERDAY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Year to Date", value: "YTD" }
];

const LocationRevenueDetails = ({ type = 'sales', amount, count, period }) => {
  const [selectedType, setSelectedType] = useState('own');
  const [chartData, setChartData] = useState(null);
  const config = TYPES_CONFIG[type];

  useEffect(() => {
    // Get both own and sub locations
    const ownLocations = locations.find(loc => loc.type === 'own')?.cities || [];
    const subLocations = locations.find(loc => loc.type === 'sub')?.cities || [];
    const categoryCount = config.categories.length;

    // Apply multiplier based on period
    const periodMultipliers = {
      'YESTERDAY': 1,
      'WEEKLY': 7,
      'MONTHLY': 30,
      'YTD': 365
    };
    const multiplier = periodMultipliers[period] || 1;

    // Split total count between own and sub (65% own, 35% sub for example)
    const ownCount = Math.round(count * 0.65);
    const subCount = count - ownCount;

    // Split amount proportionally to counts
    const ownAmount = Math.round(amount * (ownCount / count));
    const subAmount = amount - ownAmount;

    // Use locations based on selected type
    const currentLocations = selectedType === 'own' ? ownLocations : subLocations;
    const currentCount = selectedType === 'own' ? ownCount : subCount;
    const currentAmount = selectedType === 'own' ? ownAmount : subAmount;

    // Only use as many locations as we have counts
    const locationsToUse = currentLocations.slice(0, Math.min(currentCount, currentLocations.length));
    
    const getRandomDistribution = (total, parts) => {
      // For higher periods, ensure all categories are used
      const isHigherPeriod = ['WEEKLY', 'MONTHLY', 'YTD'].includes(period);
      const activeParts = isHigherPeriod ? parts : 1 + Math.floor(Math.random() * (parts - 1));
      
      let remaining = total;
      const distribution = new Array(parts).fill(0);
      
      // For higher periods, use all indices
      const activeIndices = isHigherPeriod 
        ? Array.from({ length: parts }, (_, i) => i)
        : [];
        
      // For daily period, randomly select indices
      if (!isHigherPeriod) {
        while (activeIndices.length < activeParts) {
          const idx = Math.floor(Math.random() * parts);
          if (!activeIndices.includes(idx)) {
            activeIndices.push(idx);
          }
        }
      }
      
      activeIndices.sort((a, b) => a - b);
      
      // Distribute values with more variation
      for (let i = 0; i < activeIndices.length - 1; i++) {
        const idx = activeIndices[i];
        const averageRemaining = remaining / (activeIndices.length - i);
        // Adjust distribution range based on period
        const minRatio = isHigherPeriod ? 0.4 : 0.2;
        const maxRatio = isHigherPeriod ? 0.6 : 0.8;
        const min = Math.floor(averageRemaining * minRatio);
        const max = Math.ceil(averageRemaining * maxRatio);
        const current = Math.floor(Math.random() * (max - min + 1)) + min;
        
        distribution[idx] = current;
        remaining -= current;
      }
      
      // Put remaining in last active index
      distribution[activeIndices[activeIndices.length - 1]] = remaining;
      
      return distribution;
    };

    const data = locationsToUse.map(city => {
      const locationCount = Math.max(1, Math.round((currentCount / locationsToUse.length) * multiplier));
      const locationAmount = Math.round((currentAmount / locationsToUse.length) * multiplier);

      // Get random distributions
      const countDistribution = getRandomDistribution(locationCount, config.categories.length);
      
      // Generate amount distribution only for categories with non-zero counts
      const amountDistribution = new Array(config.categories.length).fill(0);
      const nonZeroCategories = countDistribution.reduce((acc, count, idx) => {
        if (count > 0) acc.push(idx);
        return acc;
      }, []);
      
      if (nonZeroCategories.length > 0) {
        let remainingAmount = locationAmount;
        nonZeroCategories.forEach((idx, i) => {
          const countRatio = countDistribution[idx] / locationCount;
          amountDistribution[idx] = i === nonZeroCategories.length - 1
            ? remainingAmount
            : Math.round(locationAmount * countRatio);
          remainingAmount -= amountDistribution[idx];
        });
      }

      const categoryData = config.categories.map((category, index) => ({
        category,
        amount: amountDistribution[index],
        count: countDistribution[index]
      }));

      return {
        city,
        categoryData,
        totalAmount: locationAmount,
        totalCount: locationCount
      };
    });

    setChartData({
      labels: data.map(item => item.city),
      datasets: config.categories.map((category, index) => ({
        label: category,
        data: data.map(item => {
          const categoryData = item.categoryData.find(c => c.category === category);
          // Only return amount if count is greater than 0
          return categoryData?.count > 0 ? categoryData.amount : 0;
        }),
        backgroundColor: config.colors[selectedType][index],
        borderColor: config.borders[selectedType][index],
        borderWidth: 1,
        borderRadius: 5,
        stack: 'Stack 0',
      })),
      _custom: data,
    });
  }, [type, selectedType, amount, count, period, config]);

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
                `  • Count: ${data.count}`,
                ''
              );
            });

            lines.push(
              `Total ${type.charAt(0).toUpperCase() + type.slice(1)}:`,
              `  • Amount: ₹${cityData.totalAmount.toLocaleString()}`,
              `  • Count: ${cityData.totalCount}`
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
    <div className="p-4">
      <div className="flex justify-end mb-6">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="own">Own</SelectItem>
            <SelectItem value="sub">Sub</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[400px]">
        {chartData && <Bar data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default LocationRevenueDetails;
