"use client";

import React, { useEffect, useState, useRef } from "react"; // Add useRef import
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";
import { generateRandomNumber } from "@/lib/utils";
import { bikeModels } from "@/lib/constants";
import { Search, ArrowDown, ArrowUp, ArrowLeft, Plus, Minus } from "lucide-react"; // Add Plus and Minus import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenerateChallan
  from "./_components/ChallanBtn"; // Adjust the path based on your project structure

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

  const brandName = usePathname().split("/")[2];
  const locationName = usePathname().split("/")[4]; 
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
    onRoadPriceAfterExchange: 0, // Add this field
  });
  const [paymentMethod, setPaymentMethod] = useState({
    spotPayment: false,
    finance: false,
  });
  const [exchange, setExchange] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownContentRef = useRef(null);
  const [exchangeDetails, setExchangeDetails] = useState({
    exchangeValue: 0,
  });
  const [paymentMode, setPaymentMode] = useState(""); // Add this state
  const [transactions, setTransactions] = useState([
    {
      serialNo: 1,
      paymentMode: "",
      transactionDetails: "",
      amount: "",
    },
  ]);
  const [activeTab, setActiveTab] = useState("new-bike");


  const paymentModeOptions = ["Cash", "Card", "UPI", "Bank Transfer"];

  const handleAddTransaction = () => {
    setTransactions([
      ...transactions,
      {
        serialNo: transactions.length + 1,
        paymentMode: "",
        transactionDetails: "",
        amount: "",
      },
    ]);
  };

  const handleRemoveTransaction = (indexToRemove) => {
    if (transactions.length > 1) {
      const updatedTransactions = transactions
        .filter((_, index) => index !== indexToRemove)
        .map((transaction, index) => ({
          ...transaction,
          serialNo: index + 1, // Reorder serial numbers
        }));
      setTransactions(updatedTransactions);
    }
  };

  const handleTransactionChange = (index, field, value) => {
    const updatedTransactions = transactions.map((transaction, i) => {
      if (i === index) {
        return { ...transaction, [field]: value };
      }
      return transaction;
    });
    setTransactions(updatedTransactions);
  };

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
      onRoadPriceAfterExchange: totalOnRoadPrice, // Initialize this
    };

    setBikeDetails(newBikeDetails);
    setSelectedModel(model);
    setIsModelDropdownOpen(false);
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

  const oldBikeInfoInputFields = [
    { label: "Bike Name", type: "text", name: "bikeName" },
    { label: "Registration No.", type: "text", name: "registrationNo" },
    { label: "Color", type: "text", name: "color" },
    { label: "Manufacturing Year", type: "text", name: "manufacturingYear" },
    { label: "Purchase Amount", type: "number", name: "purchaseAmount" },
    { label: "Selling Amount", type: "number", name: "sellingAmount" },
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
    // Remove onRoadPriceAfterExchange from here
  ];

  // Update spotPaymentInputFields to mark finalAmount as disabled
  const spotPaymentInputFields = [
    { label: "OnRoadPrice", type: "number", name: "onRoadPrice", disabled: true },
    { label: "Discount", type: "text", name: "discountApplied" },
    { label: "Final Amount", type: "number", name: "finalAmount", disabled: true },
    { label: "Advance Received", type: "number", name: "advanceReceived" },
    { label: "Delivery Date", type: "text", name: "deliveryDate" },
  ];

  const transactionFields = {
    UPI: [
      {
        label: "UPI Transaction No.",
        type: "text",
        name: "transactionNo",
      },
    ],
    Card: [
      {
        label: "Card Transaction ID",
        type: "text",
        name: "transactionId",
      },
    ],
  };

  const financePaymentInputFields = [
    { label: "Down Payment", type: "number", name: "downPayment" },
    { label: "Remaining Amount", type: "number", name: "remainingAmount" },
    { label: "Finance Provider", type: "dropdown", name: "financeProvider" },
    { label: "Rate of Interest", type: "number", name: "rateOfInterest" },
    { label: "Tenure", type: "number", name: "tenure" },
    { label: "Loan Amount", type: "number", name: "loanAmount" },
    { label: "On road price", type: "number", name: "onRoadPrice" },
    { label: "Documents", type: "file", name: "documents" },
  ];

  const accessoriesInputFields = [
    { label: "Serial No.", type: "number", name: "serialNo", disabled: true },
    { label: "Accessory Name", type: "text", name: "accessoryName" },
    { label: "Accessory Price", type: "number", name: "accessoryPrice" },
    { label: "Quantity", type: "number", name: "quantity" },
    { label: "Total Price", type: "number", name: "totalPrice", disabled: true },
    { label: "Discount", type: "number", name: "discount" },
    { label: "Final Price", type: "number", name: "finalPrice", disabled: true },
    { label: "Actions", type: "actions", name: "actions" }, // Add actions column
  ];

  const apparelInputFields = [
    { label: "Serial No.", type: "number", name: "serialNo", disabled: true },
    { label: "Apparel Name", type: "text", name: "apparelName" },
    { label: "Apparel Price", type: "number", name: "apparelPrice" },
    { label: "Quantity", type: "number", name: "quantity" },
    { label: "Total Price", type: "number", name: "totalPrice", disabled: true },
    { label: "Discount", type: "number", name: "discount" },
    { label: "Final Price", type: "number", name: "finalPrice", disabled: true },
    { label: "Actions", type: "actions", name: "actions" }, // Add actions column
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
  };

  // Add useEffect for click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        dropdownContentRef.current &&
        !dropdownContentRef.current.contains(event.target)
      ) {
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

    setExchangeDetails((prev) => ({
      ...prev,
      exchangeValue: inputValue,
    }));

    setBikeDetails((prev) => ({
      ...prev,
      onRoadPriceAfterExchange: isNaN(newPrice) ? prev.onRoadPrice : newPrice,
    }));
  };

  // Add this handler
  const handlePaymentModeChange = (value) => {
    setPaymentMode(value);
    setNewSale((prev) => ({
      ...prev,
      modeOfPayment: value,
      transactionNo: "",
      transactionId: "",
    }));
  };

  const [accessories, setAccessories] = useState([
    {
      serialNo: 1,
      accessoryName: "",
      accessoryPrice: "",
      quantity: "",
      totalPrice: "",
      discount: "",
      finalPrice: "",
    },
  ]);

  const [apparel, setApparel] = useState([
    {
      serialNo: 1,
      apparelName: "",
      apparelPrice: "",
      quantity: "",
      totalPrice: "",
      discount: "",
      finalPrice: "",
    },
  ]);

  // Add these handlers
  const handleAddAccessory = () => {
    setAccessories([
      ...accessories,
      {
        serialNo: accessories.length + 1,
        accessoryName: "",
        accessoryPrice: "",
        quantity: "",
        totalPrice: "",
        discount: "",
        finalPrice: "",
      },
    ]);
  };

  const handleRemoveAccessory = (indexToRemove) => {
    if (accessories.length > 1) {
      const updatedAccessories = accessories
        .filter((_, index) => index !== indexToRemove)
        .map((item, index) => ({ ...item, serialNo: index + 1 }));
      setAccessories(updatedAccessories);
    }
  };

  const handleAddApparel = () => {
    setApparel([
      ...apparel,
      {
        serialNo: apparel.length + 1,
        apparelName: "",
        apparelPrice: "",
        quantity: "",
        totalPrice: "",
        discount: "",
        finalPrice: "",
      },
    ]);
  };

  const handleRemoveApparel = (indexToRemove) => {
    if (apparel.length > 1) {
      const updatedApparel = apparel
        .filter((_, index) => index !== indexToRemove)
        .map((item, index) => ({ ...item, serialNo: index + 1 }));
      setApparel(updatedApparel);
    }
  };

  const handleAccessoryChange = (index, field, value) => {
    const updatedAccessories = accessories.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'accessoryPrice' || field === 'quantity') {
          const price = Number(field === 'accessoryPrice' ? value : item.accessoryPrice) || 0;
          const qty = Number(field === 'quantity' ? value : item.quantity) || 0;
          updatedItem.totalPrice = price * qty;
          updatedItem.finalPrice = updatedItem.totalPrice - (Number(updatedItem.discount) || 0);
        }
        if (field === 'discount') {
          updatedItem.finalPrice = updatedItem.totalPrice - Number(value);
        }
        return updatedItem;
      }
      return item;
    });
    setAccessories(updatedAccessories);
  };

  const handleApparelChange = (index, field, value) => {
    const updatedApparel = apparel.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'apparelPrice' || field === 'quantity') {
          const price = Number(field === 'apparelPrice' ? value : item.apparelPrice) || 0;
          const qty = Number(field === 'quantity' ? value : item.quantity) || 0;
          updatedItem.totalPrice = price * qty;
          updatedItem.finalPrice = updatedItem.totalPrice - (Number(updatedItem.discount) || 0);
        }
        if (field === 'discount') {
          updatedItem.finalPrice = updatedItem.totalPrice - Number(value);
        }
        return updatedItem;
      }
      return item;
    });
    setApparel(updatedApparel);
  };

  // Add new state for final price
  const [finalPrice, setFinalPrice] = useState({
    bikePrice: 0,
    accessoriesTotal: 0,
    apparelTotal: 0,
    totalAmount: 0,
  });

  // Add price calculation effect
  useEffect(() => {
    const accessoriesSum = accessories.reduce((sum, item) => sum + (Number(item.finalPrice) || 0), 0);
    const apparelSum = apparel.reduce((sum, item) => sum + (Number(item.finalPrice) || 0), 0);
    const bikePrice = Number(bikeDetails.onRoadPriceAfterExchange) || 0;

    setFinalPrice({
      bikePrice,
      accessoriesTotal: accessoriesSum,
      apparelTotal: apparelSum,
      totalAmount: bikePrice + accessoriesSum + apparelSum,
    });
  }, [accessories, apparel, bikeDetails.onRoadPriceAfterExchange]);

  const [financeDetails, setFinanceDetails] = useState({
    downPayment: 0,
    remainingAmount: 0,
    rateOfInterest: 0,
    tenure: 0,
    loanAmount: 0,
    finalOnRoadPrice: 0,
  });

  // Add this after finalPrice useEffect
  useEffect(() => {
    if (paymentMethod.finance) {
      const totalAmount = finalPrice.totalAmount;
      const downPayment = Number(financeDetails.downPayment) || 0;
      const remainingAmount = totalAmount - downPayment;
      const roi = Number(financeDetails.rateOfInterest) || 0;
      const tenure = Number(financeDetails.tenure) || 0;

      // Calculate loan amount with interest
      // Formula: P * (1 + r/100 * t)
      // where P is principal, r is rate of interest per year, t is tenure in years
      const loanAmount = remainingAmount * (1 + (roi / 100) * (tenure / 12));
      const finalOnRoadPrice = downPayment + loanAmount;

      setFinanceDetails(prev => ({
        ...prev,
        remainingAmount,
        loanAmount: Math.round(loanAmount),
        finalOnRoadPrice: Math.round(finalOnRoadPrice)
      }));
    }
  }, [
    financeDetails.downPayment,
    financeDetails.rateOfInterest,
    financeDetails.tenure,
    finalPrice.totalAmount,
    paymentMethod.finance
  ]);

  // Add this handler for finance input changes
  const handleFinanceChange = (e) => {
    const { name, value } = e.target;
    setFinanceDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [financeTransactions, setFinanceTransactions] = useState([
    {
      serialNo: 1,
      paymentMode: "",
      transactionDetails: "",
      amount: "",
    },
  ]);

  const handleAddFinanceTransaction = () => {
    setFinanceTransactions([
      ...financeTransactions,
      {
        serialNo: financeTransactions.length + 1,
        paymentMode: "",
        transactionDetails: "",
        amount: "",
      },
    ]);
  };

  const handleRemoveFinanceTransaction = (indexToRemove) => {
    if (financeTransactions.length > 1) {
      const updatedTransactions = financeTransactions
        .filter((_, index) => index !== indexToRemove)
        .map((transaction, index) => ({
          ...transaction,
          serialNo: index + 1,
        }));
      setFinanceTransactions(updatedTransactions);
    }
  };

  const handleFinanceTransactionChange = (index, field, value) => {
    if (field === 'amount') {
      const currentPaid = financeTransactions.reduce((sum, t, i) => 
        i !== index ? sum + (Number(t.amount) || 0) : sum, 0
      );
      const newAmount = Number(value) || 0;
      // Use loanAmount for validation
      const totalAllowed = financeDetails.loanAmount;
      
      if (currentPaid + newAmount > totalAllowed) {
        toast.error("Total payments cannot exceed the loan amount");
        return;
      }
    }

    const updatedTransactions = financeTransactions.map((transaction, i) => {
      if (i === index) {
        return { ...transaction, [field]: value };
      }
      return transaction;
    });
    setFinanceTransactions(updatedTransactions);
  };

  // Add new state for tracking finance payments
  const [financePaymentDetails, setFinancePaymentDetails] = useState({
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
  });

  // Update finance payment tracking when transactions change
  useEffect(() => {
    if (paymentMethod.finance) {
      const paidAmount = financeTransactions.reduce((sum, transaction) => 
        sum + (Number(transaction.amount) || 0), 0
      );
      // Use loanAmount instead of remainingAmount
      const totalAmount = financeDetails.loanAmount;
      setFinancePaymentDetails({
        totalAmount,
        paidAmount,
        remainingAmount: totalAmount - paidAmount,
      });
    }
  }, [financeTransactions, financeDetails.loanAmount, paymentMethod.finance]);

  const toogleTabs = (value) => {
    setActiveTab(value);
  };

  const prepareFormData = () => {
    return {
      bikeDetails: {
        ...bikeDetails,
        selectedModel,
      },
      customerDetails: {
        ...newSale,
      },
      exchangeDetails: exchange ? {
        ...exchangeDetails,
      } : null,
      paymentDetails: {
        method: paymentMethod.spotPayment ? 'spot' : 'finance',
        spotPayment: paymentMethod.spotPayment ? {
          transactions,
        } : null,
        finance: paymentMethod.finance ? {
          ...financeDetails,
          transactions: financeTransactions,
        } : null,
      },
      accessories: {
        items: accessories,
        total: finalPrice.accessoriesTotal,
      },
      apparel: {
        items: apparel,
        total: finalPrice.apparelTotal,
      },
      pricing: {
        ...finalPrice,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        status: 'pending',
      }
    };
  };

  // Add useEffect to update spot payment on road price
  useEffect(() => {
    if (paymentMethod.spotPayment) {
      setNewSale(prev => ({
        ...prev,
        onRoadPrice: finalPrice.totalAmount
      }));
    }
  }, [finalPrice.totalAmount, paymentMethod.spotPayment]);

  // Add this handler to calculate final amount when discount changes
  const handleDiscountChange = (e) => {
    const { value } = e.target;
    const discountPercent = parseFloat(value) || 0;
    const onRoadPrice = finalPrice.totalAmount;
    const discountAmount = (onRoadPrice * discountPercent) / 100;
    const finalAmount = onRoadPrice - discountAmount;

    setNewSale(prev => ({
      ...prev,
      discountApplied: value,
      finalAmount: Math.round(finalAmount)
    }));
  };

  // Update spotPaymentDetails state initialization
  const [spotPaymentDetails, setSpotPaymentDetails] = useState({
    onRoadPrice: 0,
    discountApplied: "",
    finalAmount: finalPrice.totalAmount,
    advanceReceived: "",
    deliveryDate: ""
  });

  // Modify handleDiscountChange
  const handleSpotPaymentChange = (e) => {
    const { name, value } = e.target;
    if (name === 'discountApplied') {
      const discountPercent = parseFloat(value) || 0;
      const onRoadPrice = finalPrice.totalAmount;
      const discountAmount = (onRoadPrice * discountPercent) / 100;
      const finalAmount = onRoadPrice - discountAmount;

      setSpotPaymentDetails(prev => ({
        ...prev,
        [name]: value,
        finalAmount: Math.round(finalAmount)
      }));
    } else {
      setSpotPaymentDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Update useEffect for finalPrice changes
  useEffect(() => {
    if (paymentMethod.spotPayment) {
      setSpotPaymentDetails(prev => ({
        ...prev,
        onRoadPrice: finalPrice.totalAmount,
        finalAmount: finalPrice.totalAmount
      }));
    }
  }, [finalPrice.totalAmount, paymentMethod.spotPayment]);

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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="new-bike" className="w-full">
        <div className="flex items-center justify-between mr-4">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="new-bike">New Bike</TabsTrigger>
            <TabsTrigger value="old-bike">Old Bike</TabsTrigger>
          </TabsList>
          {activeTab=='new-bike' && <div className="flex items-center gap-2">
            <Checkbox
              checked={exchange}
              onCheckedChange={(checked) => setExchange(checked)}
            />
            <label className="text-sm text-gray-500">Exchange</label>
          </div>}
        </div>

        <TabsContent value="new-bike">
          <form className="space-y-4" onSubmit={handleSubmit}>
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
                  ref={dropdownContentRef}
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
                    <label className="text-sm text-gray-500">
                      {field.label}
                    </label>
                    <Input
                      type={field.type}
                      name={field.name}
                      value={bikeDetails[field.name]}
                      onChange={handleInputChange}
                      disabled={selectedModel}
                      className={`${field.css}`}
                    />
                  </div>
                ))}
                {exchange && (
                  <div>
                    <label className="text-sm text-gray-500">
                      On Road Price After Exchange
                    </label>
                    <Input
                      type="number"
                      name="onRoadPriceAfterExchange"
                      value={bikeDetails.onRoadPriceAfterExchange}
                      onChange={handleInputChange}
                      disabled={selectedModel}
                      className="col-span-2"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <h1 className="text-lg font-semibold">Customer Details</h1>
              </div>

              <div className="flex flex-col md:grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                {customerInfoInputFields.map((field, index) => (
                  <div key={index}>
                    <label className="text-sm text-gray-500">
                      {field.label}
                    </label>
                    <Input
                      type={field.type}
                      name={field.name}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
              </div>
            </div>

            {exchange && (
              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-semibold">Exchange Details</h1>
                <div className="flex flex-col md:grid md:grid-cols-1 lg:grid-cols-4 gap-4">
                  {exchangeInfoInputFields.map((field, index) => (
                    <div key={index}>
                      <label className="text-sm text-gray-500">
                        {field.label}
                      </label>
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
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-lg font-semibold">Spot Payment</label>
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
                  <label className="text-lg font-semibold">Finance</label>
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
                <div className="flex flex-col md:grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {spotPaymentInputFields.map((field, index) => (
                    <div key={index}>
                      <label className="text-sm text-gray-500">{field.label}</label>
                      <Input
                        type={field.type}
                        name={field.name}
                        onChange={handleSpotPaymentChange}
                        value={spotPaymentDetails[field.name]}
                        disabled={field.disabled}
                        placeholder={field.name === 'discountApplied' ? "Enter discount %" : ""}
                      />
                    </div>
                  ))}
                </div>

                {/* Add Generate Advance Receipt button */}
                <div className="flex justify-end mt-2">
                  <GenerateChallan 
                    type="advance"
                    data={{
                      ...spotPaymentDetails,
                      customerName: newSale.customerName,
                      customerNo: newSale.customerNo,
                      bikeModel: selectedModel,
                      totalAmount: finalPrice.totalAmount
                    }}
                    label="Generate Advance Receipt"
                  />
                </div>
                
                {/* Rest of the spot payment section */}
                <div>
                  <h1 className="text-lg font-semibold">Payment Details</h1>
                </div>
                <div className="col-span-full">
                  <div className="space-y-2">
                    {transactions.map((transaction, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4">
                        <Input
                          type="number"
                          value={transaction.serialNo}
                          disabled
                          className="w-full"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-full">
                            <div className="flex items-center justify-between p-2 bg-gray-100 rounded border">
                              <span className="truncate">
                                {transaction.paymentMode ||
                                  "Select Payment Mode"}
                              </span>
                              <ArrowDown className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[200px]">
                            {paymentModeOptions.map((option) => (
                              <DropdownMenuItem
                                key={option}
                                onClick={() =>
                                  handleTransactionChange(
                                    index,
                                    "paymentMode",
                                    option
                                  )
                                }
                              >
                                {option}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Input
                          type="text"
                          placeholder={
                            transaction.paymentMode === "Card"
                              ? "Card Number"
                              : "Transaction Number"
                          }
                          value={transaction.transactionDetails}
                          onChange={(e) =>
                            handleTransactionChange(
                              index,
                              "transactionDetails",
                              e.target.value
                            )
                          }
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={transaction.amount}
                            onChange={(e) =>
                              handleTransactionChange(
                                index,
                                "amount",
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                          <div className="flex gap-1">
                            {transactions.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => handleRemoveTransaction(index)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                            {index === transactions.length - 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleAddTransaction}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {paymentMethod.finance && (
              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-semibold">Finance Details</h4>
                <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {financePaymentInputFields.map((field, index) => (
                    <div key={index}>
                      <label className="text-sm text-gray-500">
                        {field.label}
                      </label>
                      <Input
                        type={field.type}
                        name={field.name}
                        onChange={handleFinanceChange}
                        value={
                          field.name === 'remainingAmount'
                            ? financeDetails.remainingAmount
                            : field.name === 'loanAmount'
                            ? financeDetails.loanAmount
                            : field.name === 'onRoadPrice'
                            ? financeDetails.finalOnRoadPrice
                            : financeDetails[field.name] || ''
                        }
                        disabled={
                          field.name === 'remainingAmount' ||
                          field.name === 'loanAmount' ||
                          field.name === 'onRoadPrice'
                        }
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-4">Finance Payment Details</h4>
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Loan Amount:</span>
                        <span className="ml-2 font-semibold">
                          ₹{financeDetails.loanAmount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Paid Amount:</span>
                        <span className="ml-2 font-semibold">
                          ₹{financePaymentDetails.paidAmount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Remaining:</span>
                        <span className="ml-2 font-semibold text-purple-600">
                          ₹{financePaymentDetails.remainingAmount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total EMIs:</span>
                        <span className="ml-2 font-semibold">
                          {financeDetails.tenure}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {financeTransactions.map((transaction, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4">
                        <Input
                          type="number"
                          value={transaction.serialNo}
                          disabled
                          className="w-full"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-full">
                            <div className="flex items-center justify-between p-2 bg-gray-100 rounded border">
                              <span className="truncate">
                                {transaction.paymentMode || "Select Payment Mode"}
                              </span>
                                <ArrowDown className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[200px]">
                            {paymentModeOptions.map((option) => (
                              <DropdownMenuItem
                                key={option}
                                onClick={() =>
                                  handleFinanceTransactionChange(index, "paymentMode", option)
                                }
                              >
                                {option}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Input
                          type="text"
                          placeholder={
                            transaction.paymentMode === "Card"
                              ? "Card Number"
                              : "Transaction Number"
                          }
                          value={transaction.transactionDetails}
                          onChange={(e) =>
                            handleFinanceTransactionChange(
                              index,
                              "transactionDetails",
                              e.target.value
                            )
                          }
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={transaction.amount}
                            onChange={(e) =>
                              handleFinanceTransactionChange(
                                index,
                                "amount",
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                          <div className="flex gap-1">
                            {financeTransactions.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => handleRemoveFinanceTransaction(index)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                            {index === financeTransactions.length - 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleAddFinanceTransaction}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {financePaymentDetails.remainingAmount > 0 && (
                    <div className="mt-2 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddFinanceTransaction}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Payment
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modify the accessories section header */}
            <div className="flex flex-col gap-2">
              {/* Rest of accessories section remains same */}
              <div className="grid grid-cols-8 gap-4 mb-2">
                {accessoriesInputFields.map((field) => (
                  <div key={field.name} className="font-medium text-sm text-gray-600">
                    {field.label}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {accessories.map((item, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-8 gap-4 items-center">
                    {accessoriesInputFields.map((field) => (
                      <div key={field.name}>
                        {field.type === "actions" ? (
                          <div className="flex gap-1 items-center">
                            {accessories.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => handleRemoveAccessory(rowIndex)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                            {rowIndex === accessories.length - 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleAddAccessory}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Input
                            type={field.type}
                            name={field.name}
                            value={item[field.name]}
                            onChange={(e) =>
                              handleAccessoryChange(rowIndex, field.name, e.target.value)
                            }
                            disabled={field.disabled}
                            className="w-full"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Modify the apparel section header - remove the Add Row button */}
            <div className="flex flex-col gap-2">
              <div className="mb-4">
                <h4 className="text-lg font-semibold">Apparel</h4>
              </div>
              {/* Rest of apparel section remains same */}
              <div className="grid grid-cols-8 gap-4 mb-2">
                {apparelInputFields.map((field) => (
                  <div key={field.name} className="font-medium text-sm text-gray-600">
                    {field.label}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {apparel.map((item, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-8 gap-4 items-center">
                    {apparelInputFields.map((field) => (
                      <div key={field.name}>
                        {field.type === "actions" ? (
                          <div className="flex gap-1 items-center">
                            {apparel.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => handleRemoveApparel(rowIndex)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                            {rowIndex === apparel.length - 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleAddApparel}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Input
                            type={field.type}
                            name={field.name}
                            value={item[field.name]}
                            onChange={(e) =>
                              handleApparelChange(rowIndex, field.name, e.target.value)
                            }
                            disabled={field.disabled}
                            className="w-full"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Add final price summary */}
            <div className="flex flex-col gap-2 border-t pt-4">
              <h4 className="text-lg font-semibold">Price Summary</h4>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div className="text-sm text-gray-600">Bike Price:</div>
                <div>₹{finalPrice.bikePrice.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Accessories Total:</div>
                <div>₹{finalPrice.accessoriesTotal.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Apparel Total:</div>
                <div>₹{finalPrice.apparelTotal.toLocaleString()}</div>
                <div className="text-lg font-semibold">Final Price:</div>
                <div className="text-lg font-semibold">₹{finalPrice.totalAmount.toLocaleString()}</div>
              </div>
            </div>

            {/* Replace the buttons section at the bottom */}
            <div className="flex gap-4">
              <Button type="submit">Create Sale</Button>
              <GenerateChallan 
                type="bike" 
                data={prepareFormData()} 
                label="Generate Delivery Challan"
              />
            </div>
          </form>
        </TabsContent>
        <TabsContent value="old-bike">
          <div className="flex flex-col gap-2"></div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateSalePage;
