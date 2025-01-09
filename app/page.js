"use client";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Add to existing imports

import Sidebar from "@/components/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgeingAnalysisHeatmap from "./_components/AgeingAnalysis";
import ExpensesVsCollectionsChart from "./_components/ExpensesVsCollectionsChart";
import FinanceSummary from "./_components/FinanceSummaryCard";
import SelectionGrid from "./_components/SelectionGrid";
import SubOwnOverviewChart from "./_components/SubOwnOverviewChart";
import VerifiedUnverifiedChart from "./_components/VerifiedUnverifiedChart";
import { ExpensesDivisionChart } from "./_components/ExpensesDivisionChart";
import ServicesDetailsChart from "./_components/SalesAndServicesDetailsChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend
);

export default function Home() {
  const [brands, setBrands] = useState(brandsData);
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedOverview, setSelectedOverview] = useState(null);
  const [periodValues, setPeriodValues] = useState({
    period: "WEEKLY",
    cash: Math.random() * 1000000,
    upi: Math.random() * 1000000,
    expenses: Math.random() * 1000000,
  });

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
    // Base values in respective digits
    const baseValues = {
      YESTERDAY: Math.random() * (99999 - 10000) + 10000, // 5 digits (10k-99k)
      WEEKLY: Math.random() * (999999 - 100000) + 100000, // 6 digits (100k-999k)
      MONTHLY: Math.random() * (999999 - 500000) + 500000, // 6 digits (500k-999k)
      YTD: Math.random() * (9999999 - 1000000) + 1000000, // 7 digits (1M-9.9M)
    };

    const baseValue = baseValues[period] || baseValues["WEEKLY"];

    // Ensure UPI is slightly less than cash (80-90% of cash)
    const upiPercentage = Math.random() * (0.9 - 0.8) + 0.8;

    // Ensure expenses are 70-85% of total collections
    const expensePercentage = Math.random() * (0.85 - 0.7) + 0.7;

    const cash = baseValue;
    const upi = baseValue * upiPercentage;
    const expenses = (cash + upi) * expensePercentage;

    setPeriodValues({
      period,
      cash,
      upi,
      expenses,
    });
  };

  return (
    <div className="flex">
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
            {/* Grid of analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="h-[432px]"> {/* Fixed height container */}
                <SelectionGrid
                  onCardSelect={(cardId) => setSelectedOverview(cardId)}
                />
              </div>
              <div className="h-[432px]"> {/* Fixed height container */}
                <SubOwnOverviewChart selectedCard={selectedOverview} />
              </div>
              <div className="h-[432px]"> {/* Fixed height container */}
                <ServicesDetailsChart selectedCard={selectedOverview} />
              </div>
            </div>


            {/* Sales Performance Chart */}
            <h1 className="text-xl font-bold my-6">
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
            </h1>

            {/*Sales Performance chart based on timeline */}
            <ResponsiveContainer width="100%" height={400}>
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
                  stroke="#8fcbff"
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
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="finances" className="p-4 md:p-6 lg:p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/*Finance Summary card */}
              <FinanceSummary
                periodValues={periodValues}
                onPeriodChange={generateValuesForPeriod}
              />
              {/* Doughnut chart for verified vs unverified cash collections */}
              <VerifiedUnverifiedChart cashCollections={periodValues.cash} />
              {/*Expenses vs Collections Bar Chart */}
              <ExpensesVsCollectionsChart
                periodValues={periodValues}
                onPeriodChange={generateValuesForPeriod}
              />
            </div>
            {/* Ageing Analysis Heatmap */}
            <AgeingAnalysisHeatmap />

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
          </TabsContent>
        </Tabs>

        {selectedBrand && <BrandSheet brand={selectedBrand} />}
      </div>
    </div>
  );
}
