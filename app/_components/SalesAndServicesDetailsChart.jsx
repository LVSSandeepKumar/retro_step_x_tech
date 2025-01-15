import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState, useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { BRANDS, SERVICE_TYPES, OTHER_TYPES } from '../_constants/chartConstants';

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

const SalesAndServicesDetailsChart = ({ selectedCard, period, data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Process data based on selectedCard type
  const processedData = useMemo(() => {
    if (!data) return [];

    if (selectedCard === 'sales') {
      // For sales, filter out items with 0 count
      return data.filter(item => item.count > 0);
    } else if (selectedCard === 'others') {
      // For others, ensure minimum count of 1
      return data.map(item => ({
        ...item,
        count: Math.max(1, item.count)
      }));
    }
    // For services, use data as is
    return data;
  }, [data, selectedCard]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  if (!selectedCard || !period || !data) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center h-[400px]">
        <p className="text-gray-500">Select a card to view details</p>
      </div>
    );
  }

  // Calculate totals using filtered/processed data
  const totalValue = Math.round(processedData.reduce((sum, item) => sum + item.value, 0));
  const totalCount = Math.round(processedData.reduce((sum, item) => sum + item.count, 0));

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
                  data={processedData}
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
            {processedData.map((item, index) => (
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
                const percentage = Math.round((item.value / totalValue) * 100) || 0;
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium py-1">{item.name}</TableCell>
                    <TableCell className="py-1">{item.count.toLocaleString()}</TableCell>
                    <TableCell className="text-right py-1">
                      {item.count > 0 || selectedCard !== 'sales' ? 
                        `₹${item.value.toLocaleString()}` : 
                        '-'}
                    </TableCell>
                    <TableCell className="text-right py-1">
                      {item.count > 0 || selectedCard !== 'sales' ? 
                        `${percentage}%` : 
                        '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="font-semibold bg-muted/50">
                <TableCell>Total</TableCell>
                <TableCell>{totalCount.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  ₹{totalValue.toLocaleString()}
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
