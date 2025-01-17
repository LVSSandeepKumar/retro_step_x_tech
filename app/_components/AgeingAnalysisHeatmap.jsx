import React, { useEffect, useState } from 'react';
import { vehicleInsuranceProviders } from '@/lib/constants';
import { Bar } from 'react-chartjs-2';

const AGEING_CATEGORIES = ["0-4 days", "5-10 days", "11-25 days", "26-45 days", "Above 45 days"];
const DAYS_RANGES = {
  "0-4 days": { min: 0, max: 4 },
  "5-10 days": { min: 5, max: 10 },
  "11-25 days": { min: 11, max: 25 },
  "26-45 days": { min: 26, max: 45 },
  "Above 45 days": { min: 46, max: 90 }
};

const AgeingAnalysisHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null, // category index
    direction: 'desc'
  });

  useEffect(() => {
    // Generate data for each insurance provider and ageing category
    const data = vehicleInsuranceProviders
      .map(company => ({
        name: company.replace(' Insurance', '').replace(' General', ''),
        categories: AGEING_CATEGORIES.map(category => ({
          category,
          cases: Math.floor(Math.random() * (30 - 5) + 1)
        }))
      }));

    setHeatmapData(data);
  }, []);

  // Sorting function
  const sortData = (data, categoryIndex) => {
    if (categoryIndex === null) return data;

    return [...data].sort((a, b) => {
      const aValue = a.categories[categoryIndex].cases;
      const bValue = b.categories[categoryIndex].cases;
      
      if (sortConfig.direction === 'asc') {
        return aValue - bValue;
      }
      return bValue - aValue;
    });
  };

  // Handle column header click
  const handleSort = (categoryIndex) => {
    setSortConfig(current => ({
      key: categoryIndex,
      direction: current.key === categoryIndex && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedData = sortData(heatmapData, sortConfig.key);

  // Find max cases for color scaling
  const maxCases = Math.max(
    ...sortedData.flatMap(company => 
      company.categories.map(cat => cat.cases)
    )
  );

  // Update getColor function to focus on days
  const getColor = (category) => {
    const daysRange = DAYS_RANGES[category];
    const avgDays = (daysRange.min + daysRange.max) / 2;
    const maxDays = 90; // Maximum days we consider
    const intensity = Math.min((avgDays / maxDays) * 100, 100);

    // Use a single color (red) with varying intensity
    const baseColor = {
      r: 239,  // Red base
      g: 68,   // Red base
      b: 68    // Red base
    };

    // Calculate alpha based on days
    const alpha = 0.2 + (intensity / 100) * 0.8;

    return `linear-gradient(135deg, 
      rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha}), 
      rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha + 0.1}))`;
  };

  const totalCases = sortedData.reduce((total, company) => 
    total + company.categories.reduce((sum, cat) => sum + cat.cases, 0), 0
  );

  // Move getBarColor function before barData definition
  const getBarColor = (company) => {
    let totalDays = 0;
    let totalCases = 0;

    company.categories.forEach((cat) => {
      const daysRange = DAYS_RANGES[cat.category];
      const avgDays = (daysRange.min + daysRange.max) / 2;
      totalDays += avgDays * cat.cases;
      totalCases += cat.cases;
    });

    const avgDays = totalDays / totalCases;
    const intensity = Math.min((avgDays / 90) * 100, 100);
    return `rgba(239, 68, 68, ${0.2 + (intensity / 100) * 0.8})`;
  };

  // Remove calculateAmount function and simplify bar options and data
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}`
        },
      },
      y: {
        display: false,
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => {
            const cases = context.raw;
            // Generate random amount based on number of cases
            const baseAmount = 10000;
            const randomMultiplier = Math.random() * 0.5 + 0.75; // Random between 0.75 and 1.25
            const amount = Math.round(cases * baseAmount * randomMultiplier);
            
            return [
              `Cases: ${cases}`,
              `Amount: ₹${new Intl.NumberFormat('en-IN').format(amount)}`
            ];
          }
        }
      }
    }
  };

  // Simplify barData structure
  const barData = {
    labels: sortedData.map(company => company.name),
    datasets: [{
      data: sortedData.map(company => 
        company.categories.reduce((sum, cat) => sum + cat.cases, 0)
      ),
      backgroundColor: sortedData.map(company => getBarColor(company)),
      borderColor: sortedData.map(company => getBarColor(company).replace('0.6', '1')),
      borderWidth: 1,
      borderRadius: 5,
      barPercentage: 1,
      categoryPercentage: 0.8
    }]
  };

  // Update Legend component
  const Legend = () => (
    <div className="mt-6 flex items-center justify-end gap-4 text-sm text-gray-600">
      {AGEING_CATEGORIES.map((category, index) => (
        <div key={index} className="flex items-center gap-1">
          <div 
            className="w-16 h-4 rounded" 
            style={{ background: getColor(category) }}
          />
          <span>{category}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <div className="text-sm font-medium text-red-500">
          Total Cases: {totalCases}
        </div>
      </div>
      
      <div className="flex gap-6">
        {/* Heatmap section - reduced width */}
        <div className="w-[70%] relative overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left">Company</th>
                {AGEING_CATEGORIES.map((category, index) => (
                  <th 
                    key={category} 
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort(index)}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {category}
                      {sortConfig.key === index && (
                        <span className="text-xs">
                          {sortConfig.direction === 'desc' ? '↓' : '↑'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((company, i) => (
                <tr key={company.name}>
                  <td className="px-3 py-2 font-medium">{company.name}</td>
                  {company.categories.map((cat) => (
                    <td 
                      key={`${company.name}-${cat.category}`}
                      className="px-3 py-2 text-center relative hover:shadow-lg"
                      style={{ 
                        background: getColor(cat.category),
                        transition: 'all 0.3s ease',
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        setHoveredCell({
                          company: company.name,
                          ...cat,
                          x: e.clientX,
                          y: e.clientY
                        });
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <span className="text-sm font-semibold text-gray-900">
                        {cat.cases}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tooltip */}
          {hoveredCell && (
            <div 
              className="fixed bg-gray-900 text-white px-3 py-2 rounded-md text-sm shadow-lg z-20"
              style={{ 
                left: hoveredCell.x,
                top: hoveredCell.y - 80,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
            >
              <div className="font-medium">{hoveredCell.company}</div>
              <div>{hoveredCell.category}</div>
              <div className="font-bold">{hoveredCell.cases} cases</div>
            </div>
          )}
        </div>

        {/* Bar chart section - adjusted width */}
        <div className="w-[30%] mt-8">
          <div className="h-[516px]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      <Legend />
    </div>
  );
};

export default AgeingAnalysisHeatmap;
