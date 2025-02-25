"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Import Button component

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

const JobCardTable = ({ jobCards }) => {
  const tableHeaders = [
    "Job Card Number",
    "Reg No",
    "Job Card Date",
    "Branch",
    "Model",
    "Chassis No",
    "Customer",
    "Customer Name",
    "Mobile No",
    "City",
    "Service Advisor",
    "Ready for Bill",
    "Source",
    "Status",
    "Total Amount",
  ];

  const MotionTableRow = motion(TableRow);

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full bg-white shadow-md rounded-lg">
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
              <TableCell className="py-2 px-4 border-b">
                {jobCard.jobCardNumber}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.regNo}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.jobCardDate}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.branch}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.model}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.chassisNo}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.customer}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.customerName}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.mobileNo}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.city}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.serviceAdvisor}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.readyForBill}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.source}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.status}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {jobCard.totalAmount}
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
  const [newJobCard, setNewJobCard] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const someParam = searchParams.get("someParam");
  console.log("someParam:", someParam);

  useEffect(() => {
    const fetchJobCards = async () => {
      const data = [
        {
          jobCardNumber: "JC123",
          regNo: "ABC123",
          jobCardDate: "2023-10-01",
          branch: "Branch1",
          model: "Model1",
          chassisNo: "CH123",
          customer: "Customer1",
          customerName: "John Doe",
          mobileNo: "1234567890",
          city: "City1",
          serviceAdvisor: "Advisor1",
          readyForBill: "Yes",
          source: "Source1",
          status: "Completed",
          totalAmount: "1000",
        },
      ];
      setJobCards(data);
    };

    fetchJobCards();
  }, []);

  const handleAddCardClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setNewJobCard(e.target.value);
  };

  const handleInputSave = () => {
    const newCard = {
      jobCardNumber: newJobCard,
      // Add other fields as necessary
    };
    setJobCards([...jobCards, newCard]);
    setShowInput(false);
  };

  return (
    <div className="flex flex-col p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => router.back()} className="bg-blue-400 text-white">
          Back
        </Button>
        <Button onClick={handleAddCardClick} className="bg-green-500 text-white">
          Add Card
        </Button>
      </div>
      {showInput && (
        <div className="mb-4">
          <input
            type="text"
            value={newJobCard}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Enter Job Card Number"
          />
          <Button onClick={handleInputSave} className="bg-blue-500 text-white ml-2">
            Save
          </Button>
        </div>
      )}
      <div className="content w-full overflow-x-auto">
        <JobCardTable jobCards={jobCards} />
      </div>
    </div>
  );
};

export default JobCardPage;
