"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PickAName } from "@/lib/utils";

const VouchersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "createdOn",
    direction: "descending",
  });
  const [data, setData] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const categories = [
      "Current Bill",
      "Rent",
      "Stock Filling",
      "Maintenance",
      "Miscellaneous",
    ];

    const mockVouchers = [
      {
        createdOn: "2023-06-01",
        category: categories[Math.floor(Math.random() * categories.length)],
        requestedBudget: `₹${generateRandomNumber(40, 50)},00,000`,
        requestedBy: PickAName(),
        approvedBudget: `₹${generateRandomNumber(10, 40)},00,000`,
        approvedBy: PickAName(),
        rejectedBy: "N/A",
        approvedRejectedOn: "2023-06-10",
        status: "approved",
        reason: "N/A",
      },
      {
        createdOn: "2023-06-01",
        category: categories[Math.floor(Math.random() * categories.length)],
        requestedBudget: `₹${generateRandomNumber(40, 50)},00,000`,
        requestedBy: PickAName(),
        approvedBudget: `₹${generateRandomNumber(10, 40)},00,000`,
        approvedBy: "N/A",
        rejectedBy: PickAName(),
        approvedRejectedOn: "2023-06-10",
        status: "rejected",
        reason: "Improper Info",
      },
      // ...other vouchers
    ];

    setData(mockVouchers);
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.approvedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rejectedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle the file upload logic here
      console.log("File uploaded:", file.name);
      // Reset the file input
      fileInputRef.current.value = null;
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="p-4 md:p-6 lg:px-4 lg:py-6">
      <h1 className="text-2xl font-semibold mb-4">Vouchers</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="relative max-w-6xl">
          <Input
            type="text"
            placeholder="Search by Approved By, Rejected By, Category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button onClick={handleButtonClick}>
              Add vouchers
            </Button>
          </div>
          <Button className="flex items-center gap-2">
            Export
            <Download className="size-4" />
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell onClick={() => requestSort("createdOn")}>
              <span className="ml-2 flex items-center gap-2">
                Created On
                <ArrowDownUp className="size-4" />
              </span>
            </TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Requested Budget</TableCell>
            <TableCell>Requested By</TableCell>
            <TableCell>Approved Budget</TableCell>
            <TableCell>Approved By</TableCell>
            <TableCell>Rejected By</TableCell>
            <TableCell onClick={() => requestSort("approvedRejectedOn")}>
              <span className="ml-2 flex items-center gap-2">
                Approved/Rejected On
                <ArrowDownUp className="size-4" />
              </span>
            </TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Reason</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.createdOn}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.requestedBudget}</TableCell>
              <TableCell>{item.requestedBy}</TableCell>
              <TableCell>{item.approvedBudget}</TableCell>
              <TableCell>{item.approvedBy}</TableCell>
              <TableCell>{item.rejectedBy}</TableCell>
              <TableCell>{item.approvedRejectedOn}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VouchersPage;
