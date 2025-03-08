"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import {
  FaInfoCircle,
  FaCar,
  FaUser,
  FaMapMarkerAlt,
  FaUserTie,
  FaWrench,
  FaCogs,
} from "react-icons/fa";

function SingleJobCardDetails({ initialJobCard }) {
  // Default active section is "Vehicle Info"
  const [jobCard, setJobCard] = useState(initialJobCard || null);
  const [activeSection, setActiveSection] = useState("Vehicle Info");
  const pathname = usePathname();
  const code = pathname.split("/")[6];

  const fetchJobCard = async (code) => {
    try {
      const response = await axios.get(`http://3.7.2.124:5000/api/job-card`, {
        headers: { "Content-Type": "application/json" },
      });
      setJobCard(response.data);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  // Define sections with names, icons, and a default icon size.
  const sections = [
    { name: "General Info", icon: FaInfoCircle, defaultSize: 32 },
    { name: "Vehicle Info", icon: FaCar, defaultSize: 48 },
    { name: "Customer Info", icon: FaUser, defaultSize: 36 },
    { name: "Location Info", icon: FaMapMarkerAlt, defaultSize: 44 },
    { name: "Service Advisor", icon: FaUserTie, defaultSize: 40 },
    { name: "Technician", icon: FaWrench, defaultSize: 34 },
    { name: "Parts", icon: FaCogs, defaultSize: 38 },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case "General Info":
        return <GeneralInfoContent jobCard={jobCard} />;
      case "Vehicle Info":
        return <VehicleInfoContent jobCard={jobCard} />;
      case "Customer Info":
        return <CustomerInfoContent jobCard={jobCard} />;
      case "Location Info":
        return <LocationInfoContent jobCard={jobCard} />;
      case "Service Advisor":
        return <ServiceAdvisorContent jobCard={jobCard} />;
      case "Technician":
        return <TechnicianContent jobCard={jobCard} />;
      case "Parts":
        return <PartsContent jobCard={jobCard} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Job Card Details
      </h1>

      {/* Grid Layout: Left Column for Content, Right Column for Icons */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-4 pr-4">{renderSectionContent()}</div>
        <div className="md:col-span-1 flex flex-col items-center space-y-6 p-4 m-4">
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isActive = activeSection === section.name;
            const iconSize = isActive ? section.defaultSize + 16 : section.defaultSize;
            return (
              <button
                key={section.name}
                onClick={() => setActiveSection(section.name)}
                className="focus:outline-none transition-transform duration-300 transform hover:scale-110 m-2"
              >
                <IconComponent
                  size={iconSize}
                  className={isActive ? "text-black" : "text-gray-500 hover:text-blue-600"}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// -------------------
// Reusable Components
// -------------------

function InfoTable({ rows }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full">
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={`${
                idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
              } hover:bg-gray-300 transition-colors duration-300`}
            >
              <td className="px-4 py-2 font-medium text-gray-700 w-1/3">
                {row.label}
              </td>
              <td className="px-4 py-2 text-gray-700">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PartsTable({ parts }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-300">
            <th className="px-4 py-2 text-left font-semibold">Part Code</th>
            <th className="px-4 py-2 text-left font-semibold">Part Name</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((item, idx) => (
            <tr
              key={idx}
              className={`${
                idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
              } hover:bg-gray-300 transition-colors duration-300`}
            >
              <td className="px-4 py-2 text-gray-700">{item.code || "N/A"}</td>
              <td className="px-4 py-2 text-gray-700">{item.name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// -------------------
// Section Content Components
// -------------------

function GeneralInfoContent({ jobCard }) {
  const rows = [
    { label: "Code", value: jobCard.code },
    { label: "Status", value: jobCard.jobCardStatus },
    { label: "Repair Type", value: jobCard.jobCardType?.name || "N/A" },
    { label: "UCN", value: jobCard.ucn || "N/A" },
    { label: "Preferred Language", value: jobCard.preferredLanguage || "N/A" },
    { label: "KM Reading", value: jobCard.kmReading || "N/A" },
    { label: "Expected Start Time", value: jobCard.generalDetails?.expectedStartTime || "N/A" },
    { label: "Delivery Time", value: jobCard.generalDetails?.deliveryTime || "N/A" },
    { label: "Customer Voice", value: jobCard.generalDetails?.customerVoice || "N/A" },
  ];
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">General Info</h2>
      <InfoTable rows={rows} />
    </div>
  );
}

function VehicleInfoContent({ jobCard }) {
  const rows = [
    { label: "Vehicle ID", value: jobCard.vehicle?.id },
    { label: "Chassis No", value: jobCard.vehicle?.chassisNo || "N/A" },
    { label: "Registration No", value: jobCard.vehicle?.registrationNo || "N/A" },
    { label: "Engine No", value: jobCard.vehicle?.engineNo || "N/A" },
    { label: "Ownership ID", value: jobCard.vehicle?.ownershipId || "N/A" },
    { label: "Transfer Date", value: jobCard.vehicle?.transferDate || "N/A" },
  ];
  const modelRows = [
    { label: "Model ID", value: jobCard.vehicle?.vehicleModel?.id },
    { label: "Code", value: jobCard.vehicle?.vehicleModel?.code || "N/A" },
    { label: "Name", value: jobCard.vehicle?.vehicleModel?.name || "N/A" },
    { label: "Price", value: jobCard.vehicle?.vehicleModel?.price || "N/A" },
  ];
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vehicle Info</h2>
      <InfoTable rows={rows} />
      <h3 className="mt-6 text-xl font-semibold text-gray-800 mb-4">Vehicle Model</h3>
      <InfoTable rows={modelRows} />
    </div>
  );
}

function CustomerInfoContent({ jobCard }) {
  const rows = [
    { label: "ID", value: jobCard.customer?.id },
    { label: "Name", value: jobCard.customer?.name || "N/A" },
    { label: "Phone", value: jobCard.customer?.phone || "N/A" },
    { label: "Email", value: jobCard.customer?.email || "N/A" },
    { label: "Address", value: jobCard.customer?.address || "N/A" },
  ];
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Info</h2>
      <InfoTable rows={rows} />
    </div>
  );
}

function LocationInfoContent({ jobCard }) {
  const rows = [
    { label: "ID", value: jobCard.location?.id },
    { label: "Name", value: jobCard.location?.name || "N/A" },
    { label: "Address", value: jobCard.location?.address || "N/A" },
    { label: "Code", value: jobCard.location?.code || "N/A" },
  ];
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Location Info</h2>
      <InfoTable rows={rows} />
    </div>
  );
}

function ServiceAdvisorContent({ jobCard }) {
  const rows = [
    { label: "ID", value: jobCard.serviceAdvisor?.id },
    { label: "Name", value: jobCard.serviceAdvisor?.name || "N/A" },
    { label: "Role", value: jobCard.serviceAdvisor?.role || "N/A" },
    { label: "Email", value: jobCard.serviceAdvisor?.email || "N/A" },
  ];
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Advisor</h2>
      <InfoTable rows={rows} />
    </div>
  );
}

function TechnicianContent({ jobCard }) {
  const rows = [
    { label: "ID", value: jobCard.technician?.id },
    { label: "Name", value: jobCard.technician?.name || "N/A" },
    { label: "Role", value: jobCard.technician?.role || "N/A" },
    { label: "Email", value: jobCard.technician?.email || "N/A" },
  ];
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technician</h2>
      <InfoTable rows={rows} />
    </div>
  );
}

function PartsContent({ jobCard }) {
  const parts = jobCard.part || [];
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Parts</h2>
      {parts.length > 0 ? (
        <PartsTable parts={parts} />
      ) : (
        <p className="text-gray-700">No parts available.</p>
      )}
    </div>
  );
}

export default SingleJobCardDetails;
