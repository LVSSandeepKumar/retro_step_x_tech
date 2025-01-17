"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { subLocationsData } from "@/lib/constants";
import ServiceCard from "@/app/brands/[brandName]/locations/[locationName]/_components/ServiceCard";
import BestSellingProductsTable from "@/app/brands/[brandName]/locations/[locationName]/_components/BestSellingProductsTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OverviewCard from "@/components/OverviewCard";
import BestSalesPersonCard from "../../_components/BestSalesPersonCard";
import InventoryOverviewCard from "./_components/InventoryOverviewCard";
import InsuranceOverviewCard from "./_components/InsuranceOverviewCard";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";
import Link from "next/link";

const generateRandomSubLocationData = () => {
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

const SubLocationPage = () => {
  const { brandName, locationName, sublocationname } = useParams();
  const [subLocationData, setSubLocationData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [randomData, setRandomData] = useState(null);
  const router = useRouter();

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

  useEffect(() => {
    // Generate random data on mount
    setSubLocationData(generateRandomSubLocationData());
    setRandomData({
      visits: Math.floor(Math.random() * 50) + 50,
      orders: Math.floor(Math.random() * 40) + 30,
      conversionRate: Math.floor(Math.random() * 30) + 40,
    });
  }, []);

  if (!subLocationData) return null;

  const locationNameWithoutCountry = decodeURIComponent(locationName).replace(
    ", India",
    ""
  );
  const subLocationNames =
    subLocationsData.find(
      (loc) => loc.locationName === locationNameWithoutCountry
    )?.subLocations || [];

  return (
    <div className="p-4 md:p-6 lg:px-4 lg:py-6">
      <Tabs defaultValue={subLocationData.serviceDivisions[0]} >
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="flex justify-between items-center">
          <TabsList className="mb-2">
            {subLocationData.serviceDivisions.map((division, index) => (
              <TabsTrigger key={index} value={division}>
                {division}
              </TabsTrigger>
            ))}
          </TabsList>

          {/*Create sale button */}
          <Button asChild>
            <Link
              href={`/brands/${brandName}/locations/${locationName}/sublocations/${sublocationname}/create_sale`}
              className="flex items-center gap-2"
            >
              Create Sale
              <Plus className="size-4 ml-2" />
            </Link>
          </Button>

          {/*Create Sale dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild></DialogTrigger>
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
                    {subLocationData.serviceDivisions.map((division, index) => (
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
        {subLocationData.serviceDivisions.map((division, index) => (
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
