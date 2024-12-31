import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { mockLocations } from "@/lib/constants";
import { ArrowDownUp } from "lucide-react";
import Link from "next/link";

const LocationDetailsTable = ({ brandName }) => {
  const brandData = mockLocations.find(
    (brand) => brand.brandName === brandName
  );

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  if (!brandData) {
    return <p>No data available for this brand.</p>;
  }

  const getNestedValue = (obj, key) => {
    return key.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const sortedLocations = [...brandData.locations].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);
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
                  {parseFloat(
                    location.salesDetails.totalSales.replace(/[^0-9.-]+/g, "")
                  ) -
                    parseFloat(
                      location.operationalExpenses.annual.replace(
                        /[^0-9.-]+/g,
                        ""
                      )
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
