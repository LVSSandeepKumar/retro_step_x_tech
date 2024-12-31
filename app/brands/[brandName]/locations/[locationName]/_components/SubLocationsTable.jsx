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
import { ArrowDownUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const SubLocationsTable = ({ subLocationNames, otherTabs }) => {
  const { brandName, locationName } = useParams();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [randomData, setRandomData] = useState([]);

  useEffect(() => {
    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const data = subLocationNames.map((subLocationName) => ({
      subLocationName,
      sales: generateRandomNumber(1000, 10000),
      expenses: generateRandomNumber(500, 5000),
      revenue: generateRandomNumber(2000, 15000),
      profitLoss:
        generateRandomNumber(2000, 15000) - generateRandomNumber(500, 5000),
    }));
    setRandomData(data);
  }, [subLocationNames]);

  const sortedLocations = [...randomData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
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
                className="font-semibold text-gray-500"
                onClick={() => requestSort("sales")}
              >
                <span className="ml-2 flex items-center gap-2">
                  No. of Sales
                  <ArrowDownUp className="size-4" />
                </span>
              </TableCell>
              <TableCell
                className="font-semibold text-gray-500"
                onClick={() => requestSort("expenses")}
              >
                <span className="ml-2 flex items-center gap-2">
                  Expenses
                  <ArrowDownUp className="size-4" />
                </span>
              </TableCell>
              <TableCell
                className="font-semibold text-gray-500"
                onClick={() => requestSort("revenue")}
              >
                <span className="ml-2 flex items-center gap-2">
                  Revenue
                  <ArrowDownUp className="size-4" />
                </span>
              </TableCell>
              <TableCell
                className="font-semibold text-gray-500"
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
