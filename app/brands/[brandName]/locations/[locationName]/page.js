"use client";

import BestSellingProductsTable from "@/app/brands/[brandName]/locations/[locationName]/_components/BestSellingProductsTable";
import InventoryOverviewCard from "@/app/brands/[brandName]/locations/[locationName]/_components/InventoryOverviewCard";
import { Dialog } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subLocationsData } from "@/lib/constants";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { subDays } from "date-fns";

// Remove these imports as they're no longer needed
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// import { ChevronDown, ChevronUp } from "lucide-react";
import SelectionGrid from "@/app/_components/SelectionGrid";
import { Star } from "lucide-react";
// Remove LocationRevenueDetails import since we won't use it here
import { ExpensesDivisionChart } from "@/app/_components/ExpensesDivisionChart";
import ExpensesVsCollectionsChart from "@/app/_components/ExpensesVsCollectionsChart";
import FinanceSummary from "@/app/_components/FinanceSummaryCard";
import VerifiedUnverifiedChart from "@/app/_components/VerifiedUnverifiedChart";
import {
  BRANDS,
  OTHER_TYPES,
  SERVICE_TYPES,
} from "@/app/_constants/chartConstants";
import DeliveryCard from "./_components/DeliveryBikes";

const PERIODS = {
  YESTERDAY: "Yesterday",
  WEEKLY: "Weekly",
  MONTHLY: "This Month",
  YTD: "Year to Date",
};

const AMOUNT_RANGES = {
  YESTERDAY: { min: 10000, max: 100000 },
  WEEKLY: { min: 100001, max: 1000000 },
  MONTHLY: { min: 1000001, max: 10000000 },
  YTD: { min: 10000001, max: 100000000 },
};

const COUNT_RANGES = {
  YESTERDAY: { min: 1, max: 10 },
  WEEKLY: { min: 11, max: 100 },
  MONTHLY: { min: 101, max: 1000 },
  YTD: { min: 1001, max: 2000 },
};

const generateRandomLocationData = () => {
  const serviceDivisions = ["Bike", "Auto", "Commercial", "Electric"]
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);

  return {
    serviceDivisions,
    salesMetrics: {
      visits: Math.floor(Math.random() * 50) + 50,
      orders: Math.floor(Math.random() * 40) + 30,
      conversionRate: Math.floor(Math.random() * 30) + 40,
    },
    inventory: {
      lowStock: Array(5)
        .fill()
        .map(() => ({
          name: `Product ${Math.floor(Math.random() * 100)}`,
          quantity: Math.floor(Math.random() * 10),
          reorderPoint: Math.floor(Math.random() * 20) + 10,
        })),
      fastMoving: Array(5)
        .fill()
        .map(() => ({
          name: `Product ${Math.floor(Math.random() * 100)}`,
          soldCount: Math.floor(Math.random() * 100) + 50,
          revenue: Math.floor(Math.random() * 100000),
        })),
      deadStock: Array(5)
        .fill()
        .map(() => ({
          name: `Product ${Math.floor(Math.random() * 100)}`,
          daysInStock: Math.floor(Math.random() * 100) + 60,
          value: Math.floor(Math.random() * 50000),
        })),
    },
    bestSalesPerson: {
      name: `${
        ["John", "Jane", "Mike", "Sarah"][Math.floor(Math.random() * 4)]
      } ${
        ["Smith", "Doe", "Johnson", "Williams"][Math.floor(Math.random() * 4)]
      }`,
      sales: Math.floor(Math.random() * 4000) + 1000,
      target: Math.floor(Math.random() * 5000) + 5000,
      performance: Math.floor(Math.random() * 30) + 70,
    },
    accessories: {
      totalSold: Math.floor(Math.random() * 1000),
      revenue: Math.floor(Math.random() * 500000),
      topSelling: ["Helmets", "Phone Holders", "Seat Covers"][
        Math.floor(Math.random() * 3)
      ],
    },
    insurance: {
      policies: Math.floor(Math.random() * 100),
      premium: Math.floor(Math.random() * 200000),
      claims: Math.floor(Math.random() * 20),
    },
  };
};

// Add this new function after the constants and before the LocationPage component
const generatePeriodData = (period) => {
  const amountRange = AMOUNT_RANGES[period];
  const countRange = COUNT_RANGES[period];

  const baseSales =
    Math.floor(Math.random() * (amountRange.max - amountRange.min)) +
    amountRange.min;
  const baseCount =
    Math.floor(Math.random() * (countRange.max - countRange.min)) +
    countRange.min;

  return {
    period,
    sales: baseSales,
    services: Math.round(baseSales * 0.86),
    others: Math.round(baseSales * 0.9),
    counts: {
      sales: baseCount,
      services: Math.round(baseCount * 1.1),
      others: Math.round(baseCount * 2.2),
    },
  };
};

