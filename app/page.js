"use client";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { brandsData, mockLocations } from "@/lib/constants";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend as ChartLegend,
  Tooltip as ChartTooltip,
  LinearScale,
  Title,
} from "chart.js";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Add to existing imports

import Sidebar from "@/components/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgeingAnalysisHeatmap from "./_components/AgeingAnalysis";
import ChatBot from "./_components/ChatBot";
import { ExpensesDivisionChart } from "./_components/ExpensesDivisionChart";
import ExpensesVsCollectionsChart from "./_components/ExpensesVsCollectionsChart";
import FinanceSummary from "./_components/FinanceSummaryCard";
import LocationCashAnalysisDetails from "./_components/LocationCashAnalysisDetails";
import LocationRevenueDetails from "./_components/LocationRevenueDetails";
import LocationStockAnalysisDetails from "./_components/LocationStockAnalysisDetails";
import SalesAndServicesDetailsChart from "./_components/SalesAndServicesDetailsChart";
import SelectionGrid from "./_components/SelectionGrid";
import VerifiedUnverifiedChart from "./_components/VerifiedUnverifiedChart";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react"; // Add this import

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend
);

// Constants for data ranges
const AMOUNT_RANGES = {
  YESTERDAY: { min: 10000, max: 100000 },
  WEEKLY: { min: 100001, max: 1000000 },
  MONTHLY: { min: 1000001, max: 10000000 },
  YTD: { min: 10000001, max: 100000000 }
};

const COUNT_RANGES = {
  YESTERDAY: { min: 1, max: 10 },
  WEEKLY: { min: 11, max: 100 },
  MONTHLY: { min: 101, max: 1000 },
  YTD: { min: 10001, max: 20000 }
};

// Single random generator function
const generateRandomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Data generation function
const generatePeriodData = (period) => {
  const amountRange = AMOUNT_RANGES[period];
  const countRange = COUNT_RANGES[period];
  
  const baseSales = generateRandomInRange(amountRange.min, amountRange.max);
  const baseCount = generateRandomInRange(countRange.min, countRange.max);
  
  return {
    period,
    sales: baseSales,
    services: Math.round(baseSales * 0.7),
    others: Math.round(baseSales * 0.4),
    counts: {
      sales: baseCount,
      services: Math.round(baseCount * 0.7),
      others: Math.round(baseCount * 0.4)
    }
  };
};

