import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useMemo, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";

const SERVICE_TYPES = [
  "Part Sales",
  "Service Sales",
  "Bajaj Claims Warranty",
  "Bajaj Claims Free Service",
];

const OTHER_TYPES = ["Insurance", "Vehicle Finance", "Accessories", "Apparels"];

const BRANDS = ["Vespa", "Tata", "Bajaj", "Triumph"];

const PERIODS = [
  { label: "Yesterday", value: "YESTERDAY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Year to Date", value: "YTD" },
];

const COUNT_RANGES = {
  YESTERDAY: { min: 1, max: 10 },
  WEEKLY: { min: 11, max: 100 },
  MONTHLY: { min: 101, max: 1000 },
  YTD: { min: 10001, max: 20000 }
};

const AMOUNT_RANGES = {
  YESTERDAY: { min: 10000, max: 100000 },
  WEEKLY: { min: 100001, max: 1000000 },
  MONTHLY: { min: 1000001, max: 10000000 },
  YTD: { min: 10000001, max: 100000000 }
};

const generateRandomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const renderActiveShape =
  ({ selectedCard }) =>
  (props) => {
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
      value,
    } = props;

    return (
      <g>
        <text x={cx} y={cy - 30} dy={8} textAnchor="middle" fill="#888">
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill="#333"
          className="text-xl font-semibold"
        >
          ₹{Math.round(value).toLocaleString()} {/* Rounded to whole number */}
        </text>
        <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill="#666">
          {`${Math.round(payload.count).toLocaleString()} ${
            selectedCard === "sales" ? "vehicles" : "services"
          }`}{" "}
          {/* Rounded count */}
        </text>
        <text x={cx} y={cy + 40} dy={8} textAnchor="middle" fill="#666">
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

const SalesAndServicesDetailsChart = ({ selectedCard, period }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  const generateData = useMemo(() => {
    if (!period || !selectedCard) return [];

    const amountRange = AMOUNT_RANGES[period];
    const countRange = COUNT_RANGES[period];
    
    const distributions = {
      sales: [0.4, 0.3, 0.2, 0.1],
      services: [0.4, 0.3, 0.2, 0.1],
      others: [0.35, 0.3, 0.2, 0.15]
    };

    const items = selectedCard === "sales" ? BRANDS 
                : selectedCard === "services" ? SERVICE_TYPES 
                : OTHER_TYPES;
    
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];
    const distribution = distributions[selectedCard];

    let remainingValue = generateRandomInRange(amountRange.min, amountRange.max);
    let remainingCount = generateRandomInRange(countRange.min, countRange.max);

    return items.map((item, index) => {
      const ratio = distribution[index];
      const value = index === items.length - 1 
        ? remainingValue 
        : Math.round(remainingValue * ratio);
      
      const count = index === items.length - 1
        ? remainingCount
        : Math.round(remainingCount * ratio);

      remainingValue -= value;
      remainingCount -= count;

      return {
        name: item,
        value,
        count,
        fill: colors[index],
      };
    });
  }, [period, selectedCard]);

  useEffect(() => {
    if (generateData.length > 0) {
      setData(generateData);
      setTotalValue(generateData.reduce((sum, item) => sum + item.value, 0));
    }
  }, [generateData]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  if (!selectedCard || !period) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center h-[400px]">
        <p className="text-gray-500">Select a card to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[504px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-700">
          {selectedCard === "sales"
            ? "Brand-wise Sales"
            : selectedCard === "services"
            ? "Services Distribution"
            : selectedCard === "others"
            ? "Other Revenue"
            : "Unknown"}
        </h2>
        <span className="text-sm font-medium text-gray-600">
          {PERIODS.find(p => p.value === period)?.label || period}
        </span>
      </div>

      <div className="flex items-center">
        {/* Pie Chart Section */}
        <div className="w-1/2">
          <div className="h-[380px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape({ selectedCard })}
                  data={data}
                  innerRadius={110}
                  outerRadius={150}
                  cx="50%"
                  cy="50%"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Color Labels */}
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table Section */}
        <div className="w-1/2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Count</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm">
              {data.map((item, index) => {
                const total = data.reduce((sum, d) => sum + d.value, 0);
                const percentage = Math.round((item.value / total) * 100); // Rounded to nearest integer
                
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium py-1">{item.name}</TableCell>
                    <TableCell className="py-1">{item.count.toLocaleString()}</TableCell>
                    <TableCell className="text-right py-1">
                      ₹{item.value.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right py-1">{percentage}%</TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="font-semibold bg-muted/50">
                <TableCell>Total</TableCell>
                <TableCell>
                  {data.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  ₹{data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SalesAndServicesDetailsChart);
