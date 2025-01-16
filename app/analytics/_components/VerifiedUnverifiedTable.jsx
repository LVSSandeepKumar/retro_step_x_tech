import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { locations } from "@/lib/constants";

const billTypes = ["Sales", "Service", "Spares", "Insurance"];

const statusColors = {
  verified: "text-green-600 bg-green-50",
  unverified: "text-red-600 bg-red-50",
  pending: "text-yellow-600 bg-yellow-50",
};

const VerifiedUnverifiedTable = ({ currentTab }) => {
  // Combine all cities from own and sub locations
  const allLocations = useMemo(() => {
    const ownCities = locations.find((loc) => loc.type === "own")?.cities || [];
    const subCities = locations.find((loc) => loc.type === "sub")?.cities || [];
    return [...ownCities, ...subCities];
  }, []);

  const bills = useMemo(() => {
    const generateBill = (index) => {
      const today = new Date();
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      const pendingDays = Math.floor(Math.random() * 15) + 1;

      // Randomly select a location from the combined list
      const location =
        allLocations[Math.floor(Math.random() * allLocations.length)];

      // Determine if the location is own or sub
      const locationType =
        locations.find((loc) => loc.cities.includes(location))?.type || "own";

      return {
        billNumber: `BILL${Math.random()
          .toString(36)
          .substr(2, 8)
          .toUpperCase()}`,
        date: date.toLocaleDateString("en-IN"),
        location,
        locationType,
        amount: Math.floor(Math.random() * 90000) + 10000,
        type: billTypes[Math.floor(Math.random() * billTypes.length)],
        status:
          currentTab === "verified"
            ? "verified"
            : Math.random() > 0.3
            ? "unverified"
            : "pending",
        pendingSince: `${pendingDays} days ago`,
      };
    };

    return Array.from({ length: 10 }, (_, i) => generateBill(i)).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [currentTab, allLocations]);

  return (
    <div className="bg-white rounded-lg p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bill Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            {currentTab === "unverified" && (
              <TableHead>Pending Since</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.billNumber}>
              <TableCell className="font-medium">{bill.billNumber}</TableCell>
              <TableCell>{bill.date}</TableCell>
              <TableCell>{bill.location}</TableCell>
              <TableCell>{bill.locationType.toUpperCase()}</TableCell>
              <TableCell>₹{bill.amount.toLocaleString()}</TableCell>
              <TableCell>{bill.type}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[bill.status]
                  }`}
                >
                  {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                </span>
              </TableCell>
              {currentTab === "unverified" && (
                <TableCell className="text-red-500">
                  {bill.pendingSince}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VerifiedUnverifiedTable;