export default function Home() {
  const [brands, setBrands] = useState(brandsData);
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedOverview, setSelectedOverview] = useState(null);
  const [periodValues, setPeriodValues] = useState({
    period: "YESTERDAY",
    cash: 200000,     // Fixed initial value
    upi: 160000,      // 80% of cash
    expenses: 288000  // 80% of total collections
  });
  // Update initial state to null to trigger useEffect
  const [revenueValues, setRevenueValues] = useState(null);
  const [openCash, setOpenCash] = useState(false);
  const [openAgeing, setOpenAgeing] = useState(false);

  const PERIODS = {
    YESTERDAY: "Yesterday",
    WEEKLY: "Weekly",
    MONTHLY: "This Month",
    YTD: "Year to Date",
  };

  const router = useRouter();

  const handleNavigation = (brandName) => {
    router.push(`/brands/${brandName}`);
  };

  const handleCardClick = (brand) => {
    setSelectedBrand(brand);
    setIsSheetOpen(true);
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const halfYears = ["H1", "H2"];
  const years = ["2021", "2022", "2023"];

  const getData = () => {
    switch (timePeriod) {
      case "quarterly":
        return quarters.map((quarter) => {
          const data = { quarter };
          let totalSales = 0;
          brands.forEach((brand) => {
            const quarterData = brand.salesDetails.quarterWise?.find(
              (q) => q.quarter === quarter
            );
            const salesValue = quarterData
              ? parseFloat(quarterData.sales.replace(/[^0-9.-]+/g, ""))
              : 0;
            data[brand.brandName] = salesValue;
            totalSales += salesValue;
          });
          data.Total = totalSales;
          return data;
        });
      case "half-yearly":
        return halfYears.map((halfYear) => {
          const data = { halfYear };
          let totalSales = 0;
          brands.forEach((brand) => {
            const halfYearData = brand.salesDetails.halfYearly?.find(
              (h) => h.halfYear === halfYear
            );
            const salesValue = halfYearData
              ? parseFloat(halfYearData.sales.replace(/[^0-9.-]+/g, ""))
              : 0;
            data[brand.brandName] = salesValue;
            totalSales += salesValue;
          });
          data.Total = totalSales;
          return data;
        });
      case "yearly":
        return years.map((year) => {
          const data = { year };
          let totalSales = 0;
          brands.forEach((brand) => {
            const yearData = brand.salesDetails.yearly?.find(
              (y) => y.year === year
            );
            const salesValue = yearData
              ? parseFloat(yearData.sales.replace(/[^0-9.-]+/g, ""))
              : 0;
            data[brand.brandName] = salesValue;
            totalSales += salesValue;
          });
          data.Total = totalSales;
          return data;
        });
      default:
        return months.map((month) => {
          const data = { month };
          let totalSales = 0;
          brands.forEach((brand) => {
            const monthData = brand.salesDetails.monthWise?.find(
              (m) => m.month === month
            );
            const salesValue = monthData
              ? parseFloat(monthData.sales.replace(/[^0-9.-]+/g, ""))
              : 0;
            data[brand.brandName] = salesValue;
            totalSales += salesValue;
          });
          data.Total = totalSales;
          return data;
        });
    }
  };

  const salesData = getData();

  const barChartData = {
    labels: brands.map((brand) => brand.brandName),
    datasets: [
      {
        label: "Achieved",
        data: brands.map((brand) =>
          parseFloat(
            brand.targetsAndAchieved.achieved.replace(/[^0-9.-]+/g, "")
          )
        ),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Target",
        data: brands.map((brand) =>
          parseFloat(
            brand.targetsAndAchieved.annualTarget.replace(/[^0-9.-]+/g, "")
          )
        ),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const lineColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

  const BrandSheet = ({ brand }) => {
    const brandLocations =
      mockLocations.find((loc) => loc.brandName === brand?.brandName)
        ?.locations || [];

    const handleLocationClick = (brandName, locationName, e) => {
      e.stopPropagation(); // Prevent sheet from closing
      router.push(`/brands/${brandName}/locations/${locationName}`);
    };

    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{brand?.brandName}</SheetTitle>
            <div className="space-y-4 mt-4">
              <div className="border-b pb-2">
                <h3 className="font-medium mb-2">Sales Details</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>Total Sales: {brand?.salesDetails.totalSales}</div>
                  <div>Top Product: {brand?.salesDetails.topProduct}</div>
                  <div>Growth Rate: {brand?.salesDetails.growthRate}</div>
                </div>
              </div>

              <div className="border-b pb-2">
                <h3 className="font-medium mb-2">
                  Locations ({brandLocations.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {brandLocations.map((location, index) => (
                    <div
                      key={index}
                      className="text-sm bg-muted p-2 rounded cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={(e) =>
                        handleLocationClick(
                          brand.brandName,
                          location.locationName,
                          e
                        )
                      }
                    >
                      <div className="font-medium text-primary hover:underline">
                        {location.locationName}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>
                          Total Sales: {location.salesDetails.totalSales}
                        </div>
                        <div>
                          Total Stock: {location.inventoryReport.totalStock}
                        </div>
                        <div>
                          Annual Expenses: {location.operationalExpenses.annual}
                        </div>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {location.serviceDivisions.map((div, i) => (
                            <span
                              key={i}
                              className="bg-primary/10 px-1 rounded"
                            >
                              {div}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b pb-2">
                <h3 className="font-medium mb-2">Performance</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>
                    Annual Target: {brand?.targetsAndAchieved.annualTarget}
                  </div>
                  <div>Achieved: {brand?.targetsAndAchieved.achieved}</div>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => router.push(`/brands/${brand?.brandName}`)}
              >
                View Full Details
              </Button>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  };

  const handleBrandCardClick = (brand) => {
    setSelectedBrand(brand);
    setIsSheetOpen(true);
  };

  const handleBrandTitleClick = (brandName) => {
    router.push(`/brands/${brandName}`);
  };

  const generateValuesForPeriod = (period) => {
    const multipliers = {
      YESTERDAY: 10,
      WEEKLY: 100,
      MONTHLY: 1000,
      YTD: 10000
    };
    
    const baseValue = 200000 * multipliers[period];
    setPeriodValues({
      period,
      cash: baseValue,
      upi: Math.round(baseValue * 0.8),
      expenses: Math.round(baseValue * 1.6 * 0.8)
    });
  };

  // Add useEffect for initial data generation
  useEffect(() => {
    if (!revenueValues) {
      setRevenueValues(generatePeriodData("YESTERDAY"));
    }
  }, []);

  // Simplified generateRevenueValues function
  const generateRevenueValues = (period) => {
    setRevenueValues(generatePeriodData(period));
  };

  const handleCardSelect = (cardId) => {
    setSelectedOverview(cardId);
  };

  // Add loading state handling in the return
  if (!revenueValues) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex bg-slate-100">
      <Sidebar />
      <div className="flex-1">
        <Header heading={"Retro"} />

        <Tabs defaultValue="revenue" className="w-full p-4">
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

          <TabsContent value="revenue" className="p-4 md:p-6 lg:p-8 space-y-4">
            <div className="flex justify-end mb-4">
              <Select
                value={revenueValues.period}
                onValueChange={generateRevenueValues}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-4">
                <SelectionGrid
                  onCardSelect={handleCardSelect}
                  selectedCard="sales"
                  periodValues={revenueValues}
                />
              </div>
              <div className="flex flex-col gap-4">
                <SelectionGrid
                  onCardSelect={handleCardSelect}
                  selectedCard="services"
                  periodValues={revenueValues}
                />
              </div>
              <div className="flex flex-col gap-4">
                <SelectionGrid
                  onCardSelect={handleCardSelect}
                  selectedCard="others"
                  periodValues={revenueValues} // Fix: Pass the entire revenueValues object
                />
              </div>
            </div>

            {/*Dynamic Data rendering based on selectedOverview */}
            <div className="pt-4 flex flex-col gap-4">
              {selectedOverview && (
                <>
                  <SalesAndServicesDetailsChart
                    selectedCard={selectedOverview}
                    period={revenueValues.period}
                  />
                  {selectedOverview === "sales" && (
                    <LocationRevenueDetails period={revenueValues.period} type="sales"/>
                  )}
                  {selectedOverview === "services" && (
                    <LocationRevenueDetails period={revenueValues.period} type="services"/>
                  )}
                  {selectedOverview === "others" && (
                    <LocationRevenueDetails period={revenueValues.period} type="others"/>
                  )}
                </>
              )}
            </div>

            {/* Sales Performance Chart */}
            {/* <h1 className="text-xl font-bold my-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="cursor-pointer hover:underline">
                    {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setTimePeriod("monthly")}>
                    Monthly
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimePeriod("quarterly")}>
                    Quarterly
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTimePeriod("half-yearly")}
                  >
                    Half-Yearly
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimePeriod("yearly")}>
                    Yearly
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="ml-2">Brand Sales Performance</span>
            </h1> */}

            {/*Sales Performance chart based on timeline */}
            {/* <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis
                  dataKey={
                    timePeriod === "monthly"
                      ? "month"
                      : timePeriod === "quarterly"
                      ? "quarter"
                      : timePeriod === "half-yearly"
                      ? "halfYear"
                      : "year"
                  }
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Total"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={false}
                />
                {brands.map((brand, index) => (
                  <Line
                    key={brand.brandName}
                    type="monotone"
                    dataKey={brand.brandName}
                    stroke={lineColors[index % lineColors.length]}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer> */}
          </TabsContent>

          <TabsContent value="finances" className="p-4 md:p-6 lg:p-8 space-y-4">
            <div className="flex justify-end mb-4">
              <Select
                value={periodValues.period}
                onValueChange={(newPeriod) =>
                  generateValuesForPeriod(newPeriod)
                }
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FinanceSummary periodValues={periodValues} />
              <VerifiedUnverifiedChart cashCollections={periodValues.cash} />
              <ExpensesVsCollectionsChart periodValues={periodValues} />
            </div>

            <Collapsible
              open={openCash}
              onOpenChange={setOpenCash}
              className="bg-white rounded-lg shadow-lg"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-gray-50">
                <h2 className="text-lg font-bold text-gray-700">Location-wise Closing Balance Analysis</h2>
                {openCash ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <LocationCashAnalysisDetails />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={openAgeing}
              onOpenChange={setOpenAgeing}
              className="bg-white rounded-lg shadow-lg"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-gray-50">
                <h2 className="text-lg font-bold text-gray-700">Claims Ageing Analysis</h2>
                {openAgeing ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <AgeingAnalysisHeatmap />
              </CollapsibleContent>
            </Collapsible>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-2">
                <ExpensesDivisionChart />
              </div>
            </div>

            {/* <h1 className="text-xl font-bold my-6">Financial Overview</h1>
            <OverviewTable /> */}
            {/* Achieved vs Targets Chart */}
            {/* <h1 className="text-xl font-bold my-6">Achieved vs Targets</h1>
            <ResponsiveContainer width="100%" height={400}>
              <Bar
                data={barChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </ResponsiveContainer> */}
          </TabsContent>

          <TabsContent
            value="inventory"
            className="p-4 md:p-6 lg:p-8 space-y-4"
          >
            <h1 className="text-xl font-bold">Inventory Management</h1>
            {/* Add inventory specific components here */}
            <LocationStockAnalysisDetails />
          </TabsContent>
        </Tabs>

        {selectedBrand && <BrandSheet brand={selectedBrand} />}
        <ChatBot 
          revenueData={revenueValues}
          financeData={periodValues}
          selectedOverview={selectedOverview}
        />
      </div>
    </div>
  );
}
