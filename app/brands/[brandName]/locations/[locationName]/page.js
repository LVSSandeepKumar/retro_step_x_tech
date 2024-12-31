"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mockLocations, subLocationsData } from "@/lib/constants";
import LocationCard from "./_components/LocationCard";
import ServiceCard from "./_components/ServiceCard";
import BestSellingProductsTable from "./_components/BestSellingProductsTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SubLocationsTable from "./_components/SubLocationsTable";
import OverviewCard from "@/components/OverviewCard";

const LocationPage = () => {
  const { brandName, locationName } = useParams();
  const [currentTab, setCurrentTab] = useState(null);
  const brandData = mockLocations.find(
    (brand) => brand.brandName === brandName
  );
  const decodedLocationName = decodeURIComponent(locationName);
  const locationData = brandData?.locations.find(
    (location) => location.locationName === decodedLocationName
  );

  if (!locationData) {
    return <p>No data available for this location.</p>;
  }

  const locationNameWithoutCountry = decodedLocationName.replace(", India", "");
  const subLocationNames =
    subLocationsData.find(
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
