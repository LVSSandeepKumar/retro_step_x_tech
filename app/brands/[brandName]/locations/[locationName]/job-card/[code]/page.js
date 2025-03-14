"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { FaCar, FaUser } from "react-icons/fa";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import { BsClockHistory } from "react-icons/bs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-hot-toast";
import { FaPen } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SingleJobCardDetails({ initialJobCard }) {
  const [jobCard, setJobCard] = useState(initialJobCard || null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const pathname = usePathname();
  // Adjust the index if your route structure differs.
  const code = pathname.split("/")[6];

  // Add these arrays for table headers
  const partsTableHeaders = ["Sl.No", "Part Code", "Req. Qty", "Alloc. Qty", "Inv. Qty", "Rate", "Amount"];

  const labourTableHeaders = ["Sl.No", "Labour Code", "HSN/SAC", "Units", "Rate", "Amount"];

  // Helper: if error is true or value is falsy, returns "N/A".
  const safeValue = (val) => (error ? "N/A" : val || "N/A");

  // Calculate the difference in days from createdAt until now.
  const calculateDateDifference = (createdAt) => {
    console.log("create data => ", createdAt);
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = now - createdDate; // Difference in milliseconds
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
  };

  // Fetch job card details.
  const fetchJobCard = async (code) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5001/api/job-card/${code}`, {
        headers: { "Content-Type": "application/json" },
      });
      setJobCard(response.data.data);
      console.log("Job card details data:", response.data);
      console.log(response.data.data.jobCard?.generalDetails?.wasteOil);
      setOilValues({
        wasteOil: response.data.data?.generalDetails?.wasteOil || 0,
        newOil: response.data.data?.generalDetails?.newOil || 0,
      });

      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError(true);
      setJobCard({});
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobCard) {
      fetchJobCard(code);
    }
  }, [code]);

  // Modify states for oil editing
  const [editingOil, setEditingOil] = useState(false);
  const [oilValues, setOilValues] = useState({
    wasteOil: jobCard?.generalDetails?.wasteOil || 0,
    newOil: jobCard?.generalDetails?.newOil || 0,
  });

  // Modified update handler
  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/job-card/general-details/${jobCard?.generalDetails?.id}`,
        oilValues
      );
      if (response.status === 200) {
        setEditingOil(false);
        fetchJobCard(code);
      }
      toast.success("Update successful.");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  // Destructure parts and labor arrays.
  const partsData = jobCard?.part || [];
  const laborData = jobCard?.jobCardLabour || [];

  // Toggle the history modal.
  const toggleHistoryModal = () => {
    setShowHistoryModal(!showHistoryModal);
  };

  return (
    <div className="mt-2 p-4 bg-gray-50">
      {/* Header Section */}
      <div className="flex rounded-lg p-2 py-4">
        {/* Code & Status */}
        <div className="flex flex-row items-center space-x-4 mx-4">
          <div className="bg-gray-50 font-extrabold tracking-widest rounded-lg py-1 px-2 drop-shadow-lg">
            <DisplayField value={safeValue(jobCard.code)} />
            <Badge
              className={`p-1 bg-gray-50 hover:bg-gray-50 ${
                jobCard.jobCardStatus?.toLowerCase() === "pending"
                  ? "text-orange-500"
                  : jobCard.jobCardStatus?.toLowerCase() === "completed"
                  ? "text-green-500"
                  : "text-black"
              }`}
            >
              {safeValue(jobCard.jobCardStatus)}
            </Badge>
          </div>
        </div>

        {/* Customer & Vehicle Info */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <FaUser className="text-gray-700 w-6 h-6" />
            <div className="pl-2">
              <InfoList rows={[{ value: safeValue(jobCard.customer?.name) }]} />
            </div>
            <div className="border-l-2 pl-2">
              <InfoList rows={[{ value: safeValue(jobCard.customer?.phone) }]} />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <FaCar className="text-gray-700 w-6 h-6" />
            <div className="pl-2">
              <InfoList rows={[{ value: safeValue(jobCard.vehicle?.vehicleModel?.name) }]} />
            </div>
            <div className="border-l-2 pl-2">
              <InfoList rows={[{ value: safeValue(jobCard.vehicle?.chassisNo) }]} />
            </div>
            <div className="border-l-2 pl-2">
              <InfoList rows={[{ value: safeValue(jobCard.vehicle?.registrationNo) }]} />
            </div>
          </div>
        </div>
      </div>

      {/* Date Info and History Toggle Components Side by Side */}
      <div className="flex flex-row items-start justify-start">
        <div className="">
          <HistoryInfo jobCard={jobCard} toggleHistoryModal={toggleHistoryModal} showHistoryModal={showHistoryModal} />
        </div>
        <div className="">
          <DateInfo jobCard={jobCard} calculateDateDifference={calculateDateDifference} />
        </div>
      </div>

      {/* OSI / Waste Oil / New Oil Section */}
      <div className="flex flex-wrap justify-between items-center my-4 p-4 bg-white rounded-lg shadow">
        <div className="font-semibold text-gray-700">OSJ: {safeValue(jobCard.osj[0]?.amount)}</div>

        <div className="flex items-center space-x-2">
          <div className="relative flex items-center gap-4">
            <h1 className="font-semibold text-gray-700">Waste Oil</h1>
            <Input
              type="number"
              value={oilValues.wasteOil}
              onChange={(e) => setOilValues((prev) => ({ ...prev, wasteOil: e.target.value }))}
              disabled={!editingOil}
              className="w-32 pr-8"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">L</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex items-center gap-4">
            <h1 className="font-semibold text-gray-700">New Oil</h1>
            <Input
              type="number"
              value={oilValues.newOil}
              onChange={(e) => setOilValues((prev) => ({ ...prev, newOil: e.target.value }))}
              disabled={!editingOil}
              className="w-32 pr-8"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">L</span>
          </div>
        </div>

        <Button
          onClick={() => (editingOil ? handleSubmit() : setEditingOil(true))}
          className={`p-2 rounded-md ${editingOil ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-100"}`}
        >
          {editingOil ? (
            "Save"
          ) : (
            <>
              <span className="mr-2">Edit</span>
              <FaPen className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Parts Table */}
      <div className="mt-6 bg-white rounded-xl p-4 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-3 tracking-wide">Parts Table</h3>
        <Table>
          <TableHeader className="bg-black rounded-md">
            <TableRow>
              {partsTableHeaders.map((header, index) => (
                <TableHead key={index} className="text-white font-semibold">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {partsData.length > 0 ? (
              partsData.map((partItem, index) => (
                <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{safeValue(partItem.productCode)}</TableCell>
                  <TableCell>{safeValue(partItem.issuedQuantity)}</TableCell>
                  <TableCell>{safeValue(partItem.issuedQuantity)}</TableCell>
                  <TableCell>{safeValue(partItem.invoicedQuantity)}</TableCell>
                  <TableCell>{safeValue(partItem.rate)}</TableCell>
                  <TableCell>{safeValue(partItem.amount)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  N/A
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Labour Table */}
      <div className="mt-6 bg-white rounded-xl p-4 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-3 tracking-wide">Labour Table</h3>
        <Table>
          <TableHeader className="bg-black">
            <TableRow>
              {labourTableHeaders.map((header, index) => (
                <TableHead key={index} className="text-white font-semibold">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {laborData.length > 0 ? (
              laborData.map((labItem, index) => (
                <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{safeValue(labItem.labourCode)}</TableCell>
                  <TableCell>{safeValue(labItem.labour.sac)}</TableCell>
                  <TableCell>{safeValue(labItem.units)}</TableCell>
                  <TableCell>{safeValue(labItem.rate)}</TableCell>
                  <TableCell>{safeValue(labItem.amount)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  N/A
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/** DateInfo Component **/
function DateInfo({ jobCard, calculateDateDifference }) {
  const status = jobCard.jobCardStatus?.toLowerCase();
  if (status === "completed") {
    return (
      <div className="text-sm bg-gray-50 text-gray-900 p-4 ">
        Completed {calculateDateDifference(jobCard.createdAt)} days ago
      </div>
    );
  } else if (status === "pending") {
    return (
      <div className="text-sm bg-gray-50 text-gray-900 p-4">{new Date(jobCard.createdAt).toLocaleDateString()}</div>
    );
  } else if (status === "in-progress") {
    return (
      <div className="text-sm bg-gray-50 text-gray-900 p-4">
        In Progress since {new Date(jobCard.createdAt).toLocaleDateString()}
      </div>
    );
  } else if (status === "cancelled") {
    return (
      <div className="text-sm bg-gray-50 text-red-500 p-4">
        Cancelled on {new Date(jobCard.createdAt).toLocaleDateString()}
      </div>
    );
  } else {
    return (
      <div className="text-sm bg-gray-50 text-gray-900 p-4">{new Date(jobCard.createdAt).toLocaleDateString()}</div>
    );
  }
}

/** HistoryInfo Component **/
function HistoryInfo({ jobCard, toggleHistoryModal, showHistoryModal }) {
  return (
    <div className="p-4">
      <button onClick={toggleHistoryModal} className="flex items-center focus:outline-none">
        <BsClockHistory className="w-10 h-6 text-gray-500 hover:text-black mr-2" />
        <span className="text-blue-600 underline"></span>
      </button>

      {showHistoryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={toggleHistoryModal}></div>
          <div className="bg-white rounded-xl p-6 relative z-10 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Job Card History</h3>
            {jobCard.history && jobCard.history.length > 0 ? (
              <ul className="list-disc pl-5">
                {jobCard.history.map((event, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {new Date(event.date).toLocaleString()} - {event.description || "No description"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No history available</p>
            )}
            <button
              onClick={toggleHistoryModal}
              className="mt-4 bg-black text-white px-10 py-2 rounded-lg focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** -----------------------
 *  Utility Components
 * ------------------------ */
function InfoList({ rows }) {
  return (
    <div className="flex flex-col space-y-2 text-sm">
      {rows.map((row, idx) => (
        <DisplayField key={idx} label={row.label} value={row.value} />
      ))}
    </div>
  );
}

function DisplayField({ label, value }) {
  return (
    <div className="flex justify-between items-center px-2 py-1 rounded">
      {label && <span className="text-gray-950">{label}</span>}
      <span className="font-semibold text-black">{value}</span>
    </div>
  );
}

function PieChartDisplay({ data, title }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6B6B"];

  return (
    <div className="p-4 bg-gray-300 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-black mb-4 tracking-wide">{title}</h3>
      <PieChart width={450} height={300}>
        <Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-sm text-black">{item.name}</span>
            <span className="text-sm text-black">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
