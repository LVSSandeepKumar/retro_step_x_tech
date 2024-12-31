import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
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

// Register required chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ServiceCard = () => {
  const [serviceData, setServiceData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "arrivedDate", direction: "descending" });

  useEffect(() => {
    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const completed = generateRandomNumber(30, 50);
    const pending = generateRandomNumber(10, 30);
    const total = completed + pending;
    const percentageCompleted = Math.floor((completed / total) * 100);

    setServiceData({
      completed,
      pending,
      total,
      percentageCompleted,
      avgResponseTime: `${generateRandomNumber(1, 3)} Days`,
    });
  }, []);

  if (!serviceData) {
    return null; // or a loading spinner
  }

  const backGroundColor = serviceData.percentageCompleted > 75 ? "#22C55E" : serviceData.percentageCompleted < 60 ? "#EF4444" : "#D97706";

  // Chart data
  const data = {
    datasets: [
      {
        data: [serviceData.percentageCompleted, 100 - serviceData.percentageCompleted],
        backgroundColor: [backGroundColor, "#E0E0E0"], // Green and Light Gray
        borderWidth: 0, // Remove borders
      },
    ],
  };

  // Chart options
  const options = {
    cutout: "95%", // Create a doughnut effect
    plugins: {
      tooltip: {
        enabled: false, // Disable tooltips
      },
      legend: {
        display: false, // Hide legend
      },
    },
  };

  const serviceDetails = [
    { serviceNo: 1, vehicleNo: "12AB1234", customerName: "Rohit", arrivedDate: "2023-10-01", status: "completed", exitedDate: "2023-10-02", responseTime: 1, jcNumber: "JC001", mechanicName: "Ravi", advisorName: "Mahesh", billAmount: "₹5000" },
    { serviceNo: 2, vehicleNo: "12CD5678", customerName: "Virat", arrivedDate: "2023-10-02", status: "pending", exitedDate: "", responseTime: 2, jcNumber: "JC002", mechanicName: "Ramesh", advisorName: "Rahul", billAmount: "" },
    { serviceNo: 3, vehicleNo: "12EF9012", customerName: "Sachin", arrivedDate: "2023-10-03", status: "completed", exitedDate: "2023-10-04", responseTime: 1, jcNumber: "JC003", mechanicName: "Kumar", advisorName: "Mohan", billAmount: "₹4500" },
    { serviceNo: 4, vehicleNo: "12GH3456", customerName: "Bumrah", arrivedDate: "2023-10-04", status: "pending", exitedDate: "", responseTime: 3, jcNumber: "JC004", mechanicName: "Suresh", advisorName: "Ramu", billAmount: "" },
  ];

  const filteredServices = serviceDetails.filter((service) =>
    service.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.jcNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.mechanicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.advisorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") {
      return -1;
    }
    if (a.status !== "pending" && b.status === "pending") {
      return 1;
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

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-4 rounded-lg border shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-2">Service Details</h2>
      <p className="text-sm text-gray-500 mb-4">Last 7 Days</p>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="text-3xl font-bold cursor-pointer">{serviceData.total}</div>
        </DialogTrigger>
        <DialogContent className="max-w-8xl">
          <DialogHeader>
            <DialogTitle>Service Details</DialogTitle>
            <DialogDescription>Details of services provided in the last 7 days</DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Search by Vehicle No, Customer Name, JC Number, Mechanic Name, Advisor Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Service No</TableCell>
                <TableCell>Vehicle No</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell onClick={() => requestSort("arrivedDate")}>
                  <span className="ml-2 flex items-center gap-2">
                    Arrived Date
                    <ArrowDownUp className="size-4" />
                  </span>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell onClick={() => requestSort("exitedDate")}>
                  <span className="ml-2 flex items-center gap-2">
                    Exited Date
                    <ArrowDownUp className="size-4" />
                  </span>
                </TableCell>
                <TableCell>Response Time (Days)</TableCell>
                <TableCell>JC Number</TableCell>
                <TableCell>Mechanic Name</TableCell>
                <TableCell>Advisor Name</TableCell>
                <TableCell onClick={() => requestSort("billAmount")}>
                  <span className="ml-2 flex items-center gap-2">
                    Bill Amount
                    <ArrowDownUp className="size-4" />
                  </span>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedServices.map((service, index) => (
                <TableRow key={index}>
                  <TableCell>{service.serviceNo}</TableCell>
                  <TableCell>{service.vehicleNo}</TableCell>
                  <TableCell>{service.customerName}</TableCell>
                  <TableCell>{service.arrivedDate}</TableCell>
                  <TableCell>{service.status}</TableCell>
                  <TableCell>{service.exitedDate || "N/A"}</TableCell>
                  <TableCell>{service.responseTime}</TableCell>
                  <TableCell>{service.jcNumber}</TableCell>
                  <TableCell>{service.mechanicName}</TableCell>
                  <TableCell>{service.advisorName}</TableCell>
                  <TableCell>{service.billAmount || "N/A"}</TableCell>
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

      <p className="text-sm font-bold text-gray-500 mb-2">
        Service Requests
      </p>

      <div className="flex justify-between items-center gap-y-2">
        <div className="flex flex-col gap-2 justify-between">
          <div className="">
            <p className="flex flex-col-reverse items-start">
              <span className="text-lg font-semibold">{serviceData.completed}</span>
              <span className="text-sm text-gray-500">Completed</span>
            </p>
          </div>
          <div className="">
            <p className="flex flex-col-reverse items-start justify-start">
              <span className="text-lg font-semibold">{serviceData.pending}</span>
              <span className="text-sm text-gray-500">Pending</span>
            </p>
          </div>
          <div className="">
            <p className="flex flex-col-reverse items-start">
              <span className="text-lg font-semibold">{serviceData.avgResponseTime}</span>
              <span className="text-sm text-gray-500">Avg Response Time</span>
            </p>
          </div>
        </div>

        <div className="flex mb-16 mr-4">
          <div className="relative size-36">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
              {serviceData.percentageCompleted}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
