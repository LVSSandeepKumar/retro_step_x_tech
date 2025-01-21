"use client";

import React from "react";
import { Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

ChartJS.register(ArcElement, Tooltip, Legend);

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const OSJMonthlyAnalysis = ({ data }) => {
  if (!data) return null;

  const formatCurrency = (amount) =>
    amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  // Modified data preparation for location-centric analysis
  const locationLosses = data
    .filter((item) => item.osjLoss < 0)
    .map((location) => {
      const totalLoss = Math.abs(location.osjLoss);
      
      // Generate 2-3 random months
      const monthCount = 2 + Math.floor(Math.random() * 2);
      const months = new Set();
      while (months.size < monthCount) {
        months.add(Math.floor(Math.random() * 12));
      }

      // Generate proportional losses that sum up to total loss
      let remainingLoss = totalLoss;
      const monthlyData = Array.from(months).map((monthIndex, idx, arr) => {
        let monthValue;
        if (idx === arr.length - 1) {
          // Last month gets the exact remaining amount
          monthValue = remainingLoss;
        } else {
          // Calculate a percentage of remaining loss for this month
          // Using a smaller random factor to ensure more balanced distribution
          const percentage = 1 / (arr.length - idx) + (Math.random() * 0.2);
          monthValue = Math.round(remainingLoss * percentage);
          // Ensure we don't exceed remaining loss
          monthValue = Math.min(monthValue, remainingLoss - (arr.length - idx - 1));
          remainingLoss -= monthValue;
        }

        return {
          month: MONTHS[monthIndex],
          value: monthValue
        };
      });

      // Verification step
      const monthlyTotal = monthlyData.reduce((sum, m) => sum + m.value, 0);
      console.assert(
        monthlyTotal === totalLoss,
        `Monthly total (${monthlyTotal}) doesn't match location total (${totalLoss})`
      );

      return {
        location: location.location,
        totalLoss,
        months: monthlyData.sort((a, b) => b.value - a.value),
      };
    })
    .sort((a, b) => b.totalLoss - a.totalLoss);

  const totalLosses = locationLosses.reduce((sum, loc) => sum + loc.totalLoss, 0);

  // Remove labels from both datasets
  const outerData = {
    labels: [], // Empty array for no labels
    datasets: [{
      data: locationLosses.flatMap(loc => 
        loc.months.map(month => month.value)
      ),
      backgroundColor: locationLosses.flatMap((loc, locIndex) =>
        loc.months.map((_, monthIndex) => 
          `hsl(${locIndex * 360 / locationLosses.length}, 70%, ${50 + (monthIndex * 10)}%, 0.8)`
        )
      ),
      borderColor: 'white',
      borderWidth: 2,
    }]
  };

  // Remove labels from both datasets
  const innerData = {
    labels: [], // Empty array for no labels
    datasets: [{
      data: locationLosses.map(loc => loc.totalLoss),
      backgroundColor: locationLosses.map((_, index) => 
        `hsl(${index * 360 / locationLosses.length}, 70%, 50%, 0.8)`
      ),
      borderColor: 'white',
      borderWidth: 1,
    }]
  };

  // Update chart options for better visualization
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / totalLosses) * 100).toFixed(1);
            const label = context.label || '';
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      },
      legend: {
        display: false // Remove legend/labels
      }
    }
  };

  const outerOptions = {
    ...options,
    cutout: '70%', // Increased cutout for outer ring
    radius: '100%', // Full width for outer ring
  };

  const innerOptions = {
    ...options,
    cutout: '50%', // Less cutout for inner ring to make it more visible
    radius: '65%', // Smaller radius for inner ring
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-red-600">Monthly Loss Analysis</h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="relative aspect-square w-full max-w-[600px] mx-auto">
            {/* Container for both charts with proper positioning */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Outer doughnut (Monthly breakdown) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Doughnut 
                  data={outerData} 
                  options={outerOptions}
                />
              </div>
              
              {/* Inner doughnut (Location totals) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Doughnut 
                  data={innerData} 
                  options={innerOptions}
                />
              </div>

              {/* Center text showing total losses */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Total Losses</div>
                  <div className="text-xl font-bold text-red-600">
                    {formatCurrency(totalLosses)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Table section */}
        <div className="overflow-auto max-h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Loss Amount</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locationLosses.map((location) => (
                <React.Fragment key={location.location}>
                  {/* Location total row */}
                  <TableRow className="bg-gray-50">
                    <TableCell className="font-bold">{location.location}</TableCell>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      -{formatCurrency(location.totalLoss)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {((location.totalLoss / totalLosses) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  {/* Monthly breakdown rows */}
                  {location.months.map((month) => (
                    <TableRow key={`${location.location}-${month.month}`}>
                      <TableCell className="pl-8">└─</TableCell>
                      <TableCell>{month.month}</TableCell>
                      <TableCell className="text-right text-red-600">
                        -{formatCurrency(month.value)}
                      </TableCell>
                      <TableCell className="text-right">
                        {((month.value / totalLosses) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="font-bold">
                  Grand Total
                </TableCell>
                <TableCell className="text-right font-bold text-red-600">
                  -{formatCurrency(totalLosses)}
                </TableCell>
                <TableCell className="text-right font-bold">100%</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default OSJMonthlyAnalysis;