const INITIAL_PERIOD_VALUES = {
  YESTERDAY: {
    period: "YESTERDAY",
    sales: 50000,
    services: 43000,
    others: 45000,
    counts: {
      sales: 5,
      services: 6,
      others: 11,
    },
  },
};

const INITIAL_FINANCE_VALUES = {
  period: "YESTERDAY",
  cash: 200000,
  upi: 160000,
  expenses: 288000,
};

const INITIAL_EXPENSES_DATA = {
  Salaries: 60000,
  OSJ: 48000,
  "Electricity Charges": 36000,
  "Other Expenses": 24000,
  "Branch Maintenance": 18000,
  "Transportation Charges": 12000,
};

const getDateRange = (period) => {
  const now = new Date();
  switch (period) {
    case "WEEKLY":
      return { from: subDays(now, 7).toISOString(), to: now.toISOString() };
    case "MONTHLY":
      return { from: subDays(now, 30).toISOString(), to: now.toISOString() };
    case "YTD":
      return { from: new Date(now.getFullYear(), 0, 1).toISOString(), to: now.toISOString() };
    default:
      return { from: subDays(now, 1).toISOString(), to: now.toISOString() };
  }
};

const LocationPage = () => {
  const { brandName, locationName } = useParams();
  const router = useRouter();

  // Group all state declarations at the top
  const [locationData, setLocationData] = useState(null);
  const [randomData, setRandomData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("YESTERDAY");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOverview, setSelectedOverview] = useState(null);
  const [detailsData, setDetailsData] = useState(null);
  const [periodValues, setPeriodValues] = useState(INITIAL_FINANCE_VALUES);
  const [expensesData, setExpensesData] = useState(INITIAL_EXPENSES_DATA);
  const[numericalData, setNumericalData] = useState([]);  

  // Add new state
  const [revenueValues, setRevenueValues] = useState(
    INITIAL_PERIOD_VALUES.YESTERDAY
  );

  const fetchJobCardData = async (from, to) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/job-card?from=${from}&to=${to}`);
      setNumericalData(response.data.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const inputFields = [
    { label: "Product Type", type: "text", name: "product_Type" },
    { label: "Product Name", type: "text", name: "productName" },
    { label: "Customer Name", type: "text", name: "customerName" },
    { label: "Customer No.", type: "text", name: "customerNo" },
    { label: "SalesMan Name", type: "text", name: "salesManName" },
    { label: "Amount", type: "number", name: "amount" },
    { label: "Discount Applied", type: "number", name: "discountApplied" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDialogOpen(false);
    toast.success("New Sale created successfully");
  };

  const generateDetailsData = (period, type, baseValue, baseCount) => {
    const distributions = {
      sales: [0.4, 0.3, 0.2, 0.1],
      services: [0.4, 0.3, 0.2, 0.1],
      others: [0.35, 0.3, 0.2, 0.15],
    };

    const items =
      type === "sales"
        ? BRANDS
        : type === "services"
        ? SERVICE_TYPES
        : OTHER_TYPES;

    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];
    const distribution = distributions[type];

    let remainingValue = baseValue;
    let remainingCount = baseCount;

    return items.map((item, index) => {
      const ratio = distribution[index];
      const value =
        index === items.length - 1
          ? remainingValue
          : Math.round(remainingValue * ratio);

      const count =
        index === items.length - 1
          ? remainingCount
          : Math.round(remainingCount * ratio);

      remainingValue -= value;
      remainingCount -= count;

      return {
        name: item,
        value,
        count,
        fill: colors[index],
      };
    });
  };

  const generateExpensesData = (totalExpenses) => {
    const baseAmount = totalExpenses * 0.3;
    return {
      Salaries: baseAmount,
      OSJ: baseAmount * 0.8,
      "Electricity Charges": baseAmount * 0.6,
      "Other Expenses": baseAmount * 0.4,
      "Branch Maintenance": baseAmount * 0.3,
      "Transportation Charges": baseAmount * 0.2,
    };
  };


  useEffect(() => {
    axios.get("http://localhost:5001/api/job-card/count")
      .then((response) => {
        setNumericalData(response.data.data);
        console.log("kjhg",response.data.data);  
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []);
  // Replace generateDataForPeriod with these two functions
  const generateRevenueValues = (period) => {
    const { from, to } = getDateRange(period);
    fetchJobCardData(from, to);

    // Only generate new values if not using initial values
    if (period === "YESTERDAY" && !revenueValues.hasRandomized) {
      setRevenueValues({
        ...INITIAL_PERIOD_VALUES.YESTERDAY,
        hasRandomized: true,
      });
    } else {
      const newRevenueValues = generatePeriodData(period);
      setRevenueValues(newRevenueValues);
    }

    // If there's a selected overview, update the details data
    if (selectedOverview) {
      const newDetailsData = generateDetailsData(
        period,
        selectedOverview,
        newRevenueValues[selectedOverview],
        newRevenueValues.counts[selectedOverview]
      );
      setDetailsData(newDetailsData);
    }

    // Generate finance data
    generateValuesForPeriod(period);
  };

  const generateValuesForPeriod = (period) => {
    const multipliers = {
      YESTERDAY: 1,
      WEEKLY: 10,
      MONTHLY: 100,
      YTD: 1000,
    };

    const baseValue = 200000 * multipliers[period];
    const newPeriodValues = {
      period,
      cash: baseValue,
      upi: Math.round(baseValue * 0.8),
      expenses: Math.round(baseValue * 1.6 * 0.8),
    };

    setPeriodValues(newPeriodValues);
    setExpensesData(generateExpensesData(newPeriodValues.expenses));
  };

  // Update useEffect
  useEffect(() => {
    if (!revenueValues) {
      const initialRevenue = generatePeriodData("YESTERDAY");
      setRevenueValues(initialRevenue);
      generateValuesForPeriod("YESTERDAY");
      setDetailsData(
        generateDetailsData(
          "YESTERDAY",
          "sales",
          initialRevenue.sales,
          initialRevenue.counts.sales
        )
      );
    }
  }, []);

  // Update useEffect to handle period changes
  useEffect(() => {
    generateRevenueValues(selectedPeriod);
  }, [selectedPeriod]); // Changed dependency from initial load to selectedPeriod

  

  // Update handleCardSelect to only update detailsData
  const handleCardSelect = (cardId) => {
    setSelectedOverview(cardId);
    const newDetailsData = generateDetailsData(
      selectedPeriod,
      cardId,
      revenueValues[cardId],
      revenueValues.counts[cardId]
    );
    setDetailsData(newDetailsData);
    setIsDialogOpen(true); // Open dialog when card is clicked
  };

  // Update loading check
  if (!revenueValues) return null;

  const locationNameWithoutCountry = decodeURIComponent(locationName).replace(
    ", India",
    ""
  );
  const locationNames =
    subLocationsData.find(
      (loc) => loc.locationName === locationNameWithoutCountry
    )?.locations || [];

  return (
    <div className="lg:px-4 lg:py-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold">
            {decodeURIComponent(locationName)}
          </h2>
        </div>
        <Select
          value={revenueValues.period}
          onValueChange={generateRevenueValues} // Changed to directly use generateRevenueValues
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PERIODS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-background">
          <div className="container mx-auto flex">
            <TabsTrigger
              value="revenue"
              className="flex-1 data-[state=active]:bg-primary/5"
            >
              Revenue
            </TabsTrigger>
            <TabsTrigger
              value="finances"
              className="flex-1 data-[state=active]:bg-primary/5"
            >
              Finances
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="flex-1 data-[state=active]:bg-primary/5"
            >
              Inventory
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-4">
              <SelectionGrid
                onCardSelect={handleCardSelect}
                selectedCard="sales"
                periodValues={revenueValues} // Update this prop
                />
              <p className="text-sm text-red-500 font-semibold flex gap-2">
                <span>
                  <Star className="text-black fill-yellow-500 border-black" />
                </span>
                Click on the card to see more sales insights.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <SelectionGrid
                onCardSelect={handleCardSelect}
                selectedCard="services"
                periodValues={revenueValues} // Update this prop
                numericalData={numericalData}
              />
              <p className="text-sm text-red-500 font-semibold flex gap-2">
                <span>
                  <Star className="text-black fill-yellow-500 border-black" />
                </span>
                Click on the card to see more services insights.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <SelectionGrid
                onCardSelect={handleCardSelect}
                selectedCard="others"
                periodValues={revenueValues} // Update this prop
                showLocationAnalysis={false}
              />
              <p className="text-sm text-red-500 font-semibold flex gap-2">
                <span>
                  <Star className="text-black fill-yellow-500 border-black" />
                </span>
                Click on the card to see more other insights.
              </p>
            </div>
          </div>

          {/* Replace your existing container with something like this: */}
          <div className="grid grid-cols-3 gap-6 mt-6 h-auto p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
            <DeliveryCard />
            <BestSellingProductsTable />
          </div>
        </TabsContent>

        <TabsContent value="finances" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FinanceSummary periodValues={periodValues} />
            <VerifiedUnverifiedChart cashCollections={periodValues.cash} />
            <ExpensesVsCollectionsChart periodValues={periodValues} />
          </div>

          <div className="bg-white p-4 rounded-lg mt-4 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">
              Expenses Distribution
            </h3>
            <ExpensesDivisionChart expensesData={expensesData} />
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InventoryOverviewCard title="Low Stock" />
            <InventoryOverviewCard title="Fast Moving" />
            <InventoryOverviewCard title="Dead Stock" />
          </div>
        </TabsContent>
      </Tabs>

      {/* Keep existing dialog component */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* ...existing dialog content... */}
      </Dialog>
    </div>
  );
};

export default LocationPage;
