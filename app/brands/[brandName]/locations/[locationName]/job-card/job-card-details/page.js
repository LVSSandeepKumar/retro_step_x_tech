"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import axios from "axios";
import PieCharts from "../_components/PieChart"; // Adjust the import path as needed

const JobCardDetails = () => {
  const [jobCardData, setJobCardData] = useState();

  const fetchingdata = async () => {
    const response = await axios
      .get(` http://3.7.2.124:5000/api/job-card?page=1&pageSize=25`)
      .then((response) => {
        // console.log(response);
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
    setJobCardData(response.data.data[0]);
    console.log(response.data.data[0]);
  };

  useEffect(() => {
    fetchingdata();
  }, []);

  if (!jobCardData) {
    return <div>Loading...</div>;
  }

  const OwnerDetailComponent = () => {
    return (
      <div className="mt-16">
        <div className="flex items-center mb-2">
          <p className="w-32 font-semibold text-right">Model:</p>
          <p className="ml-4">
            {jobCardData.vehicle.vehicleModel.name || "N/A"}
          </p>
        </div>
        <div className="flex items-center mb-2">
          <p className="w-32 font-semibold text-right">Reg No:</p>
          <p className="ml-4">{jobCardData.vehicle.registrationNo || "N/A"}</p>
        </div>
        <div className="flex items-center mb-2">
          <p className="w-32 font-semibold text-right">Repair Type:</p>
          <p className="ml-4">{jobCardData.jobCardType.name || "N/A"}</p>
        </div>
        <div className="flex items-center mb-2">
          <p className="w-32 font-semibold text-right">Date:</p>
          <p className="ml-4">{jobCardData.date || "N/A"}</p>
        </div>
      </div>
    );
  };

  const DealerInfo = () => {
    return (
      <div className="mt-10">
        <h2 className="font-bold text-2xl ml-10 underline p-2">Dealer Info</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Name:</p>
            <p className="ml-4">{jobCardData.location.name || "N/A"}</p>
          </div>
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Address:</p>
            <p className="ml-4">{jobCardData.location.address || "N/A"}</p>
          </div>
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">State:</p>
            <p className="ml-4">{jobCardData.dealerState || "N/A"}</p>
          </div>
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Contact:</p>
            <p className="ml-4">{jobCardData.dealerContact || "N/A"}</p>
          </div>
          <div className="flex items-center">
            <p className="w-32 font-semibold text-right">Email:</p>
            <p className="ml-4">{jobCardData.dealerEmail || "N/A"}</p>
          </div>
        </div>
      </div>
    );
  };

  const CheckBoxGroup = ({ label }) => {
    return (
      <div className="mb-4">
        <p className="font-semibold">{label}</p>
        <div className="flex space-x-4">
          <label>
            <input type="checkbox" name={`${label}-a`} /> Scratches
          </label>
          <label>
            <input type="checkbox" name={`${label}-b`} /> Damage
          </label>
          <label>
            <input type="checkbox" name={`${label}-c`} /> Missing
          </label>
        </div>
      </div>
    );
  };

  const CustomerDetails = ({
    name,
    email,
    address,
    chassisNo,
    engineNo,
    contactNo,
  }) => {
    return (
      <div className="m-6 p-4 border rounded-lg shadow-sm bg-gray-50">
        <h2 className="text-xl font-bold mb-4 text-center">Customer Details</h2>
        <div className="flex flex-row justify-around divide-x divide-gray-800">
          <div className="pr-4">
            <div className="flex items-center">
              <p className="w-32 font-semibold text-right">Name:</p>
              <p className="ml-4">{jobCardData.customer.name || "N/A"}</p>
            </div>
            <div className="flex items-center">
              <p className="w-32 font-semibold text-right">Email:</p>
              <p className="ml-4">{jobCardData.customer.email || "N/A"}</p>
            </div>
            <div className="flex items-center">
              <p className="w-32 font-semibold text-right">Address:</p>
              <p className="ml-4">{jobCardData.customer.address || "N/A"}</p>
            </div>
          </div>
          <div className="pl-4">
            <div className="flex items-center">
              <p className="w-32 font-semibold text-right">Chassis No:</p>
              <p className="ml-4">{jobCardData.vehicle.chassisNo || "N/A"}</p>
            </div>
            <div className="flex items-center">
              <p className="w-32 font-semibold text-right">Engine No:</p>
              <p className="ml-4">{jobCardData.vehicle.engineNo || "N/A"}</p>
            </div>
            <div className="flex items-center">
              <p className="w-32 font-semibold text-right">Contact No:</p>
              <p className="ml-4">{jobCardData.customer.phone || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    );
    
  };

  return (
    <div className="p-8 text-gray-800 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div className="flex justify-around flex-col">
        <div className="text-2xl font-bold text-center ">JOB CARD</div>
        <div className="flex flex-row justify-around">
          <DealerInfo />
          <OwnerDetailComponent />
        </div>
      </div>
      <div className=" gap-4 m-6 ">
        <div className="flex flex-row p-2  border-2 bg-gray-300 rounded-lg justify-center">
          <div className="font-semibold ">Job Card Code:- </div>
          <p>{jobCardData.code}</p>
        </div>
      </div>

      <hr className="my-4 border-1 border-black" />

      <CustomerDetails />

      <hr className="my-4 border-1 border-black" />

      {/* Checkboxes */}
      <div className="mt-8 justify-center  items-center ">
        <CheckBoxGroup label="P.Tank" />
        <CheckBoxGroup label="Tank Logo" />
        <CheckBoxGroup label="Side cover" />
        <CheckBoxGroup label="Indicator glass" />
        <CheckBoxGroup label="Crash guard" />
        <CheckBoxGroup label="Speed meter" />
      </div>

      <hr className="my-4 border-1 border-black" />

      {/* Pie Chart Example */}
      <div className=" border-4 border-black flex justify-center mt-8">
        <PieCharts/>
      </div>
    </div>
  );
};

export default JobCardDetails;
