import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import {
  BRANDS,
  SERVICE_TYPES,
  OTHER_TYPES,
} from "../_constants/chartConstants";

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
  YTD: { min: 10001, max: 20000 },
};

const AMOUNT_RANGES = {
  YESTERDAY: { min: 10000, max: 100000 },
  WEEKLY: { min: 100001, max: 1000000 },
  MONTHLY: { min: 1000001, max: 10000000 },
  YTD: { min: 10000001, max: 100000000 },
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
        {/* <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill="#666">
          {`${Math.round(payload.count).toLocaleString()} ${
            selectedCard === "sales" ? "vehicles" : "services"
          }`}{" "}
        </text> */}
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
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://192.168.0.12:5001/api/job-card/count"
      );
      setChartData(response.data.data);
      console.log("chartdata=>", response.data.data);
    };
    fetchData();
  }, []);

  // Process data based on selectedCard type
  const processedData = useMemo(() => {
    if (!chartData) return [];

    // Convert the chartData object into an array of objects
    const dataArray = [
      { name: "Labour Amount", value: chartData.labourAmount, fill: "#8884d8" },
      { name: "Part Amount", value: chartData.partAmount, fill: "#82ca9d" },
    ];

    if (selectedCard === "sales") {
      // For sales, filter out entries with a value of 0
      return dataArray.filter((item) => item.value > 0);
    } else if (selectedCard === "others") {
      // For others, ensure each entry has a minimum value of 1
      return dataArray.map((item) => ({
        ...item,
        value: Math.max(1, item.value),
      }));
    } else {
      // For services, simply return the converted array
      return dataArray;
    }
  }, [chartData, selectedCard]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  if (!selectedCard || !period || !data) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-gray-500">Select a card to view details</p>
      </div>
    );
  }

  // Calculate totals using filtered/processed data
  const totalValue = Math.round(
    processedData.reduce((sum, item) => sum + item.value, 0)
  );
  const totalCount = Math.round(
    processedData.reduce((sum, item) => sum + item.count, 0)
  );

  return (
    <div className="p-4">
      <div className="flex justify-end items-center mb-4">
        <span className="text-sm font-medium text-gray-600">
          {PERIODS.find((p) => p.value === period)?.label || period}
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
                {/* <TableHead>Count</TableHead> */}
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm">
              <TableRow>
                <TableCell className="font-medium py-1">Part revenue</TableCell>
                <TableCell className="text-right py-1">
                  {chartData.partAmount}
                </TableCell>
                <TableCell className="text-right py-1">
                  {Math.ceil(
                    (chartData?.partAmount /
                      (chartData?.labourAmount + chartData?.partAmount)) *
                      100
                  )}{" "}
                  %
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium py-1">
                  Labour Amount
                </TableCell>
                <TableCell className="text-right py-1">
                  {chartData?.labourAmount}
                </TableCell>
                <TableCell className="text-right py-1">
                  {Math.ceil(
                    (chartData?.labourAmount /
                      (chartData?.labourAmount + chartData?.partAmount)) *
                      100
                  )}{" "}
                  %
                </TableCell>
              </TableRow>
              <TableRow className="font-semibold bg-muted/50">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">
                  {chartData.totalAmount}
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
