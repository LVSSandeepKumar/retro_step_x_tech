"use client";

import React, { useEffect, useState, useRef } from "react"; // Add useRef import
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";
import { generateRandomNumber } from "@/lib/utils";
import { bikeModels } from "@/lib/constants";
import { Search, ArrowDown, ArrowUp, ArrowLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

// Helper functions for price calculations
const generateRandomPrice = () => {
  return Math.floor(Math.random() * (250000 - 50000 + 1) + 50000);
};

const calculateLifeTax = (exShowroom) => {
  return Math.round(exShowroom * 0.152);
};

const calculateInsurance = (exShowroom) => {
  const insurancePercent = (Math.random() * (12 - 10) + 10) / 100;
  return Math.round(exShowroom * insurancePercent);
};

const getPDICharges = () => {
  return Math.random() < 0.5 ? 2000 : 2500;
};

const getAccessories = () => {
  const options = [3150, 3650, 4150, 6150];
  return options[Math.floor(Math.random() * options.length)];
};

const calculateOnRoadPrice = (prices) => {
  return Object.values(prices).reduce((sum, value) => sum + value, 0);
};

const CreateSalePage = () => {
  const router = useRouter();
  const [modelSearch, setModelSearch] = useState("");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [bikeDetails, setBikeDetails] = useState({
    bikeName: "",
    exShowroom: 0,
    lifeTax: 0,
    insurance: 0,
    pdiCharges: 0,
    accessories: 0,
    onRoadPrice: 0,
  });
  const [paymentMethod, setPaymentMethod] = useState({
    spotPayment: false,
    finance: false,
  });
  const [exchange, setExchange] = useState(false);
  const dropdownRef = useRef(null);
  const [exchangeDetails, setExchangeDetails] = useState({
    exchangeValue: 0,
    onRoadPriceAfterExchange: 0,
  });

  // Filter bike models based on search
  const filteredModels = bikeModels.filter((model) =>
    model.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const handleModelSelect = (model) => {
    const exShowroom = generateRandomPrice();
    const lifeTax = calculateLifeTax(exShowroom);
    const insurance = calculateInsurance(exShowroom);
    const pdiCharges = getPDICharges();
    const accessories = getAccessories();

    const totalOnRoadPrice = calculateOnRoadPrice({
      exShowroom,
      lifeTax,
      insurance,
      pdiCharges,
      accessories,
    });

    const newBikeDetails = {
      bikeName: model,
      exShowroom,
      lifeTax,
      insurance,
      pdiCharges,
      accessories,
      onRoadPrice: totalOnRoadPrice,
    };

    setBikeDetails(newBikeDetails);
    setSelectedModel(model);
    setIsModelDropdownOpen(false);
    // Initialize exchange details with full on-road price
    setExchangeDetails((prev) => ({
      ...prev,
      onRoadPriceAfterExchange: totalOnRoadPrice,
    }));
  };

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

  const bikeInfoInputFields = [
    { label: "Bike Name", type: "text", name: "bikeName" },
    { label: "Ex Showroom", type: "number", name: "exShowroom" },
    { label: "Life Tax", type: "number", name: "lifeTax" },
    { label: "Insurance", type: "number", name: "insurance" },
    { label: "PDI Charges", type: "number", name: "pdiCharges" },
    { label: "Accessories", type: "number", name: "accessories" },
    { label: "On Road Price", type: "number", name: "onRoadPrice" },
  ];

  const customerInfoInputFields = [
    { label: "Customer Name", type: "text", name: "customerName" },
    { label: "Customer No.", type: "text", name: "customerNo" },
    { label: "Aadhar Number", type: "text", name: "aadharNo" },
  ];

  const exchangeInfoInputFields = [
    { label: "Bike Name", type: "text", name: "exchangeBikeName" },
    { label: "Registration No.", type: "text", name: "registrationNo" },
    { label: "Manufacturing Year", type: "text", name: "manufacturingYear" },
    { label: "Kilometers Run", type: "text", name: "kilometersRun" },
    {
      label: "Current Condition",
      type: "text",
      name: "currentCondition",
      placeholder: "Excellent/Good/Fair/Bad",
    },
    { label: "Any known issues", type: "text", name: "knownIssues" },
    { label: "Upload photos", type: "file", name: "photos" },
    { label: "Upload RC", type: "file", name: "rc" },
    { label: "Exchange Value", type: "number", name: "exchangeValue" },
    {
      label: "On Road Price after exchange",
      type: "number",
      name: "onRoadPriceAfterExchange",
    },
  ];

  const spotPaymentInputFields = [
    { label: "Amount", type: "number", name: "amount" },
    {
      label: "Mode of Payment",
      type: "text",
      name: "modeOfPayment",
      placeholder: "Cash/Card/UPI",
    },
    {
      label: "Transaction No. (in case of UPI)",
      type: "text",
      name: "transactionNo",
    },
    {
      label: "Transaction ID (in case of Card)",
      type: "text",
      name: "transactionId",
    },
    { label: "Chassis number", type: "text", name: "chassisNumber" },
    { label: "Engine number", type: "text", name: "engineNumber" },
    { label: "Discount Applied", type: "text", name: "discountApplied" },
  ];

  const financePaymentInputFields = [
    { label: "Advance Paid", type: "number", name: "advancePaid" },
    { label: "Remaining Amount", type: "number", name: "remainingAmount" },
    { label: "Mode of Payment", type: "text", name: "modeOfPayment" },
    {},
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

  // Add useEffect for click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsModelDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add handler for exchange value changes
  const handleExchangeValueChange = (e) => {
    const inputValue = e.target.value;
    const exchangeValue = inputValue === "" ? 0 : parseFloat(inputValue);
    const newPrice = bikeDetails.onRoadPrice - exchangeValue;

    setExchangeDetails({
      exchangeValue: inputValue, // Keep the raw input value
      onRoadPriceAfterExchange: isNaN(newPrice)
        ? bikeDetails.onRoadPrice
        : newPrice,
    });
  };

  return (
    <div className="p-4 md:p-6 lg:px-4 lg:py-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-semibold">Create Sale</h1>
        </div>
        <div ref={dropdownRef}>
          <DropdownMenu
            open={isModelDropdownOpen}
            onOpenChange={setIsModelDropdownOpen}
            modal={false}
          >
            <DropdownMenuTrigger className="w-96">
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded border">
                <span className="truncate">
                  {selectedModel || "Select Bike Model"}
                </span>
                {isModelDropdownOpen ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-96 bg-white"
              onCloseAutoFocus={(e) => e.preventDefault()}
              onInteractOutside={(e) => e.preventDefault()}
            >
              <div className="p-2 sticky top-0 bg-white border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search models..."
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="pl-8"
                  />
                </div>
              </div>
              <ScrollArea className="h-[200px]">
                {filteredModels.map((model, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="cursor-pointer"
                    onClick={() => handleModelSelect(model)}
                  >
                    {model}
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold">Bike Details</h1>
            {selectedModel && (
              <p className="text-purple-500 text-sm">
                Selected Model: {selectedModel}
              </p>
            )}
          </div>

          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-6 gap-4">
            {bikeInfoInputFields.map((field, index) => (
              <div key={index}>
                <label className="text-sm text-gray-500">{field.label}</label>
                <Input
                  type={field.type}
                  name={field.name}
                  value={bikeDetails[field.name]}
                  onChange={handleInputChange}
                  disabled={selectedModel}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-lg font-semibold">Customer Details</h1>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-1 lg:grid-cols-3 gap-4">
            {customerInfoInputFields.map((field, index) => (
              <div key={index}>
                <label className="text-sm text-gray-500">{field.label}</label>
                <Input
                  type={field.type}
                  name={field.name}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold">
            Select Exchange Availability
          </h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Yes</label>
              <Checkbox
                checked={exchange}
                onCheckedChange={() => {
                  setExchange(true);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">No</label>
              <Checkbox
                checked={exchange === false}
                onCheckedChange={() => {
                  setExchange(false);
                }}
              />
            </div>
          </div>
        </div>

        {exchange && (
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-semibold">Exchange Details</h1>
            <div className="flex flex-col md:grid md:grid-cols-1 lg:grid-cols-4 gap-4">
              {exchangeInfoInputFields.map((field, index) => (
                <div key={index}>
                  <label className="text-sm text-gray-500">{field.label}</label>
                  <Input
                    type={field.type}
                    name={field.name}
                    onChange={
                      field.name === "exchangeValue"
                        ? handleExchangeValueChange
                        : handleInputChange
                    }
                    placeholder={
                      field.name === "onRoadPriceAfterExchange"
                        ? `₹${exchangeDetails.onRoadPriceAfterExchange.toLocaleString()}`
                        : field.placeholder
                    }
                    disabled={field.name === "onRoadPriceAfterExchange"}
                    value={
                      field.name === "exchangeValue"
                        ? exchangeDetails.exchangeValue
                        : field.name === "onRoadPriceAfterExchange"
                        ? `₹${exchangeDetails.onRoadPriceAfterExchange.toLocaleString()}`
                        : ""
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold">Select Payment Method</h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Spot Payment</label>
              <Checkbox
                checked={paymentMethod.spotPayment}
                onCheckedChange={(checked) => {
                  setPaymentMethod({
                    spotPayment: checked,
                    finance: false,
                  });
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Finance</label>
              <Checkbox
                checked={paymentMethod.finance}
                onCheckedChange={(checked) => {
                  setPaymentMethod({
                    spotPayment: false,
                    finance: checked,
                  });
                }}
              />
            </div>
          </div>
        </div>

        {paymentMethod.spotPayment && (
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold">Spot Payment Details</h4>
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {spotPaymentInputFields.map((field, index) => (
                <div key={index}>
                  <label className="text-sm text-gray-500">{field.label}</label>
                  <Input
                    type={field.type}
                    name={field.name}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Button type="submit">Create Sale</Button>
      </form>
    </div>
  );
};

export default CreateSalePage;
