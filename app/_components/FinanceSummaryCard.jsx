import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, RefreshCwIcon, ChartBarIcon } from "lucide-react";

const PERIODS = {
  WEEKLY: "Weekly",
  YESTERDAY: "Yesterday",
  MONTHLY: "This Month",
  YTD: "Year to Date",
};

export default function FinanceSummary({ periodValues, onPeriodChange }) {
  const handlePeriodChange = (newPeriod) => {
    onPeriodChange(newPeriod);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-lg font-bold text-gray-500">Total Collections</h1>
        <p className="text-3xl font-bold text-gray-700">
          ₹ {(periodValues.cash + periodValues.upi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </p>
      </div>

      {/* Cash Collections Section */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-gray-100 rounded-full">
            <RefreshCwIcon className="size-5 text-gray-500" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                {periodValues.period} <ChevronDownIcon className="size-4 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(PERIODS).map((period) => (
                <DropdownMenuItem key={period} onSelect={() => handlePeriodChange(period)}>
                  {period}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <h1 className="text-md font-medium text-gray-900">
            Cash Collections
          </h1>
          <p className="text-2xl font-bold text-gray-900">
            <span className="text-purple-500 mr-2">₹</span>
            {periodValues.cash.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>

      <div className="border-b border-gray-200" />

      {/* UPI Collections */}
      <div className="flex flex-col gap-4 mb-6 mt-4">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-gray-100 rounded-full">
            <RefreshCwIcon className="size-5 text-gray-500" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                {periodValues.period} <ChevronDownIcon className="size-4 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(PERIODS).map((period) => (
                <DropdownMenuItem key={period} onSelect={() => handlePeriodChange(period)}>
                  {period}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <h1 className="text-md font-medium text-gray-900">UPI Collections</h1>
          <p className="text-2xl font-bold text-gray-900">
            <span className="text-purple-500 mr-2">₹</span>
            {periodValues.upi.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>

      {/* Chart Mode Button */}
      <div className="flex items-center justify-end gap-2 mt-4 text-red-500">
        <ChartBarIcon className="w-5 h-5" />
        <button className="text-sm font-medium hover:underline">
          View on chart mode
        </button>
      </div>
    </div>
  );
}
