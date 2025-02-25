"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const AddJobCardPage = () => {
  const router = useRouter();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJobCard({ ...newJobCard, [name]: value });
  };

  const handleSave = () => {
    // Assuming the onSave function is passed via query params
    const onSave = router.query.onSave;
    if (onSave) {
      onSave(newJobCard);
    }
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen p-4">
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(newJobCard).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              value={newJobCard[key]}
              onChange={handleInputChange}
              placeholder={key}
              className="border p-2"
            />
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <Button onClick={() => router.back()}>Back</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default AddJobCardPage;
