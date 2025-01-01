"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Plus } from "lucide-react";
import { PickAName, pickAProduct } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const VisitsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "visitDate",
    direction: "ascending",
  });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [newVisit, setNewVisit] = useState({
    customerName: "",
    mobileNo: "",
    interestedIn: "",
    expressOfInterest: "",
    visitDate: "",
    modeOfContact: "",
    lastContactedOn: "",
    salesPerson: "",
  });
  const pathName = usePathname();
  const brandName = pathName.split("/")[2];
  const decodedBrandName = decodeURIComponent(brandName);

  useEffect(() => {
    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const visitsData = [
      {
        customerName: PickAName(),
        mobileNo: generateRandomNumber(8000000000, 9999999999).toString(),
        interestedIn: pickAProduct(decodedBrandName),
        expressOfInterest: "High",
        visitDate: "2023-06-01",
        modeOfContact: "Calls",
        lastContactedOn: "2023-06-10",
        salesPerson: PickAName(),
      },
      {
        customerName: PickAName(),
        mobileNo: generateRandomNumber(8000000000, 9999999999).toString(),
        interestedIn: pickAProduct(decodedBrandName),
        expressOfInterest: "Medium",
        visitDate: "2023-06-02",
        modeOfContact: "Messages",
        lastContactedOn: "2023-06-11",
        salesPerson: PickAName(),
      },
      {
        customerName: PickAName(),
        mobileNo: generateRandomNumber(8000000000, 9999999999).toString(),
        interestedIn: pickAProduct(decodedBrandName),
        expressOfInterest: "High",
        visitDate: "2023-06-03",
        modeOfContact: "Calls",
        lastContactedOn: "2023-06-12",
        salesPerson: PickAName(),
      },
      {
        customerName: PickAName(),
        mobileNo: generateRandomNumber(8000000000, 9999999999).toString(),
        interestedIn: pickAProduct(decodedBrandName),
        expressOfInterest: "Medium",
        visitDate: "2023-06-04",
        modeOfContact: "WhatsApp",
        lastContactedOn: "2023-06-13",
        salesPerson: PickAName(),
      },
      {
        customerName: PickAName(),
        mobileNo: generateRandomNumber(8000000000, 9999999999).toString(),
        interestedIn: pickAProduct(decodedBrandName),
        expressOfInterest: "Low",
        visitDate: "2023-06-05",
        modeOfContact: "Messages",
        lastContactedOn: "2023-06-14",
        salesPerson: PickAName(),
      },
    ];
    setData(visitsData);
    setFilteredData(visitsData);
  }, [decodedBrandName]);

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mobileNo.includes(searchTerm) ||
        item.interestedIn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.modeOfContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.expressOfInterest
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.salesPerson.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVisit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setData((prev) => [...prev, newVisit]);
    setNewVisit({
      customerName: "",
      mobileNo: "",
      interestedIn: "",
      expressOfInterest: "",
      visitDate: "",
      modeOfContact: "",
      lastContactedOn: "",
      salesPerson: "",
    });
  };

  return (
    <div className="p-4 md:p-6 lg:px-4 lg:py-6">
      <h1 className="text-2xl font-semibold mb-4">Visits</h1>
      <div className="flex items-center justify-between gap-8 mb-4">
        <Input
          type="text"
          placeholder="Search by Customer Name, Mobile No., Interested In, Mode of Contact, Express of Interest"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              Add Visit{" "}
              <span>
                <Plus className="size-4" />
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Visit</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new visit.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                name="customerName"
                placeholder="Customer Name"
                value={newVisit.customerName}
                onChange={handleInputChange}
              />
              <Input
                name="mobileNo"
                placeholder="Mobile No."
                value={newVisit.mobileNo}
                onChange={handleInputChange}
              />
              <Input
                name="interestedIn"
                placeholder="Interested In"
                value={newVisit.interestedIn}
                onChange={handleInputChange}
              />
              <Input
                name="expressOfInterest"
                placeholder="Express of Interest"
                value={newVisit.expressOfInterest}
                onChange={handleInputChange}
              />
              <Input
                name="visitDate"
                placeholder="Visit Date"
                value={newVisit.visitDate}
                onChange={handleInputChange}
              />
              <Input
                name="modeOfContact"
                placeholder="Mode of Contact"
                value={newVisit.modeOfContact}
                onChange={handleInputChange}
              />
              <Input
                name="lastContactedOn"
                placeholder="Last Contacted On"
                value={newVisit.lastContactedOn}
                onChange={handleInputChange}
              />
              <Input
                name="salesPerson"
                placeholder="Sales Person"
                value={newVisit.salesPerson}
                onChange={handleInputChange}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleSubmit}>Submit</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer Name</TableHead>
            <TableHead>Mobile No.</TableHead>
            <TableHead>Interested In</TableHead>
            <TableHead>Express of Interest</TableHead>
            <TableHead onClick={() => requestSort("visitDate")}>
              <span className="ml-2 flex items-center gap-2">
                Visit Date
                <ArrowDownUp className="size-4" />
              </span>
            </TableHead>
            <TableHead>Mode of Contact</TableHead>
            <TableHead onClick={() => requestSort("lastContactedOn")}>
              <span className="ml-2 flex items-center gap-2">
                Last Contacted On
                <ArrowDownUp className="size-4" />
              </span>
            </TableHead>
            <TableHead>Sales Person</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.customerName}</TableCell>
              <TableCell>{item.mobileNo}</TableCell>
              <TableCell>{item.interestedIn}</TableCell>
              <TableCell>{item.expressOfInterest}</TableCell>
              <TableCell>{item.visitDate}</TableCell>
              <TableCell>{item.modeOfContact}</TableCell>
              <TableCell>{item.lastContactedOn}</TableCell>
              <TableCell>{item.salesPerson}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VisitsPage;
