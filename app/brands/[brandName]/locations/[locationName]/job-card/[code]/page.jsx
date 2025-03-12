"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { Badge } from "@/components/ui/badge"; // Your Badge component
import {
  FaInfoCircle,
  FaCar,
  FaUser,
  FaMapMarkerAlt,
  FaUserTie,
  FaWrench,
  FaCogs,
} from "react-icons/fa";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const SAMPLE_CAR_IMAGE = "/groups/car.jpg";

export default function SingleJobCardDetails({ initialJobCard }) {
  const [jobCard, setJobCard] = useState(initialJobCard || null);
  const pathname = usePathname();
  const code = pathname.split("/")[6];

  const fetchJobCard = async (code) => {
    try {
      const response = await axios.get(
        `http://192.168.0.12:5001/api/job-card/${code}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setJobCard(response.data.data);
      console.log("Job card details data:", response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!jobCard) {
      fetchJobCard(code);
    }
  }, [code]);

  if (!jobCard) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
        <p className="text-lg text-gray-300 animate-pulse">Loading...</p>
      </div>
    );
  }

  // Handler to update fields in jobCard state (for inline editing)
  const handleFieldChange = (fieldPath, newValue) => {
    setJobCard((prev) => {
      const updated = structuredClone(prev);
      const pathParts = fieldPath.split(".");
      let obj = updated;
      for (let i = 0; i < pathParts.length - 1; i++) {
        obj = obj[pathParts[i]];
      }
      obj[pathParts[pathParts.length - 1]] = newValue;
      return updated;
    });
  };

  // For demonstration, assume jobCard has partsData and laborData arrays.
  const partsData = jobCard.part
  //  || [
  //   { name: "Part A", value: 400 },
  //   { name: "Part B", value: 300 },
  //   { name: "Part C", value: 300 },
  //   { name: "Part D", value: 200 },
  // ];
  const laborData = jobCard.jobCardLabour
  //  || [
  //   { name: "Labor A", value: 500 },
  //   { name: "Labor B", value: 200 },
  //   { name: "Labor C", value: 100 },
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 p-4 sm:p-6 text-gray-200 font-sans relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {/* Left Side: Title and Status Badge */}
        <div className="flex items-center space-x-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-widest drop-shadow-lg">
            JOB CARD
          </h1>
          <Badge variant="outline" className="text-black border-black">
            {jobCard.jobCardStatus || "No Status"}
          </Badge>
        </div>
        {/* Right Side: Editable Job Card Code and Edit Button */}
        <div className="flex items-center space-x-2">
          <div className="border border-black rounded-lg text-lg px-4 py-1">
            <EditableField
              label="Job Card Code"
              value={jobCard.code}
              onChange={(val) => handleFieldChange("code", val)}
            />
          </div>
          <button
            onClick={() => console.log("Edit action triggered")}
            className="px-3 py-1 border border-balck  text-black rounded hover:bg-gray-300 hover:text-black transition"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Outer Container */}
      <div className="max-w-5xl mx-auto bg-gray-100/50 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-100">
        {/* Top Row: Car Image and General Info */}
        <div className="flex flex-row w-full gap-6">
  <div className="w-1/2">
    <Panel title="Customer Info">
      <InfoList
        rows={[
          {
            label: "Name",
            value: jobCard.customer?.name || "",
            fieldPath: "customer.name",
          },
          {
            label: "Phone",
            value: jobCard.customer?.phone || "",
            fieldPath: "customer.phone",
          },
          {
            label: "Email",
            value: jobCard.customer?.email || "",
            fieldPath: "customer.email",
          },
          {
            label: "Address",
            value: jobCard.customer?.address || "",
            fieldPath: "customer.address",
          },
          {
            label: "Chassis No",
            value: jobCard.vehicle?.chassisNo || "",
            fieldPath: "vehicle.chassisNo",
          },
          {
            label: "Registration No",
            value: jobCard.vehicle?.registrationNo || "",
            fieldPath: "vehicle.registrationNo",
          },
          {
            label: "Engine No",
            value: jobCard.vehicle?.engineNo || "",
            fieldPath: "vehicle.engineNo",
          },
        ]}
        onFieldChange={handleFieldChange}
      />
    </Panel>
  </div>
  <div className="w-1/2">
    <Panel title="General Info">
      <InfoList
        rows={[
          {
            label: "Repair Type",
            value: jobCard.jobCardType?.name || "N/A",
            fieldPath: "jobCardType.name",
          },
          {
            label: "KM Reading",
            value: jobCard.kmReading || "",
            fieldPath: "kmReading",
          },
          {
            label: "Preferred Language",
            value: jobCard.preferredLanguage || "",
            fieldPath: "preferredLanguage",
          },
          {
            label: "Delivery Time",
            value: jobCard.generalDetails?.deliveryTime || "",
            fieldPath: "generalDetails.deliveryTime",
          },
          {
            label: "Complaint",
            value: jobCard.generalDetails?.customerVoice || "",
            fieldPath: "generalDetails.customerVoice",
          },
        ]}
        onFieldChange={handleFieldChange}
      />
    </Panel>
  </div>
</div>


        {/* Vehicle Info: Full Width Panel */}
        {/* <div className="mt-6">
          <Panel title="Vehicle Info">
            <InfoList
              rows={[
                {
                  label: "Vehicle ID",
                  value: jobCard.vehicle?.id,
                  fieldPath: "vehicle.id",
                },
                {
                  label: "Chassis No",
                  value: jobCard.vehicle?.chassisNo || "",
                  fieldPath: "vehicle.chassisNo",
                },
                {
                  label: "Registration No",
                  value: jobCard.vehicle?.registrationNo || "",
                  fieldPath: "vehicle.registrationNo",
                },
                {
                  label: "Engine No",
                  value: jobCard.vehicle?.engineNo || "",
                  fieldPath: "vehicle.engineNo",
                },
              ]}
              onFieldChange={handleFieldChange}
            />
          </Panel>
        </div> */}

        {/* Middle Row: Editable Pie Charts for Parts and Labor */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditablePieChart
            data={partsData}
            title="Parts Distribution"
            onDataChange={(newData) => handleFieldChange("partsData", newData)}
          />
          <EditablePieChart
            data={laborData}
            title="Labor Distribution"
            onDataChange={(newData) => handleFieldChange("laborData", newData)}
          />
        </div>

        {/* Bottom Row: Location Info and Staff Info */}
        {/* <div className="mt-6  w-full border-black grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Location Info">
            <InfoList
              rows={[
                {
                  label: "Name",
                  value: jobCard.location?.name || "",
                  fieldPath: "location.name",
                },
                {
                  label: "Address",
                  value: jobCard.location?.address || "",
                  fieldPath: "location.address",
                },
                {
                  label: "Code",
                  value: jobCard.location?.code || "",
                  fieldPath: "location.code",
                },
              ]}
              onFieldChange={handleFieldChange}
            />
          </Panel>
        </div> */}
      </div>
    </div>
  );
}

/* --------------------------------------------------
   Panel Component: A futuristic box with a heading.
-------------------------------------------------- */
function Panel({ title, children, className = "" }) {
  return (
    <div
      className={`bg-gray-100/70 rounded-lg p-4 border border-gray-900 shadow-inner ${className}`}
    >
      <h3 className="text-lg font-bold text-gray-800 mb-3 tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* --------------------------------------------------
   InfoList Component: Displays a vertical list of editable label-value pairs.
-------------------------------------------------- */
function InfoList({ rows, onFieldChange }) {
  return (
    <div className="flex flex-col space-y-2 text-sm">
      {rows.map((row, idx) => (
        <EditableField
          key={idx}
          label={row.label}
          value={row.value}
          onChange={(val) => onFieldChange(row.fieldPath, val)}
        />
      ))}
    </div>
  );
}

/* --------------------------------------------------
   EditableField Component: Renders a label with an editable input.
-------------------------------------------------- */
function EditableField({ label, value, onChange }) {
  return (
    <div className="flex justify-between items-center  bg-gray-200/60 px-2 py-1 rounded">
      <span className="text-gray-950 ">{label}</span>
      <input
        type="text"
        className="font-semibold text-black bg-transparent border-b border-gray-900 focus:outline-none w-32 text-right"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* --------------------------------------------------
   PartsList Component: Renders a vertical list of part codes and names as editable fields.
-------------------------------------------------- */
function PartsList({ parts, onFieldChange }) {
  return (
    <div className="flex flex-col space-y-2 text-sm">
      {parts.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center bg-gray-800/60 px-2 py-1 rounded"
        >
          <input
            type="text"
            className="text-gray-900 bg-transparent border-b border-gray-600 focus:outline-none w-20 text-right"
            value={item.code || ""}
            onChange={(e) =>
              onFieldChange && onFieldChange(`part.${idx}.code`, e.target.value)
            }
          />
          <input
            type="text"
            className="text-black bg-transparent border-b border-gray-600 focus:outline-none w-24 text-right"
            value={item.name || ""}
            onChange={(e) =>
              onFieldChange && onFieldChange(`part.${idx}.name`, e.target.value)
            }
          />
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------
   EditablePieChart Component
   - Displays a pie chart using Recharts.
   - Provides editable input fields for each data item.
-------------------------------------------------- */
function EditablePieChart({ data: initialData, title, onDataChange }) {
  const [data, setData] = useState(initialData);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleChange = (index, newValue) => {
    const updatedData = data.map((item, idx) =>
      idx === index ? { ...item, amount: Number(newValue) } : item
    );
    setData(updatedData);
    if (onDataChange) onDataChange(updatedData);
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28DFF",
    "#FF6B6B",
  ];

  return (
    <div className="p-4 bg-gray-300 rounded-lg shadow-md ">
      <h3 className="text-lg font-bold text-black mb-4 tracking-wide">
        {title}
      </h3>
      <PieChart width={450} height={300}>
        <Pie
          dataKey="value"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center  space-x-2">
            <span className="text-sm text-black">{item.name}</span>
            <input
              type="number"
              value={item.value}
              onChange={(e) => handleChange(index, e.target.value)}
              className="p-1 border border-gray-200 rounded bg-gray-100 text-black  text-sm w-20"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
