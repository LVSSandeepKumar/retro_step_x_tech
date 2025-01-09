import React, { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

const VaryingLine = ({ dataKey, color = "#4f46e5" }) => {
  const [randomData, setRandomData] = useState([]);

  useEffect(() => {
    // Generate 8 random data points between 80000 and 150000
    const generateRandomData = () => {
      return Array.from({ length: 8 }, (_, index) => ({
        name: index,
        value: Math.floor(Math.random() * (150000 - 80000) + 80000)
      }));
    };

    setRandomData(generateRandomData());
  }, []); // Empty dependency array means this runs once on mount

  // Find min and max for domain calculation
  const values = randomData.map(item => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  const domainStart = minValue - (maxValue - minValue) * 0.2;
  const domainEnd = maxValue + (maxValue - minValue) * 0.2;

  return (
    <ResponsiveContainer width="100%" height={50}>
      <LineChart data={randomData}>
        <YAxis 
          hide 
          domain={[domainStart, domainEnd]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={4}
          dot={true}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default VaryingLine;
