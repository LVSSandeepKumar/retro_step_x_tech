import React, { useEffect, useState } from "react";
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
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowDownUp } from "lucide-react";

const DeliveryCard = () => {
  const [deliveryData, setDeliveryData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "arrivedDate", direction: "descending" });

  useEffect(() => {
    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Generate random numbers for each day
    const yesterday = generateRandomNumber(5, 15);
    const today = generateRandomNumber(8, 20);
    const tomorrow = generateRandomNumber(10, 25);
    const total = yesterday + today + tomorrow;
    const percentageCompleted = Math.floor((yesterday / total) * 100);

    setDeliveryData({
      yesterday,
      today,
      tomorrow,
      total,
      percentageCompleted,
    });
  }, []);

  if (!deliveryData) return null;

  const deliveryDetails = [
    {  
      orderNumber: "ON001", 
      bikeName: "Bajaj Dominar 125", 
      engineNo: "12AB1234", 
      trNo: "TR123", 
      ChassisNo: "CH123", 
      amountPaid: "₹5000", 
      remainingAmount: "₹75000", 
      customerName: "Venkatesh", 
      deliveryPerson: "Ravi",
      deliveryDate: "2024-01-25" // Tomorrow
    },
    {  
      orderNumber: "ON002", 
      bikeName: "Bajaj Pulsar 150", 
      engineNo: "12CD5678", 
      trNo: "TR456", 
      ChassisNo: "CH456", 
      amountPaid: "₹6000", 
      remainingAmount: "₹94000", 
      customerName: "Mahesh", 
      deliveryPerson: "Ramesh",
      deliveryDate: "2024-01-24" // Today
    },
    {  
      orderNumber: "ON003", 
      bikeName: "Triumph Street 125", 
      engineNo: "12EF9012", 
      trNo: "TR789", 
      ChassisNo: "CH789", 
      amountPaid: "₹4500", 
      remainingAmount: "₹85500", 
      customerName: "Sachin", 
      deliveryPerson: "Kumar",
      deliveryDate: "2024-01-23" // Yesterday
    },
    {  
      orderNumber: "ON004", 
      bikeName: "Vespa 125", 
      engineNo: "12GH3456", 
      trNo: "TR012", 
      ChassisNo: "CH012", 
      amountPaid: "₹5500", 
      remainingAmount: "₹945000", 
      customerName: "Vijay", 
      deliveryPerson: "Suresh",
      deliveryDate: "2024-01-25" // Tomorrow
    },
  ];

  const filteredDeliveries = deliveryDetails.filter((delivery) =>
    delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.bikeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.deliveryPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDeliveries = [...filteredDeliveries].sort((a, b) => {
    if (sortConfig.key === 'deliveryDate') {
      const dateA = new Date(a.deliveryDate);
      const dateB = new Date(b.deliveryDate);
      return sortConfig.direction === "ascending" 
        ? dateA - dateB 
        : dateB - dateA;
    }
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

  const formatDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-4 rounded-lg border shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-2">Delivery Details</h2>
      <p className="text-sm text-gray-500 mb-4">Last 7 Days</p>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="text-3xl font-bold cursor-pointer">{deliveryData.total}</div>
        </DialogTrigger>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
            <DialogDescription>Details of deliveries made in the last 7 days</DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Search by Vehicle No, Customer Name, Order Number, Delivery Person, Advisor Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Bike Name</TableCell>
                <TableCell>Engine No</TableCell>
                <TableCell>TR No</TableCell>
                <TableCell>Chassis No</TableCell>
                <TableCell onClick={() => requestSort("amountPaid")}>
                  <span className="ml-2 flex items-center gap-2">
                    Amount Paid
                    <ArrowDownUp className="size-4" />
                  </span>
                </TableCell>
                <TableCell>Remaining Amount</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Delivery Person</TableCell>
                <TableCell onClick={() => requestSort("deliveryDate")}>
                  <span className="ml-2 flex items-center gap-2">
                    Delivery Date
                    <ArrowDownUp className="size-4" />
                  </span>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDeliveries.map((delivery, index) => (
                <TableRow key={index}>
                  <TableCell>{delivery.orderNumber}</TableCell>
                  <TableCell>{delivery.bikeName}</TableCell>
                  <TableCell>{delivery.engineNo}</TableCell>
                  <TableCell>{delivery.trNo}</TableCell>
                  <TableCell>{delivery.ChassisNo}</TableCell>
                  <TableCell>{delivery.amountPaid}</TableCell>
                  <TableCell>{delivery.remainingAmount}</TableCell>
                  <TableCell>{delivery.customerName}</TableCell>
                  <TableCell>{delivery.deliveryPerson}</TableCell>
                  <TableCell>{formatDeliveryDate(delivery.deliveryDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col">
        <p className="text-sm font-bold text-gray-500 mb-2">
          Pending Deliveries
        </p>

        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="text-center">
            <p className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Yesterday</span>
              <span className="text-lg font-semibold">{deliveryData.yesterday}</span>
            </p>
          </div>
          <div className="text-center">
            <p className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Today</span>
              <span className="text-lg font-semibold text-blue-600">{deliveryData.today}</span>
            </p>
          </div>
          <div className="text-center">
            <p className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Tomorrow</span>
              <span className="text-lg font-semibold text-green-600">{deliveryData.tomorrow}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-2xl font-bold">
            {deliveryData.percentageCompleted}% Delivered
          </div>
          <p className="text-sm text-gray-500">
            Total Pending Deliveries: {deliveryData.total}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCard;
