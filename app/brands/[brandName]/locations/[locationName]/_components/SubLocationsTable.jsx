"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { locations } from "@/lib/constants";
import { ArrowDownUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Helper functions to generate random data
const getRandomNumber = (min, max) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const formatCurrency = (amount) => 
  `₹${amount.toLocaleString('en-IN')}`;

const generateRandomData = (subLocationName) => ({
  subLocationName,
  sales: getRandomNumber(1000, 10000),
  expenses: formatCurrency(getRandomNumber(500000, 2000000)),
  revenue: formatCurrency(getRandomNumber(1000000, 5000000)),
  profitLoss: formatCurrency(getRandomNumber(-500000, 1000000)),
});

const SubLocationsTable = ({ subLocationNames, otherTabs }) => {
  const { brandName, locationName } = useParams();
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Get sub-locations from constants.js (sub type)
    const subLocations = locations.find(loc => loc.type === "sub")?.cities || [];
    // Take only first 3 sub-locations
    const limitedSubLocations = subLocations.slice(0, 3);
    const data = limitedSubLocations.map(generateRandomData);
    setTableData(data);
  }, []);

  const sortedLocations = [...tableData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = typeof a[sortConfig.key] === 'string' && a[sortConfig.key].includes('₹')
        ? parseFloat(a[sortConfig.key].replace(/[^0-9.-]+/g, ""))
        : a[sortConfig.key];
      const bValue = typeof b[sortConfig.key] === 'string' && b[sortConfig.key].includes('₹')
        ? parseFloat(b[sortConfig.key].replace(/[^0-9.-]+/g, ""))
        : b[sortConfig.key];
      
      if (sortConfig.direction === "ascending") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getFirstLetter = (tab) => {
    return tab ? tab.charAt(0) : "";
  };

  const firstLetters = otherTabs.map((tab) => getFirstLetter(tab));
  const randomDecision =
    Math.random() < 0.5 &&
    firstLetters.map((letter, index) => (
      <span key={index} className="text-xs text-gray-500">
        ({letter})
      </span>
    ));

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Sub-Location Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableCell className="font-semibold text-gray-500">
                Location Name
              </TableCell>
              <TableCell
                className="font-semibold text-gray-500 cursor-pointer"
                onClick={() => requestSort("sales")}
              >
                <span className="ml-2 flex items-center gap-2">
                  No. of Sales
                  <ArrowDownUp className="size-4" />
                </span>
              </TableCell>
              <TableCell
                className="font-semibold text-gray-500 cursor-pointer"
                onClick={() => requestSort("expenses")}
              >
                <span className="ml-2 flex items-center gap-2">
                  Expenses
                  <ArrowDownUp className="size-4" />
                </span>
              </TableCell>
              <TableCell
                className="font-semibold text-gray-500 cursor-pointer"
                onClick={() => requestSort("revenue")}
              >
                <span className="ml-2 flex items-center gap-2">
                  Revenue
                  <ArrowDownUp className="size-4" />
                </span>
              </TableCell>
              <TableCell
                className="font-semibold text-gray-500 cursor-pointer"
                onClick={() => requestSort("profitLoss")}
              >
                <span className="ml-2 flex items-center gap-2">
                  Profit/Loss
                  <ArrowDownUp className="size-4" />
                </span>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLocations.map((location, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="text-gray-700">
                  <Link
                    href={`/brands/${brandName}/locations/${locationName}/sublocations/${location.subLocationName}`}
                    className="flex items-center gap-2"
                  >
                    {location.subLocationName}
                    {randomDecision}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-700">
                  {location.sales}
                </TableCell>
                <TableCell className="text-gray-700">
                  {location.expenses}
                </TableCell>
                <TableCell className="text-gray-700">
                  {location.revenue}
                </TableCell>
                <TableCell className="text-gray-700">
                  {location.profitLoss}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SubLocationsTable;
