"use client";

import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import set from "lodash.set";
import PieCharts from "../_components/PieChart";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// updateNestedData: updates the nested field using lodash.set.
// Additionally, if the field updated is "missing" and its value is true,
// it also clears the "scratches" and "damage" options.
const updateNestedData = (data, path, value) => {
  const newData = { ...data };
  set(newData, path, value);
  if (path.endsWith(".missing") && value === true) {
    const parentPath = path.substring(0, path.lastIndexOf("."));
    set(newData, `${parentPath}.scratches`, false);
    set(newData, `${parentPath}.damage`, false);
  }
  return newData;
};

const OwnerDetailComponent = memo(
  ({
    editableData,
    originalData,
    handleInputChange,
    isEditing,
    setShowCalendar,
    onDateChange,
    showCalendar,
  }) => (
    <div className="mt-16">
      <div className="flex items-center mb-2">
        <p className="w-32 font-semibold text-right">Model:</p>
        <input
          className="ml-4 border p-1"
          name="vehicle.vehicleModel.name"
          value={editableData.vehicle?.vehicleModel?.name || ""}
          onChange={handleInputChange}
          readOnly={!!originalData.vehicle?.vehicleModel?.name && !isEditing}
        />
      </div>
      <div className="flex items-center mb-2">
        <p className="w-32 font-semibold text-right">Reg No:</p>
        <input
          className="ml-4 border p-1"
          name="vehicle.registrationNo"
          value={editableData.vehicle?.registrationNo || ""}
          onChange={handleInputChange}
          readOnly={!!originalData.vehicle?.registrationNo && !isEditing}
        />
      </div>
      <div className="flex items-center mb-2">
        <p className="w-32 font-semibold text-right">Repair Type:</p>
        <input
          className="ml-4 border p-1"
          name="jobCardType.name"
          value={editableData.jobCardType?.name || ""}
          onChange={handleInputChange}
          readOnly={!!originalData.jobCardType?.name && !isEditing}
        />
      </div>
      <div className="flex items-center mb-2">
        <p className="w-32 font-semibold text-right">Date:</p>
        <div className="relative ml-4">
          <input
            className="border p-1"
            name="date"
            value={editableData.date || ""}
            readOnly
            onFocus={() => {
              if (!originalData.date) setShowCalendar(true);
            }}
            onChange={handleInputChange}
          />
          {showCalendar && (
            <div className="absolute z-10 mt-1">
              <Calendar
                onChange={onDateChange}
                value={
                  editableData.date ? new Date(editableData.date) : new Date()
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
);

const DealerInfo = memo(
  ({ editableData, originalData, handleInputChange, isEditing }) => (
    <div className="mt-10">
      <h2 className="font-bold text-2xl ml-10 underline p-2">Dealer Info</h2>
      <div className="space-y-2">
        <div className="flex items-center">
          <p className="w-32 font-semibold text-right">Name:</p>
          <input
            className="ml-4 border p-1"
            name="location.name"
            value={editableData.location?.name || ""}
            onChange={handleInputChange}
            readOnly={!!originalData.location?.name && !isEditing}
          />
        </div>
        <div className="flex items-center">
          <p className="w-32 font-semibold text-right">Address:</p>
          <input
            className="ml-4 border p-1"
            name="location.address"
            value={editableData.location?.address || ""}
            onChange={handleInputChange}
            readOnly={!!originalData.location?.address && !isEditing}
          />
        </div>
        <div className="flex items-center">
          <p className="w-32 font-semibold text-right">State:</p>
          <input
            className="ml-4 border p-1"
            name="dealerState"
            value={editableData.dealerState || ""}
            onChange={handleInputChange}
            readOnly={!!originalData.dealerState && !isEditing}
          />
        </div>
        <div className="flex items-center">
          <p className="w-32 font-semibold text-right">Contact:</p>
          <input
            className="ml-4 border p-1"
            name="dealerContact"
            value={editableData.dealerContact || ""}
            onChange={handleInputChange}
            type="tel"
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number"
            readOnly={!!originalData.dealerContact && !isEditing}
          />
        </div>
        <div className="flex items-center">
          <p className="w-32 font-semibold text-right">Email:</p>
          <input
            className="ml-4 border p-1"
            name="dealerEmail"
            value={editableData.dealerEmail || ""}
            onChange={handleInputChange}
            type="email"
            title="Please enter a valid email address"
            readOnly={!!originalData.dealerEmail && !isEditing}
          />
        </div>
      </div>
    </div>
  )
);

const CustomerDetails = memo(
  ({ editableData, originalData, handleInputChange }) => (
    <div className="m-6 p-4 border rounded-lg shadow-sm bg-gray-50">
      <h2 className="text-xl font-bold mb-4 text-center">Customer Details</h2>
      <div className="flex flex-row justify-around divide-x divide-gray-800">
        <div className="pr-4">
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Name:</p>
            <input
              className=" m-2 border p-1"
              name="customer.name"
              value={editableData.customer?.name || ""}
              onChange={handleInputChange}
              readOnly={
                originalData.customer?.name &&
                editableData.customer?.name === originalData.customer?.name
              }
            />
          </div>
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Email:</p>
            <input
              className="m-2 border p-1"
              name="customer.email"
              value={editableData.customer?.email || ""}
              onChange={handleInputChange}
              type="email"
              title="Please enter a valid email address"
              disabled={originalData.customer?.email !== null}
            />
          </div>
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Address:</p>
            <input
              className="m-2 border p-1"
              name="customer.address"
              value={editableData.customer?.address || ""}
              onChange={handleInputChange}
              readOnly={
                originalData.customer?.address &&
                editableData.customer?.address === originalData.customer?.address
              }
            />
          </div>
        </div>
        <div className="pl-4">
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Chassis No:</p>
            <input
              className="m-2 border p-1"
              name="vehicle.chassisNo"
              value={editableData.vehicle?.chassisNo || ""}
              onChange={handleInputChange}
              readOnly={
                originalData.vehicle?.chassisNo &&
                editableData.vehicle?.chassisNo === originalData.vehicle?.chassisNo
              }
            />
          </div>
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Engine No:</p>
            <input
              className="m-2 border p-1"
              name="vehicle.engineNo"
              value={editableData.vehicle?.engineNo || ""}
              onChange={handleInputChange}
              readOnly={
                originalData.vehicle?.engineNo &&
                editableData.vehicle?.engineNo === originalData.vehicle?.engineNo
              }
            />
          </div>
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Contact No:</p>
            <input
              className="m-2 border p-1"
              name="customer.phone"
              value={editableData.customer?.phone || ""}
              onChange={handleInputChange}
              type="tel"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              readOnly={
                originalData.customer?.phone &&
                editableData.customer?.phone === originalData.customer?.phone
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
);

// Updated CheckBoxGroup: if "missing" is checked, disable "scratches" and "damage"
const CheckBoxGroup = ({
  label,
  fieldPath,
  editableData,
  handleCheckboxChange,
}) => {
  const groupData =
    editableData && editableData[fieldPath] ? editableData[fieldPath] : {};
  const missingChecked = groupData.missing || false;
  return (
    <div className="mb-4">
      <p className="font-semibold">{label}</p>
      <div className="flex space-x-4">
        <label>
          <input
            type="checkbox"
            name={`${fieldPath}.scratches`}
            checked={groupData.scratches || false}
            onChange={handleCheckboxChange}
            disabled={missingChecked}
          />{" "}
          Scratches
        </label>
        <label>
          <input
            type="checkbox"
            name={`${fieldPath}.damage`}
            checked={groupData.damage || false}
            onChange={handleCheckboxChange}
            disabled={missingChecked}
          />{" "}
          Damage
        </label>
        <label>
          <input
            type="checkbox"
            name={`${fieldPath}.missing`}
            checked={groupData.missing || false}
            onChange={handleCheckboxChange}
          />{" "}
          Missing
        </label>
      </div>
    </div>
  );
};

const JobCardDetails = () => {
  const [jobCardData, setJobCardData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  // For Owner/Dealer sections, isEditing is used; Customer details use originalData to determine lock status.
  const [isEditing, setIsEditing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const fetchingData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/job-card?page=1&pageSize=25"
      );
      const data = response.data.data.jobCards;
      setJobCardData(data);
      setOriginalData(data);
      setEditableData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEditableData((prevData) => updateNestedData(prevData, name, checked));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => {
      const newData = { ...prevData };
      set(newData, name, value.trim() === "" || value === null ? "" : value);
      return newData;
    });
  };

  // Handle date change from the Calendar component.
  // Format the date to "YYYY-MM-DD"
  const onDateChange = (newDate) => {
    const formattedDate = newDate.toISOString().split("T")[0];
    handleInputChange({ target: { name: "date", value: formattedDate } });
    setShowCalendar(false);
  };

  if (!jobCardData || !editableData || !originalData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 text-gray-800 bg-gray-50 min-h-screen">
      {/* For Dealer and Owner sections, use a toggle if desired */}
      <div className="flex justify-around flex-col">
        <div className="text-2xl font-bold text-center">JOB CARD</div>
        <div className="flex flex-row justify-around">
          <DealerInfo
            editableData={editableData}
            originalData={originalData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
          />
          <OwnerDetailComponent
            editableData={editableData}
            originalData={originalData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
            setShowCalendar={setShowCalendar}
            onDateChange={onDateChange}
            showCalendar={showCalendar}
          />
        </div>
      </div>
      <div className="gap-4 m-6">
        <div className="flex flex-row p-2 border-2 bg-gray-300 rounded-lg justify-center">
          <div className="font-semibold">Job Card Code:- </div>
          <p>{jobCardData.code}</p>
        </div>
      </div>

      <hr className="my-4 border-1 border-black" />

      <CustomerDetails
        editableData={editableData}
        originalData={originalData}
        handleInputChange={handleInputChange}
      />

      <hr className="my-4 border-1 border-black" />

      <div className="mt-8 justify-center items-center">
        <CheckBoxGroup
          label="P.Tank"
          fieldPath="pTank"
          editableData={editableData}
          handleCheckboxChange={handleCheckboxChange}
        />
        <CheckBoxGroup
          label="Tank Logo"
          fieldPath="tankLogo"
          editableData={editableData}
          handleCheckboxChange={handleCheckboxChange}
        />
        <CheckBoxGroup
          label="Side cover"
          fieldPath="sideCover"
          editableData={editableData}
          handleCheckboxChange={handleCheckboxChange}
        />
        <CheckBoxGroup
          label="Indicator glass"
          fieldPath="indicatorGlass"
          editableData={editableData}
          handleCheckboxChange={handleCheckboxChange}
        />
        <CheckBoxGroup
          label="Crash guard"
          fieldPath="crashGuard"
          editableData={editableData}
          handleCheckboxChange={handleCheckboxChange}
        />
        <CheckBoxGroup
          label="Speed meter"
          fieldPath="speedMeter"
          editableData={editableData}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>

      <hr className="my-4 border-1 border-black" />

      <div className="border-4 border-black flex justify-center mt-8">
        <PieCharts />
      </div>
    </div>
  );
};

export default JobCardDetails;
