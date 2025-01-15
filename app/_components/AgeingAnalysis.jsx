import React, { useEffect, useState } from 'react';
import { vehicleInsuranceProviders } from '@/lib/constants';
import { Bar } from 'react-chartjs-2';

const AGEING_CATEGORIES = ["0-4 days", "5-10 days", "11-25 days", "26-45 days", "Above 45 days"];

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

  // New getColor function that considers both cases and aging period
  const getColor = (value, categoryIndex) => {
    const intensity = (value / maxCases) * 100;
    const agingFactor = categoryIndex / (AGEING_CATEGORIES.length - 1); // 0 to 1
    
    // Base colors for different states
    const colors = {
      safe: { r: 34, g: 197, b: 94 },    // green
      warn: { r: 234, g: 179, b: 8 },    // yellow
      danger: { r: 239, g: 68, b: 68 }   // red
    };

    // Calculate color based on both factors
    let finalColor;
    if (intensity < 33) {
      // Low number of cases
      if (agingFactor < 0.3) {
        // Recent cases - more green
        finalColor = colors.safe;
      } else if (agingFactor < 0.6) {
        // Mid-aged cases - yellow-green
        finalColor = {
          r: Math.floor(colors.safe.r + (colors.warn.r - colors.safe.r) * agingFactor),
          g: Math.floor(colors.safe.g + (colors.warn.g - colors.safe.g) * agingFactor),
          b: Math.floor(colors.safe.b + (colors.warn.b - colors.safe.b) * agingFactor)
        };
      } else {
        // Older cases - yellow
        finalColor = colors.warn;
      }
    } else if (intensity < 66) {
      // Medium number of cases
      if (agingFactor < 0.3) {
        // Recent cases - yellow-green
        finalColor = {
          r: Math.floor(colors.safe.r + (colors.warn.r - colors.safe.r) * 0.5),
          g: Math.floor(colors.safe.g + (colors.warn.g - colors.safe.g) * 0.5),
          b: Math.floor(colors.safe.b + (colors.warn.b - colors.safe.b) * 0.5)
        };
      } else if (agingFactor < 0.6) {
        // Mid-aged cases - yellow
        finalColor = colors.warn;
      } else {
        // Older cases - orange
        finalColor = {
          r: Math.floor(colors.warn.r + (colors.danger.r - colors.warn.r) * 0.5),
          g: Math.floor(colors.warn.g + (colors.danger.g - colors.warn.g) * 0.5),
          b: Math.floor(colors.warn.b + (colors.danger.b - colors.warn.b) * 0.5)
        };
      }
    } else {
      // High number of cases
      if (agingFactor < 0.3) {
        // Recent cases - yellow
        finalColor = colors.warn;
      } else if (agingFactor < 0.6) {
        // Mid-aged cases - orange-red
        finalColor = {
          r: Math.floor(colors.warn.r + (colors.danger.r - colors.warn.r) * 0.7),
          g: Math.floor(colors.warn.g + (colors.danger.g - colors.warn.g) * 0.7),
          b: Math.floor(colors.warn.b + (colors.danger.b - colors.warn.b) * 0.7)
        };
      } else {
        // Older cases - red
        finalColor = colors.danger;
      }
    }

    const alpha = 0.2 + (intensity / 100) * 0.6; // Opacity increases with intensity
    return `linear-gradient(135deg, 
      rgba(${finalColor.r}, ${finalColor.g}, ${finalColor.b}, ${alpha}), 
      rgba(${finalColor.r}, ${finalColor.g}, ${finalColor.b}, ${alpha + 0.2}))`;
  };

  const totalCases = sortedData.reduce((total, company) => 
    total + company.categories.reduce((sum, cat) => sum + cat.cases, 0), 0
  );

  // Update bar chart options to hide labels
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
        display: false, // Hide y-axis labels (company names)
        grid: {
          display: false // Hide y-axis grid lines
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (context) => context[0].label, // Show company name as title
          label: (context) => {
            return `${context.raw} cases`;
          }
        }
      }
    },
  };

  // Add this new function after getColor function
  const getCompanyIntensity = (company) => {
    const totalCases = company.categories.reduce((sum, cat) => sum + cat.cases, 0);
    let weightedSum = 0;
    
    company.categories.forEach((cat, index) => {
      const agingFactor = index / (AGEING_CATEGORIES.length - 1);
      weightedSum += cat.cases * (1 + agingFactor); // Higher weight for older cases
    });
    
    return weightedSum / totalCases;
  };

  const getBarColor = (company) => {
    const intensity = getCompanyIntensity(company);
    
    const colors = {
      safe: { r: 34, g: 197, b: 94 },    // green
      warn: { r: 234, g: 179, b: 8 },    // yellow
      danger: { r: 239, g: 68, b: 68 }   // red
    };

    let finalColor;
    if (intensity < 1.3) {
      finalColor = colors.safe;
    } else if (intensity < 1.6) {
      const factor = (intensity - 1.3) / 0.3;
      finalColor = {
        r: Math.floor(colors.safe.r + (colors.warn.r - colors.safe.r) * factor),
        g: Math.floor(colors.safe.g + (colors.warn.g - colors.safe.g) * factor),
        b: Math.floor(colors.safe.b + (colors.warn.b - colors.safe.b) * factor)
      };
    } else if (intensity < 2.0) {
      const factor = (intensity - 1.6) / 0.4;
      finalColor = {
        r: Math.floor(colors.warn.r + (colors.danger.r - colors.warn.r) * factor),
        g: Math.floor(colors.warn.g + (colors.danger.g - colors.warn.g) * factor),
        b: Math.floor(colors.warn.b + (colors.danger.b - colors.warn.b) * factor)
      };
    } else {
      finalColor = colors.danger;
    }

    return `rgba(${finalColor.r}, ${finalColor.g}, ${finalColor.b}, 0.6)`;
  };

  // Update barData to use dynamic colors
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
    }],
  };

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
                  {company.categories.map((cat, categoryIndex) => (
                    <td 
                      key={`${company.name}-${cat.category}`}
                      className="px-3 py-2 text-center relative hover:shadow-lg"
                      style={{ 
                        background: getColor(cat.cases, categoryIndex),
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

      {/* Updated Legend with new colors */}
      <div className="mt-6 flex items-center justify-end gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-16 h-4 rounded" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.3))' }}></div>
          <span>Lower</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-16 h-4 rounded" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.5), rgba(234, 179, 8, 0.3))' }}></div>
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-16 h-4 rounded" style={{ background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.5), rgba(234, 179, 8, 0.7))' }}></div>
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-16 h-4 rounded" style={{ background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.7), rgba(239, 68, 68, 0.7))' }}></div>
          <span>High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-16 h-4 rounded" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(239, 68, 68, 0.9))' }}></div>
          <span>Higher</span>
        </div>
      </div>
    </div>
  );
};

export default AgeingAnalysisHeatmap;
