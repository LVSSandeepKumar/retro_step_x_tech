import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { locations, indianFirstNames, indianLastNames } from "@/lib/constants";
import { ArrowDownUp } from "lucide-react";
import Link from "next/link";

// Helper functions to generate random data
const getRandomNumber = (min, max) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomName = () => {
  const firstName = indianFirstNames[Math.floor(Math.random() * indianFirstNames.length)];
  const lastName = indianLastNames[Math.floor(Math.random() * indianLastNames.length)];
  return `${firstName} ${lastName}`;
};

const formatCurrency = (amount) => 
  `₹${amount.toLocaleString('en-IN')}`;

const generateRandomLocationData = (locationName) => ({
  locationName,
  salesDetails: {
    noOfSales: getRandomNumber(1000, 5000),
    totalSales: formatCurrency(getRandomNumber(1000000, 5000000))
  },
  operationalExpenses: {
    annual: formatCurrency(getRandomNumber(500000, 2000000))
  },
  headOfBrand: getRandomName()
});

const LocationDetailsTable = ({ brandName }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Get location names from constants.js (own type)
  const allOwnLocations = locations.find(loc => loc.type === "own")?.cities || [];
  const ownLocations = allOwnLocations.slice(0, 5);
  const locationData = ownLocations.map(generateRandomLocationData);

  const getNestedValue = (obj, key) => {
    return key.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const sortedLocations = [...locationData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);
      
      // Handle currency string comparisons
      const aNum = typeof aValue === 'string' && aValue.includes('₹') 
        ? parseFloat(aValue.replace(/[^0-9.-]+/g, ""))
        : aValue;
      const bNum = typeof bValue === 'string' && bValue.includes('₹')
        ? parseFloat(bValue.replace(/[^0-9.-]+/g, ""))
        : bValue;

      if (sortConfig.direction === "ascending") {
        return aNum > bNum ? 1 : -1;
      } else {
        return aNum < bNum ? 1 : -1;
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

  const calculateProfitLoss = (sales, expenses) => {
    const salesNum = parseFloat(sales.replace(/[^0-9.-]+/g, ""));
    const expensesNum = parseFloat(expenses.replace(/[^0-9.-]+/g, ""));
    return formatCurrency(salesNum - expensesNum);
  };

  return (
    <Card className="border p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Location Details
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
                onClick={() => requestSort("salesDetails.noOfSales")}
              >
                No. of Sales{" "}
                <span className="ml-2">
                  <ArrowDownUp className="size-4" />
                </span>
              </TableCell>
              <TableCell
                className="font-semibold text-gray-500"
                onClick={() => requestSort("operationalExpenses.annual")}
              >
                Expenses{" "}
                <span className="ml-2">
                  <ArrowDownUp className="size-4" />
                </span>
              </TableCell>
              <TableCell
                className="font-semibold text-gray-500"
                onClick={() => requestSort("salesDetails.totalSales")}
              >
                Revenue{" "}
                <span className="ml-2">
                  <ArrowDownUp className="size-4" />
                </span>
              </TableCell>
              <TableCell
                className="font-semibold text-gray-500"
                onClick={() => requestSort("profitLoss")}
              >
                Profit/Loss{" "}
                <span className="ml-2">
                  <ArrowDownUp className="size-4" />
                </span>
              </TableCell>
              <TableCell className="font-semibold text-gray-500">
                Head
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLocations.map((location, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="text-gray-700">
                  <Link
                    href={`/brands/${brandName}/locations/${location.locationName}`}
                  >
                    {location.locationName}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-700">
                  {location.salesDetails.noOfSales}
                </TableCell>
                <TableCell className="text-gray-700">
                  {location.operationalExpenses.annual}
                </TableCell>
                <TableCell className="text-gray-700">
                  {location.salesDetails.totalSales}
                </TableCell>
                <TableCell className="text-gray-700">
                  {calculateProfitLoss(
                    location.salesDetails.totalSales,
                    location.operationalExpenses.annual
                  )}
                </TableCell>
                <TableCell className="text-gray-700">
                  {location.headOfBrand}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LocationDetailsTable;
