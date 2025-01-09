"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";
import { generateRandomNumber } from "@/lib/utils";

const CreateSalePage = () => {
  const router = useRouter();
  const [placeholders, setPlaceholders] = useState({
    discountApplied: "",
    inwardDate: "05-09-2024",
  });

  useEffect(() => {
    setPlaceholders((prev) => ({
      ...prev,
      discountApplied: `${generateRandomNumber(15, 40)}%`,
    }));
  }, []);

  const [newSale, setNewSale] = useState({
    productType: "",
    productName: "",
    customerName: "",
    customerNo: "",
    salesManName: "",
    amount: "",
    discountApplied: "",
    serviceDivisions: [],
    inwardDate: new Date().toISOString().split("T")[0],
  });

  const inputFields = [
    { label: "Product Type", type: "text", name: "productType" },
    { label: "Product Name", type: "text", name: "productName" },
    { label: "Customer Name", type: "text", name: "customerName" },
    { label: "Customer No.", type: "text", name: "customerNo" },
    { label: "SalesMan Name", type: "text", name: "salesManName" },
    { label: "Amount", type: "number", name: "amount" },
    { label: "Advance Paid", type: "number", name: "advancePaid" },
    { label: "Remaining Balance", type: "number", name: "remainingBalance" },
    {
      label: "Discount Applied",
      type: "number",
      name: "discountApplied",
      placeholder: placeholders.discountApplied,
      disabled: true,
    },
    {
      label: "Inward Date",
      type: "text",
      name: "inwardDate",
      placeholder: placeholders.inwardDate,
      disabled: true,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setNewSale((prev) => ({
      ...prev,
      serviceDivisions: checked
        ? [...prev.serviceDivisions, value]
        : prev.serviceDivisions.filter((division) => division !== value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submit logic here
    toast.success("New Sale created successfully");
    router.push(
      `/brands/${router.query.brandName}/locations/${router.query.locationName}/sublocations/${router.query.sublocationname}`
    );
  };

  return (
    <div className="p-4 md:p-6 lg:px-4 lg:py-6">
      <h1 className="text-2xl font-semibold mb-4">Create Sale</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Service Divisions
          </label>
          <div className="mt-2 space-y-2 grid grid-cols-3">
            {["Bike", "Auto", "Commercial"].map((division, index) => (
              <div key={index} className="flex items-center">
                <Checkbox
                  id={`division-${index}`}
                  value={division}
                  onChange={handleCheckboxChange}
                />
                <label
                  htmlFor={`division-${index}`}
                  className="ml-2 block text-sm text-gray-900"
                >
                  {division}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {inputFields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <Input
                type={field.type}
                name={field.name}
                value={newSale[field.name]}
                onChange={handleInputChange}
                className="mt-1 block w-full placeholder-gray-950"
                disabled={field.disabled || false}
                placeholder={field.placeholder || ""}
              />
            </div>
          ))}
        </div>

        <Button type="submit">Create Sale</Button>
      </form>
    </div>
  );
};

export default CreateSalePage;
