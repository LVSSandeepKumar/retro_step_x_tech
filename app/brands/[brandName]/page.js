"use client";
import { useState, useEffect } from "react";
import { brandsData, mockLocations } from "@/lib/constants";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import StoreVisitsChart from "./_components/StoreVisitsChart";
import SalesAndExpensesCards from "./_components/SalesAndExpensesCard";
import LocationDetailsTable from "./_components/LocationDetailsTable";
import AnnouncementDashboard from "@/app/_components/AnnouncementDashboard";
import PendingAlertsCard from "./_components/PendingAlertsCard";

export default function BrandPage() {
  const { brandName } = useParams();
  const router = useRouter();
  const brandData = mockLocations.find(
    (brand) => brand.brandName === brandName
  );

  const BrandName = brandsData.find((brand) => brand.brandName === brandName);
  const brandCEO = BrandName.headOfBrand;

  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    locationName: "",
    serviceDivisions: [],
    salesDetails: { totalSales: "" },
    storeVisits: "",
    inventoryReport: { totalStock: "" },
    operationalExpenses: { annual: "" },
    targetsAndAchieved: { annualTarget: "", achieved: "" },
    headOfBrand: "",
  });

  useEffect(() => {
    if (brandData) {
      setLocations(brandData.locations);
    }
  }, [brandData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewLocation((prev) => {
      const keys = name.split(".");
      if (keys.length > 1) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value,
          },
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = () => {
    setLocations((prev) => [...prev, newLocation]);
    setNewLocation({
      locationName: "",
      serviceDivisions: [],
      salesDetails: { totalSales: "" },
      storeVisits: "",
      inventoryReport: { totalStock: "" },
      operationalExpenses: { annual: "" },
      targetsAndAchieved: { annualTarget: "", achieved: "" },
      headOfBrand: "",
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">
            {brandName} CEO : {brandCEO}
          </h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add New Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Location</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new location.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {[
                {
                  name: "locationName",
                  label: "Location Name",
                  value: newLocation.locationName,
                  onChange: handleInputChange,
                },
                {
                  name: "serviceDivisions",
                  label: "Service Divisions",
                  value: newLocation.serviceDivisions,
                  onChange: (e) =>
                    setNewLocation((prev) => ({
                      ...prev,
                      serviceDivisions: e.target.value
                        .split(",")
                        .map((s) => s.trim()),
                    })),
                },
                {
                  name: "salesDetails.totalSales",
                  label: "Total Sales",
                  value: newLocation.salesDetails.totalSales,
                  onChange: handleInputChange,
                },
                {
                  name: "storeVisits",
                  label: "Store Visits",
                  value: newLocation.storeVisits,
                  onChange: handleInputChange,
                },
                {
                  name: "inventoryReport.totalStock",
                  label: "Total Stock",
                  value: newLocation.inventoryReport.totalStock,
                  onChange: handleInputChange,
                },
                {
                  name: "operationalExpenses.annual",
                  label: "Annual Expenses",
                  value: newLocation.operationalExpenses.annual,
                  onChange: handleInputChange,
                },
                {
                  name: "targetsAndAchieved.annualTarget",
                  label: "Annual Target",
                  value: newLocation.targetsAndAchieved.annualTarget,
                  onChange: handleInputChange,
                },
                {
                  name: "targetsAndAchieved.achieved",
                  label: "Achieved",
                  value: newLocation.targetsAndAchieved.achieved,
                  onChange: handleInputChange,
                },
                {
                  name: "headOfBrand",
                  label: "Head of Brand",
                  value: newLocation.headOfBrand,
                  onChange: handleInputChange,
                },
              ].map((input) => (
                <Input
                  key={input.name}
                  name={input.name}
                  placeholder={input.label}
                  value={input.value}
                  onChange={input.onChange}
                />
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleSubmit}>Submit</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col items-start gap-4">
        <h1 className="text-xl font-bold">{brandName} Overall Analytics:</h1>
        <SalesAndExpensesCards />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StoreVisitsChart locations={locations} />
        <AnnouncementDashboard className="h-full" />
        <PendingAlertsCard />
      </div>

      <div>
        <LocationDetailsTable brandName={brandName} />
      </div>
    </div>
  );
}
