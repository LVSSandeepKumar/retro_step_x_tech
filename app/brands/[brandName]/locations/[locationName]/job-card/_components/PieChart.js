import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Customized } from 'recharts';

const RADIAN = Math.PI / 180;

const data = [
  { name: 'A', value: 20, color: '#ff0000' },
  { name: 'B', value: 45, color: '#FFA500' },
  { name: 'C', value: 25, color: ' #00FF00' },
];

const cx = 200;
const cy = 200;
const innerRadius = 50;
const outerRadius = 100;
const initialNeedleValue = 0; // Initial value for the needle
const finalNeedleValue = 50; // Final value to point the needle at

// Needle component: now wrapped in a <g> for proper SVG grouping
const Needle = ({ needleValue, data, cx, cy, iR, oR, color }) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const ang = 180.0 * (1 - needleValue / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx;
  const y0 = cy;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return (
    <g>
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />
      <path
        d={`M${xba} ${yba} L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
        fill={color}
        stroke="none"
      />
    </g>
  );
};

const PieCharts = () => {
  const [needleValue, setNeedleValue] = useState(initialNeedleValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setNeedleValue((prevValue) => {
        if (prevValue >= finalNeedleValue) {
          clearInterval(interval);
          return finalNeedleValue;
        }
        return prevValue + 1;
      });
    }, 20); // Adjust the speed of the needle movement

    return () => clearInterval(interval);
  }, []);

  return (
    <PieChart width={400} height={300}>
      <Pie
        dataKey="value"
        startAngle={180}
        endAngle={0}
        data={data}
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        fill="#8884d8"
        stroke="none"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      {/* Render the Needle using Customized */}
      <Customized
        component={() => (
          <Needle
            needleValue={needleValue}
            data={data}
            cx={cx}
            cy={cy}
            iR={innerRadius}
            oR={outerRadius}
            color="#000000"
          />
        )}
      />
    </PieChart>
  );
};

export default PieCharts;
