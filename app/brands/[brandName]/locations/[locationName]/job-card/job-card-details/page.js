"use client";
import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import set from "lodash.set";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import PieCharts from "../_components/PieChart";
import ComplaintBox from "./_screenPage/complaintBox";

// Helper function to update nested properties
const updateNestedData = (data, path, value) => {
  const newData = { ...data };
  set(newData, path, value);
  return newData;
};

const OwnerDetailComponent = memo(
  ({ editableData, originalData, handleInputChange, setShowCalendar, onDateChange, showCalendar }) => (
    <div className="mt-16">
      <div className="flex items-center mb-2">
        <p className="w-32 font-semibold text-right">Model:</p>
        <input
          className="ml-4 border p-1"
          name="vehicle.vehicleModel.name"
          value={originalData?.vehicle?.vehicleModel?.name || ""}
          onChange={handleInputChange}
          readOnly={!!originalData.vehicle?.vehicleModel?.name}
        />
      </div>
      <div className="flex items-center mb-2">
        <p className="w-32 font-semibold text-right">Reg No:</p>
        <input
          className="ml-4 border p-1"
          name="vehicle.registrationNo"
          value={editableData?.vehicle?.registrationNo || ""}
          onChange={handleInputChange}
          readOnly={!!originalData.vehicle?.registrationNo}
        />
      </div>
      <div className="flex items-center mb-2">
        <p className="w-32 font-semibold text-right">Repair Type:</p>
        <input
          className="ml-4 border p-1"
          name="jobCardType.name"
          value={editableData?.jobCardType?.name || ""}
          onChange={handleInputChange}
          readOnly={!!originalData.jobCardType?.name}
        />
      </div>
      <div className="flex items-center mb-2">
        <p className="w-32 font-semibold text-right">Date:</p>
        <div className="relative ml-4">
          <input
            className="border p-1"
            name="date"
            value={editableData?.date || ""}
            // Only allow date editing if the backend hasn't provided one
            readOnly={!!originalData.date}
            onFocus={() => {
              if (!originalData.date) setShowCalendar(true);
            }}
            onChange={handleInputChange}
          />
          {showCalendar && (
            <div className="absolute z-10 mt-1">
              <Calendar
                onChange={onDateChange}
                value={editableData?.date ? new Date(editableData?.date) : new Date()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
);

const DealerInfo = memo(
  ({ editableData, originalData, handleInputChange }) => (
    <div className="mt-10">
      <h2 className="font-bold text-2xl ml-10 underline p-2">Dealer Info</h2>
      <div className="space-y-2">
        <div className="flex items-center">
          <p className="w-32 font-semibold text-right">Name:</p>
          <input
            className="ml-4 border p-1"
            name="location.name"
            value={editableData?.location?.name || ""}
            onChange={handleInputChange}
            readOnly={!!originalData.location?.name}
          />
        </div>
        <div className="flex items-center">
          <p className="w-32 font-semibold text-right">Address:</p>
          <input
            className="ml-4 border p-1"
            name="location.address"
            value={editableData?.location?.address || ""}
            onChange={handleInputChange}
            readOnly={!!originalData.location?.address}
          />
        </div>
        <div className="flex items-center">
          <p className="w-32 font-semibold text-right">State:</p>
          <input
            className="ml-4 border p-1"
            name="dealerState"
            value={editableData?.dealerState || ""}
            onChange={handleInputChange}
            readOnly={!!originalData.dealerState}
          />
        </div>
        <div className="flex items-center">
          <p className="w-32 font-semibold text-right">Contact:</p>
          <input
            className="ml-4 border p-1"
            name="dealerContact"
            value={editableData?.dealerContact || ""}
            onChange={handleInputChange}
            type="tel"
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number"
            readOnly={!!originalData.dealerContact}
          />
        </div>
        <div className="flex items-center">
          <p className="w-32 font-semibold text-right">Email:</p>
          <input
            className="ml-4 border p-1"
            name="dealerEmail"
            value={editableData?.dealerEmail || ""}
            onChange={handleInputChange}
            type="email"
            title="Please enter a valid email address"
            readOnly={!!originalData.dealerEmail}
          />
        </div>
      </div>
    </div>
  )
);

const CustomerDetails = 
  ({ editableData, originalData, handleInputChange }) => (
    <div className="m-6 p-4 border rounded-lg shadow-sm bg-gray-50">
     
      <h2 className="text-xl font-bold mb-4 text-center">Customer Details</h2>
      <div className="flex flex-row justify-around divide-x divide-gray-800">
        <div className="pr-4">
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Name:</p>
            <input
              className="m-2 border p-1"
              name="customer.name"
              value={editableData?.customer?.name || ""}
              onChange={handleInputChange}
              readOnly={!!originalData.customer?.name}
            />
          </div>
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Email:{originalData.customer?.email}</p>
            <input
              className="m-2 border p-1"
              name="customer.email"
              value={editableData?.customer?.email || ""}
              onChange={handleInputChange}
              type="email"
              title="Please enter a valid email address"
              readOnly={!!originalData.customer?.email}
            />
          </div>
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Address:</p>
            <input
              className="m-2 border p-1"
              name="customer.address"
              value={editableData?.customer?.address || ""}
              onChange={handleInputChange}
              readOnly={!!originalData.customer?.address}
            />
          </div>
        </div>
        <div className="pl-4">
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Chassis No:</p>
            <input
              className="m-2 border p-1"
              name="vehicle.chassisNo"
              value={editableData?.vehicle?.chassisNo || ""}
              onChange={handleInputChange}
              readOnly={!!originalData.vehicle?.chassisNo}
            />
          </div>
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Engine No:</p>
            <input
              className="m-2 border p-1"
              name="vehicle.engineNo"
              value={editableData?.vehicle?.engineNo || ""}
              onChange={handleInputChange}
              readOnly={!!originalData.vehicle?.engineNo}
            />
          </div>
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Contact No:</p>
            <input
              className="m-2 border p-1"
              name="customer.phone"
              value={editableData?.customer?.phone || ""}
              onChange={handleInputChange}
              type="tel"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              readOnly={!!originalData.customer?.phone}
            />
          </div>
        </div>
      </div>
    </div>
  )


  const CheckBoxGroup = ({
    label,
    fieldPath,
    editableData,
    handleCheckboxChange,
  }) => {
    const groupData =
      editableData && editableData[fieldPath] ? editableData[fieldPath] : {};
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
              disabled={groupData.missing || false}
            />{" "}
            Scratches
          </label>
          <label>
            <input
              type="checkbox"
              name={`${fieldPath}.damage`}
              checked={groupData.damage || false}
              onChange={handleCheckboxChange}
              disabled={groupData.missing || false}
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
  const [showCalendar, setShowCalendar] = useState(false);

  const fetchingData = async () => {
    try {
      const response = await axios.get(
        "http://3.7.2.124:5000/api/job-card?page=1&pageSize=25"
      );
      const data = response.data.data[0];
      setJobCardData({...data});
      setOriginalData(data);
      // const response2 = await axios.get(
      //   "http://3.7.2.124:5000/api/job-card?page=1&pageSize=25"
      // );
      // const data2  = response2.data.data[0];;
      // setEditableData(data2);
     
      setEditableData(data);
      console.log(data);
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

  const onDateChange = (newDate) => {
    const formattedDate = newDate.toISOString().split("T")[0];
    handleInputChange({ target: { name: "date", value: formattedDate } });
    setShowCalendar(false);
  };

  if (!jobCardData || !originalData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 text-gray-800 bg-gray-50 min-h-screen">
      {/* {JSON.stringify(editableData)}
      {JSON.stringify(originalData)} */}
      <div className="flex justify-around flex-col">
        <div className="text-2xl font-bold text-center">JOB CARD</div>
        <div className="gap-4 m-6">
        <div className="flex flex-row p-2 border-2 bg-gray-300 rounded-lg justify-center">
          <div className="font-semibold">Job Card Code:- </div>
          <p>{jobCardData.code}</p>
        </div>
      </div>
      <hr className="my-4 border-1 border-black" />
        <div className="flex flex-row justify-around">
          <DealerInfo
            editableData={editableData}
            originalData={originalData}
            handleInputChange={handleInputChange}
          />
          <OwnerDetailComponent
            editableData={editableData}
            originalData={originalData}
            handleInputChange={handleInputChange}
            setShowCalendar={setShowCalendar}
            onDateChange={onDateChange}
            showCalendar={showCalendar}
          />
        </div>
      </div>
      <hr className="my-4 border-1 border-black" />
     
      <CustomerDetails
        editableData={editableData}
        originalData={originalData}
        handleInputChange={handleInputChange}
      />
      <div className="flex flex-row justify-around">
        <div className="inline-block border-black mt-8">
          <PieCharts />
        </div>
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
      </div>


        <div className="inline-block border-black border-2 mt-4 w-full">
          <ComplaintBox />
        </div>


    </div>
  );
};

export default JobCardDetails;
