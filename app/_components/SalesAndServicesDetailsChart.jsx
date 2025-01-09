import React, { useState, useEffect } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SERVICE_TYPES = [
  "Part Sales",
  "Service Sales",
  "Bajaj Claims Warranty",
  "Bajaj Claims Free Service"
];

const BRANDS = ["Vespa", "Tata", "Bajaj", "Triumph"];

const PERIODS = [
  { label: "Yesterday", value: "YESTERDAY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Year to Date", value: "YTD" }
];

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;

  return (
    <g>
      <text x={cx} y={cy-20} dy={8} textAnchor="middle" fill="#888">
        {payload.name}
      </text>
      <text x={cx} y={cy+10} dy={8} textAnchor="middle" fill="#333" className="text-xl font-semibold">
        ₹{value.toLocaleString()}
      </text>
      <text x={cx} y={cy+30} dy={8} textAnchor="middle" fill="#666">
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const SalesAndServicesDetailsChart = ({ selectedCard }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("WEEKLY");
  const [data, setData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  const generateData = (period) => {
    // Base value based on period (matching SelectionGrid scale)
    const baseValues = {
      'YESTERDAY': Math.random() * (99999 - 10000) + 10000,
      'WEEKLY': Math.random() * (999999 - 100000) + 100000,
      'MONTHLY': Math.random() * (999999 - 500000) + 500000,
      'YTD': Math.random() * (9999999 - 1000000) + 1000000,
    };

    const total = baseValues[period];
    setTotalValue(total);
    let remaining = total;
    const items = selectedCard === 'sales' ? BRANDS : SERVICE_TYPES;
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];
    
    // Distribution ratios
    const percentages = selectedCard === 'sales' 
      ? [0.3, 0.3, 0.2, 0.2]  // For brands
      : [0.4, 0.3, 0.2, 0.1]; // For services

    return items.map((item, index) => {
      const isLast = index === items.length - 1;
      const value = isLast ? remaining : Math.round(total * percentages[index]);
      remaining -= value;
      
      return {
        name: item,
        value: value,
        fill: colors[index]
      };
    });
  };

  useEffect(() => {
    if (selectedCard) {
      setData(generateData(selectedPeriod));
    }
  }, [selectedPeriod, selectedCard]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  if (!selectedCard) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center h-[400px]">
        <p className="text-gray-500">Select a card to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[404px]"> {/* Fixed height to match other cards */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-700">
          {selectedCard === 'sales' ? 'Brand-wise Sales' : 'Services Distribution'}
        </h2>
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
      
      <div className="h-[350px]"> {/* Adjusted height */}
        <ResponsiveContainer>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              innerRadius={100}
              outerRadius={140}
              cx="50%"
              cy="50%"
              dataKey="value"
              onMouseEnter={onPieEnter}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesAndServicesDetailsChart;
