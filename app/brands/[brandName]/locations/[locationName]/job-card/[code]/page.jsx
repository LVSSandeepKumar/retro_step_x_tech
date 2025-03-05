"use client"
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";

function SingleJobCardDetails({ jobCard }) {

    const pathname = usePathname();
    const code = pathname.split("/")[6];


    const fetchJobCard = async (code) => {
        try {
            const response = await axios(`http://192.168.0.11:5000/api/job-card/${code}`, {
              method: 'GET', 
              headers: { 'Content-Type': 'application/json' },
            });
            console.log(response.data)
          } catch (error) {
            console.error('Error:', error);
          }
    }

    useEffect(() => {
        fetchJobCard(code);
      }, []);


  if (!jobCard) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 text-gray-800 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Job Card Details</h1>

      {/* GENERAL INFO */}
      <section className="mb-6">
        <h2 className="font-bold underline mb-2">General Info</h2>
        <div className="ml-4 space-y-1">
          <p>
            <strong>Code:</strong> {jobCard.code}
          </p>
          <p>
            <strong>Status:</strong> {jobCard.jobCardStatus}
          </p>
          <p>
            <strong>Repair Type:</strong>{" "}
            {jobCard.jobCardType?.name || "N/A"}
          </p>
          <p>
            <strong>UCN:</strong> {jobCard.ucn || "N/A"}
          </p>
          <p>
            <strong>Preferred Language:</strong>{" "}
            {jobCard.preferredLanguage || "N/A"}
          </p>
          <p>
            <strong>KM Reading:</strong> {jobCard.kmReading || "N/A"}
          </p>
          <p>
            <strong>Expected Start Time:</strong>{" "}
            {jobCard.generalDetails?.expectedStartTime || "N/A"}
          </p>
          <p>
            <strong>Delivery Time:</strong>{" "}
            {jobCard.generalDetails?.deliveryTime || "N/A"}
          </p>
          <p>
            <strong>Customer Voice:</strong>{" "}
            {jobCard.generalDetails?.customerVoice || "N/A"}
          </p>
        </div>
      </section>

      {/* CUSTOMER INFO */}
      <section className="mb-6">
        <h2 className="font-bold underline mb-2">Customer Info</h2>
        <div className="ml-4 space-y-1">
          <p>
            <strong>ID:</strong> {jobCard.customer?.id}
          </p>
          <p>
            <strong>Name:</strong> {jobCard.customer?.name || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {jobCard.customer?.phone || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {jobCard.customer?.email || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {jobCard.customer?.address || "N/A"}
          </p>
        </div>
      </section>

      {/* VEHICLE INFO */}
      <section className="mb-6">
        <h2 className="font-bold underline mb-2">Vehicle Info</h2>
        <div className="ml-4 space-y-1">
          <p>
            <strong>Vehicle ID:</strong> {jobCard.vehicle?.id}
          </p>
          <p>
            <strong>Chassis No:</strong> {jobCard.vehicle?.chassisNo || "N/A"}
          </p>
          <p>
            <strong>Registration No:</strong>{" "}
            {jobCard.vehicle?.registrationNo || "N/A"}
          </p>
          <p>
            <strong>Engine No:</strong> {jobCard.vehicle?.engineNo || "N/A"}
          </p>
          <p>
            <strong>Ownership ID:</strong> {jobCard.vehicle?.ownershipId || "N/A"}
          </p>
          <p>
            <strong>Transfer Date:</strong>{" "}
            {jobCard.vehicle?.transferDate || "N/A"}
          </p>

          {/* VEHICLE MODEL INFO */}
          <h3 className="font-semibold mt-2">Vehicle Model</h3>
          <div className="ml-4 space-y-1">
            <p>
              <strong>ID:</strong> {jobCard.vehicle?.vehicleModel?.id}
            </p>
            <p>
              <strong>Code:</strong>{" "}
              {jobCard.vehicle?.vehicleModel?.code || "N/A"}
            </p>
            <p>
              <strong>Name:</strong>{" "}
              {jobCard.vehicle?.vehicleModel?.name || "N/A"}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {jobCard.vehicle?.vehicleModel?.price || "N/A"}
            </p>
          </div>
        </div>
      </section>

      {/* LOCATION INFO */}
      <section className="mb-6">
        <h2 className="font-bold underline mb-2">Location Info</h2>
        <div className="ml-4 space-y-1">
          <p>
            <strong>ID:</strong> {jobCard.location?.id}
          </p>
          <p>
            <strong>Name:</strong> {jobCard.location?.name || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {jobCard.location?.address || "N/A"}
          </p>
          <p>
            <strong>Code:</strong> {jobCard.location?.code || "N/A"}
          </p>
        </div>
      </section>

      {/* SERVICE ADVISOR */}
      <section className="mb-6">
        <h2 className="font-bold underline mb-2">Service Advisor</h2>
        <div className="ml-4 space-y-1">
          <p>
            <strong>ID:</strong> {jobCard.serviceAdvisor?.id}
          </p>
          <p>
            <strong>Name:</strong> {jobCard.serviceAdvisor?.name || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {jobCard.serviceAdvisor?.role || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {jobCard.serviceAdvisor?.email || "N/A"}
          </p>
        </div>
      </section>

      {/* TECHNICIAN */}
      <section className="mb-6">
        <h2 className="font-bold underline mb-2">Technician</h2>
        <div className="ml-4 space-y-1">
          <p>
            <strong>ID:</strong> {jobCard.technician?.id}
          </p>
          <p>
            <strong>Name:</strong> {jobCard.technician?.name || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {jobCard.technician?.role || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {jobCard.technician?.email || "N/A"}
          </p>
        </div>
      </section>

      {/* PARTS (IF ANY) */}
      <section className="mb-6">
        <h2 className="font-bold underline mb-2">Parts</h2>
        {jobCard.part && jobCard.part.length > 0 ? (
          jobCard.part.map((item, idx) => (
            <div key={idx} className="ml-4 space-y-1 mb-2">
              <p>
                <strong>Part Code:</strong> {item.code || "N/A"}
              </p>
              <p>
                <strong>Part Name:</strong> {item.name || "N/A"}
              </p>
              {/* Add more part fields as needed */}
            </div>
          ))
        ) : (
          <p className="ml-4">No parts available.</p>
        )}
      </section>
    </div>
  );
}

export default SingleJobCardDetails;
