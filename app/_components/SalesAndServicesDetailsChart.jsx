import React, { useState, useEffect } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

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

  useEffect(() => {
    if (selectedCard) {
      setData(generateData(period));
    }
  }, [period, selectedCard]);

  const generateData = (period) => {
    // Base value based on period (matching SelectionGrid scale)
    const baseValues = {
      YESTERDAY: Math.random() * (99999 - 10000) + 100000,
      WEEKLY: Math.random() * (999999 - 100000) + 1000000,
      MONTHLY: Math.random() * (999999 - 500000) + 5000000,
      YTD: Math.random() * (9999999 - 1000000) + 10000000,
    };

    const total = baseValues[period];
    setTotalValue(total);
    let remaining = total;
    const items = selectedCard === "sales" ? BRANDS : selectedCard === "services" ? SERVICE_TYPES : selectedCard === "others" ? OTHER_TYPES : [];
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

    // Distribution ratios
    const percentages =
      selectedCard === "sales"
        ? [0.37, 0.31, 0.26, 0.2] // For brands
        : [0.4, 0.3, 0.2, 0.1]; // For services

    return items.map((item, index) => {
      const isLast = index === items.length - 1;
      const value = isLast ? remaining : Math.round(total * percentages[index]);
      remaining -= value;

      // Generate random count based on value
      const count = Math.floor(
        value / (Math.random() * (20000 - 10000) + 10000) + 1
      );

      return {
        name: item,
        value: value,
        count: count,
        fill: colors[index],
      };
    });
  };

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
    <div className="bg-white rounded-lg shadow-md p-4 h-[404px]">
      {" "}
      {/* Fixed height to match other cards */}
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
        <span className="text-sm font-medium text-gray-700">
          {PERIODS.find(p => p.value === period)?.label || period}
        </span>
      </div>

      <div className="flex items-center gap-4 justify-start">
        {/* Chart Section */}
        <div className="w-1/2 h-[300px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape({ selectedCard })}
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

        {/* Table Section */}
        <div className="w-1/2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">
                    ₹{Math.round(item.value).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.count.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Color Legend Section */}
      <div className="flex flex-wrap gap-4 justify-center mt-4 pb-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-sm text-gray-600">
              {item.name} ({(item.value / totalValue * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesAndServicesDetailsChart;
