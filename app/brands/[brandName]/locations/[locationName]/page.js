"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { subLocationsData } from "@/lib/constants";
import LocationCard from "./_components/LocationCard";
import ServiceCard from "./_components/ServiceCard";
import BestSellingProductsTable from "./_components/BestSellingProductsTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SubLocationsTable from "./_components/SubLocationsTable";
import OverviewCard from "@/components/OverviewCard";
import { PickAName } from "@/lib/utils";

const generateRandomLocationData = (locationName) => {
  const serviceDivisions = ["Bike", "Auto", "Commercial", "Electric"]
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  
  return {
    locationName: decodeURIComponent(locationName),
    serviceDivisions,
    salesDetails: {
      totalSales: `₹${(Math.random() * 5 + 1).toFixed(1)}L`,
      noOfSales: Math.floor(Math.random() * 50000) + 10000,
      topProduct: ["Pulsar 150", "Nexon", "Bonneville", "Activa"][Math.floor(Math.random() * 4)],
      growthRate: `${(Math.random() * 20 + 5).toFixed(1)}% YoY`,
      quarterWise: Array(4).fill().map((_, i) => ({
        quarter: `Q${i + 1}`,
        sales: `₹${(Math.random() * 40 + 20).toFixed()}K`,
        noOfSales: Math.floor(Math.random() * 10000) + 5000
      }))
    },
    storeVisits: Math.floor(Math.random() * 500) + 200,
    inventoryReport: {
      totalStock: Math.floor(Math.random() * 3000) + 1000,
      damagedUnits: Math.floor(Math.random() * 100),
      lastAudit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      warehouses: ["Mumbai", "Delhi", "Bangalore"].sort(() => Math.random() - 0.5).slice(0, 2)
    },
    operationalExpenses: {
      annual: `₹${(Math.random() * 2 + 1).toFixed(1)}L`,
      marketing: `₹${(Math.random() * 50 + 20).toFixed()}K`,
      RnD: `₹${(Math.random() * 70 + 30).toFixed()}K`,
      logistics: `₹${(Math.random() * 80 + 40).toFixed()}K`
    },
    targetsAndAchieved: {
      annualTarget: `₹${(Math.random() * 3 + 2).toFixed(1)}L`,
      achieved: `₹${(Math.random() * 2 + 1).toFixed(1)}L`,
      quarterWise: Array(4).fill().map((_, i) => ({
        quarter: `Q${i + 1}`,
        target: `₹${(Math.random() * 50 + 30).toFixed()}K`,
        achieved: `₹${(Math.random() * 40 + 20).toFixed()}K`
      })),
      monthWise: Array(12).fill().map((_, i) => ({
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        target: `₹${(Math.random() * 20 + 10).toFixed()}K`,
        achieved: `₹${(Math.random() * 15 + 8).toFixed()}K`
      }))
    },
    totalExpenses: {
      monthly: Array(12).fill().map((_, i) => ({
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        expenses: `₹${(Math.random() * 15 + 5).toFixed()}K`
      })),
      quarterly: Array(4).fill().map((_, i) => ({
        quarter: `Q${i + 1}`,
        expenses: `₹${(Math.random() * 45 + 15).toFixed()}K`
      }))
    },
    bestPerformers: {
      salesPerson: {
        name: `${['John', 'Jane', 'Mike', 'Sarah'][Math.floor(Math.random() * 4)]} ${['Smith', 'Doe', 'Johnson', 'Williams'][Math.floor(Math.random() * 4)]}`,
        sales: Math.floor(Math.random() * 4000) + 1000,
        target: Math.floor(Math.random() * 5000) + 5000,
        performance: Math.floor(Math.random() * 30) + 70
      },
      products: Array(5).fill().map(() => ({
        name: `Product ${Math.floor(Math.random() * 100)}`,
        sales: Math.floor(Math.random() * 1000) + 500,
        revenue: Math.floor(Math.random() * 1000000) + 500000
      }))
    },
    serviceMetrics: {
      completed: Math.floor(Math.random() * 1000) + 500,
      pending: Math.floor(Math.random() * 100) + 20,
      satisfaction: Math.floor(Math.random() * 20) + 80,
      revenue: `₹${(Math.random() * 1.5 + 0.5).toFixed(1)}L`
    },
    headOfBrand: PickAName(),
  };
};

const LocationPage = () => {
  const { brandName, locationName } = useParams();
  const [currentTab, setCurrentTab] = useState(null);
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    // Pass locationName to the generator function
    setLocationData(generateRandomLocationData(locationName));
  }, [locationName]); // Add locationName as dependency

  if (!locationData) return null;

  const locationNameWithoutCountry = decodeURIComponent(locationName).replace(", India", "");
  const subLocationNames = subLocationsData.find(
    (loc) => loc.locationName === locationNameWithoutCountry
  )?.subLocations || [];

  return (
    <div className="p-4 md:p-6 lg:px-4 lg:py-6">
      <Tabs defaultValue={locationData.serviceDivisions[0]}>
        <TabsList className="mb-2">
          {locationData.serviceDivisions.map((division, index) => (
            <TabsTrigger
              key={index}
              value={division}
              onClick={() => setCurrentTab(division)}
            >
              {division}
            </TabsTrigger>
          ))}
        </TabsList>
        {locationData.serviceDivisions.map((division, index) => {
          const otherTabs = locationData.serviceDivisions.filter(
            (tab) => tab !== division
          );
          return (
            <TabsContent key={index} value={division}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <LocationCard location={locationData} />
                <div className="lg:col-span-2 pb-4">
                  <SubLocationsTable
                    subLocationNames={subLocationNames}
                    otherTabs={otherTabs}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-4">
                <div className="flex flex-col gap-4">
                  <OverviewCard title="Sales" />
                </div>
                <ServiceCard />
                <BestSellingProductsTable />
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default LocationPage;
