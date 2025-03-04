import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const RADIAN = Math.PI / 180;

const data = [
  { name: 'A', value: 80, color: '#ff0000' },
  { name: 'B', value: 45, color: '#00ff00' },
  { name: 'C', value: 25, color: '#0000ff' },
];

const cx = 150;
const cy = 200;
const innerRadius = 50;
const outerRadius = 100;
const needleValue = 50; // Value to point the needle at

const Needle = ({ value, data, cx, cy, iR, oR, color }) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return (
    <>
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />
      <path
        d={`M${xba} ${yba} L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
        fill={color}
        stroke="none"
      />
    </>
  );
};

const PieCharts = () => {
  return (
    <PieChart width={400} height={500}>
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
      <Needle
        value={needleValue}
        data={data}
        cx={cx}
        cy={cy}
        iR={innerRadius}
        oR={outerRadius}
        color="#000000"
        
      />
    </PieChart>
  );
};

export default PieCharts;
