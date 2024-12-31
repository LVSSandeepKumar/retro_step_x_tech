"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mockLocations, subLocationsData } from "@/lib/constants";
import ServiceCard from "@/app/brands/[brandName]/locations/[locationName]/_components/ServiceCard";
import BestSellingProductsTable from "@/app/brands/[brandName]/locations/[locationName]/_components/BestSellingProductsTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OverviewCard from "@/components/OverviewCard";
import BestSalesPersonCard from "../../_components/BestSalesPersonCard";
import InventoryOverviewCard from "./_components/InventoryOverviewCard";
import InsuranceOverviewCard from "./_components/InsuranceOverviewCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";

const SubLocationPage = () => {
  const { brandName, locationName } = useParams();
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

  const [randomData, setRandomData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const visits = generateRandomNumber(50, 100);
    const orders = generateRandomNumber(30, 70);
    const conversionRate = Math.floor((orders / visits) * 100);
    const bestSalesPerson = {
      name: "John Doe",
      sales: generateRandomNumber(1000, 5000),
      target: generateRandomNumber(5000, 10000),
    };

    setRandomData({ visits, orders, conversionRate, bestSalesPerson });
  }, []);

  const inputFields = [
    { label: "Product Type", type: "text", name: "productType" },
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

  return (
    <div className="p-4 md:p-6 lg:px-4 lg:py-6">
      <Tabs defaultValue={locationData.serviceDivisions[0]}>
        <div className="flex justify-between items-center">
          <TabsList className="mb-2">
            {locationData.serviceDivisions.map((division, index) => (
              <TabsTrigger key={index} value={division}>
                {division}
              </TabsTrigger>
            ))}
          </TabsList>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                Create Sale
                <Plus className="size-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Sale</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new sale.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {inputFields.map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <Input
                      type={field.type}
                      name={field.name}
                      className="mt-1 block w-full"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Service Divisions
                  </label>
                  <div className="mt-2 space-y-2">
                    {locationData.serviceDivisions.map((division, index) => (
                      <div key={index} className="flex items-center">
                        <Checkbox id={`division-${index}`} />
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
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {locationData.serviceDivisions.map((division, index) => (
          <TabsContent key={index} value={division}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
              <InventoryOverviewCard title="Low Stock" />
              <InventoryOverviewCard title="Fast Moving" />
              <InventoryOverviewCard title="Dead Stock" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col-reverse gap-4 justify-center">
                {randomData && (
                  <>
                    <OverviewCard title="Sales" />
                    <BestSalesPersonCard />
                  </>
                )}
              </div>
              <ServiceCard />
              <BestSellingProductsTable />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <OverviewCard title="Accessories" />
              <OverviewCard title="Apparels" />
              <InsuranceOverviewCard />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SubLocationPage;
