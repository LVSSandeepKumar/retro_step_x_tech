"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, Trash } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Calendar } from "@/components/ui/calender"; // Import Calendar component
uuidv4();

const Table = ({ children, className }) => (
  <table className={`table-auto ${className}`}>{children}</table>
);

const TableHeader = ({ children }) => <thead>{children}</thead>;

const TableBody = ({ children }) => <tbody>{children}</tbody>;

const TableHead = ({ children, className }) => (
  <th className={className}>{children}</th>
);

const TableRow = ({ children, className, ...props }) => (
  <tr className={className} {...props}>
    {children}
  </tr>
);

const TableCell = ({ children, className }) => (
  <td className={className}>{children}</td>
);

const JobCardTable = ({ jobCards, onDelete }) => {
  const tableHeaders = [
    "Sr No",
    "Job Card No",
    "Last Serviced",
    "Last KM",
    "Job Card Type",
    "Total Amount",
    "Actions",
  ];

  const MotionTableRow = motion(TableRow);

  return (
    <div className="overflow-x-auto w-full">
      <Table className="bg-gray-100 shadow-md rounded-lg">
        <TableHeader>
          <TableRow className="bg-gray-200">
            {tableHeaders.map((header, index) => (
              <TableHead key={index} className="py-2 px-4 border-b font-bold">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobCards.map((jobCard, index) => (
            <MotionTableRow
              key={index}
              className="hover:bg-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <TableCell className="py-2 px-4 border-b">{index + 1}</TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.jobCardNumber}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.servicedDate}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.lastTimeKilometer}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.jobCardType}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.totalAmount}
              </TableCell>
              <TableCell className="py-2 px-4 border-b flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </MotionTableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const JobCardPage = () => {
  const [jobCards, setJobCards] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newJobCard, setNewJobCard] = useState({
    jobCardNumber: "",
    regNo: "",
    jobCardDate: "",
    branch: "",
    model: "",
    chassisNo: "",
    customer: "",
    customerName: "",
    mobileNo: "",
    city: "",
    serviceAdvisor: "",
    readyForBill: "",
    source: "",
    status: "",
    totalAmount: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const someParam = searchParams.get("someParam");
  console.log("someParam:", someParam);

  useEffect(() => {
    const fetchJobCards = async () => {
      const response = await fetch("/api/job-cards");
      const data = await response.json();
      setJobCards(data);
    };

    fetchJobCards();
  }, []);

  const handleAddCardClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJobCard((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setNewJobCard((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleInputSave = async () => {
    const response = await fetch("/api/job-cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newJobCard),
    });

    if (response.ok) {
      const newCard = await response.json();
      setJobCards([...jobCards, newCard]);
      setShowInput(false);
    } else {
      console.error("Failed to save job card");
    }
  };

  const handleCancel = () => {
    setShowInput(false);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = async () => {
    const response = await fetch(`/api/job-cards?search=${searchInput}`);
    const data = await response.json();
    setSearchResults(data);
  };

  const handleDelete = (index) => {
    setSearchResults((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col p-8 bg-gray-50 min-h-screen overflow-x-hidden">
      <div className="flex items-center gap-4 mb-4">
        <Button onClick={() => router.back()} className="bg-black text-white">
          <ArrowLeft className="mr-2" />
        </Button>
        <div className="flex items-center justify-between w-full border-black ml-10 gap-4">

        <div>
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            className="border-[1px] mr-4 border-black p-2  rounded"
            placeholder="Mobile No/Bike No"
          />
          <Button
            onClick={handleSearchSubmit}
            className="bg-blue-500 text-white w-28 "
          >
            Enter
          </Button>
        </div>
        <div>
          <Button
            onClick={handleAddCardClick}
            className="bg-green-500  text-white hover:bg-black hover:border-black hover:text-white"
          >
            <Plus className="mr-2" /> Add Customer  
          </Button>
        </div>
        </div>
      </div>
      <div className="content w-full overflow-x-auto">
        <JobCardTable jobCards={searchResults} onDelete={handleDelete} />
      </div>

      {showInput && (
        <motion.div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0, transform: "scale(0.9)" }}
          animate={{ opacity: 1, transform: "scale(1)" }}
          transition={{ duration: 0.3, ease: "easeIn" }}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-4/5 max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4 text-center">Add Customer </h2>
            <div className="grid grid-cols-2 gap-4">
              <h3 className="col-span-2 text-xl font-semibold">Add Vehicle Details</h3>
              <input
                type="text"
                name="brand"
                value={newJobCard.brand}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Brand"
              />
                <input
                  type="text"
                  name="modelNo"
                  value={newJobCard.modelNo}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  placeholder="Model No"
                />
              <input
                type="text"
                name="yearOfManufacture"
                value={newJobCard.yearOfManufacture}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Year of Manufacture"
              />
              {/* <input
                type="text"
                name="vehicleName"
                value={newJobCard.vehicleName}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Vehicle Name"
              /> */}
              <input
                type="text"
                name="engineNo"
                value={newJobCard.engineNo}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Engine No"
              />
              <input
                type="text"
                name="chassisNo"
                value={newJobCard.chassisNo}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Chassis No"
              />

              <h3 className="col-span-2 text-xl font-semibold mt-4">Add User Details</h3>
              <input
                type="text"
                name="name"
                value={newJobCard.name}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Name"
              />
              <input
                type="text"
                name="mobileNo"
                value={newJobCard.mobileNo}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Mobile No"
              />
              <input
                type="text"
                name="address"
                value={newJobCard.address}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Address"
              />
              <input
                type="email"
                name="email"
                value={newJobCard.email}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Email"
              />
              <div className="col-span-2">
                <label className="text-sm text-gray-500">Job Card Date</label>
                <Calendar
                  selected={newJobCard.jobCardDate}
                  onChange={(date) => handleDateChange("jobCardDate", date)}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleCancel}
                className="bg-red-500 text-white mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInputSave}
                className="bg-blue-500 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default JobCardPage;
