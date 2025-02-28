"use client";
import React, { useEffect, useState } from "react";
import {api} from "@/utils/api";

const JobCardDetails = () => {
  const [jobCardData, setJobCardData] = useState();

  const fetchingdata = async () => {
    const response = await api.get(`/job-card?page=1&pageSize=25`)
    .then((response) => {
      console.log(response);
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
      <div className="text-right">
        <p>
          <span className="font-semibold">Model:</span> {jobCardData.model}
        </p>
        <p>
          <span className="font-semibold">Reg No:</span> {jobCardData.regNo}
        </p>
        <p>
          <span className="font-semibold">Repair Type:</span> {jobCardData.repairType}
        </p>
        <p>
          <span className="font-semibold">Date:</span> {jobCardData.date}
        </p>
      </div>
    );
  };


  

  const DealerInfo = () => {
    return (
      <div className="flex items-start mb-4">
        <div className="space-y-1">
          <h2 className="font-semibold text-lg">Dealer Info</h2>
          <p>{jobCardData.dealerName}</p>
          <p>{jobCardData.dealerLocation}</p>
          <p>{jobCardData.dealerState}</p>
          <p>{jobCardData.dealerContact}</p>
          <p>{jobCardData.dealerEmail}</p>
        </div>
      </div>
    );
  };

  const Scratches = () => {
    return (
      <div className="mr-8 mb-4 md:mb-0">
        <p className="font-semibold underline mb-2">Scratches</p>
        {(jobCardData.scratches || [...new Array(4)]).map((scratch, index) => (
          <p key={index}>{scratch}</p>
        ))}
      </div>
    );
  };

  const Missing = () => {
    return (
      <div>
        <p className="font-semibold underline mb-2">Missing</p>
        {(jobCardData.missing||[]).map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    );
  };


  return (
    <div className="p-8 text-gray-800 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div className="flex justify-around">
        <OwnerDetailComponent />
        <DealerInfo />
      </div>

      <hr className="my-4" />

      {/* Job Card Heading */}
      <h2 className="text-xl font-bold text-center mb-4">JOB CARD</h2>

      {/* Job Card Info Rows */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
            <p className="font-semibold">Job Card No:</p>
            <p>
                {
                    jobCardData.code
                }
            </p>
        </div>
      </div>

      <hr className="my-4" />

      {/* Inventory Management */}
      <h2 className="text-lg font-bold mb-2">Inventory Management</h2>
      <div className="flex flex-wrap md:flex-nowrap md:space-x-8">
        {/* Left Column (Labels) */}
        <div className="mr-8 mb-4 md:mb-0">
          <p className="font-semibold">petrol</p>
          <p className="font-semibold">D v/s M</p>
        </div>

        {/* Damage */}
       
        <Scratches />
        <Missing />
      </div>
    </div>
  );
};

export default JobCardDetails;
