"use client";
import { useState } from "react";
import { mockLocations } from "@/lib/constants";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

export default function BrandPage() {
  const { brandName } = useParams();
  const router = useRouter();
  const brandData = mockLocations.find(
    (brand) => brand.brandName === brandName
  );

  if (!brandData) {
    return <div>Brand not found</div>;
  }

  const [locations, setLocations] = useState(brandData.locations);
  const [newLocation, setNewLocation] = useState({
    locationName: "",
    serviceDivisions: [],
    salesDetails: { totalSales: "" },
    inventoryReport: { totalStock: "" },
    operationalExpenses: { annual: "" },
    targetsAndAchieved: { annualTarget: "", achieved: "" },
    headOfBrand: "",
  });

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
      inventoryReport: { totalStock: "" },
      operationalExpenses: { annual: "" },
      targetsAndAchieved: { annualTarget: "", achieved: "" },
      headOfBrand: "",
    });
  };

  const handleCardClick = (locationName) => {
    router.push(`/brands/${brandName}/locations/${locationName}`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{brandName} Locations</h1>
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
              <Input
                name="locationName"
                placeholder="Location Name"
                value={newLocation.locationName}
                onChange={handleInputChange}
              />
              <Input
                name="serviceDivisions"
                placeholder="Service Divisions"
                value={newLocation.serviceDivisions}
                onChange={(e) =>
                  setNewLocation((prev) => ({
                    ...prev,
                    serviceDivisions: e.target.value
                      .split(",")
                      .map((s) => s.trim()),
                  }))
                }
              />
              <Input
                name="salesDetails.totalSales"
                placeholder="Total Sales"
                value={newLocation.salesDetails.totalSales}
                onChange={handleInputChange}
              />
              <Input
                name="inventoryReport.totalStock"
                placeholder="Total Stock"
                value={newLocation.inventoryReport.totalStock}
                onChange={handleInputChange}
              />
              <Input
                name="operationalExpenses.annual"
                placeholder="Annual Expenses"
                value={newLocation.operationalExpenses.annual}
                onChange={handleInputChange}
              />
              <Input
                name="targetsAndAchieved.annualTarget"
                placeholder="Annual Target"
                value={newLocation.targetsAndAchieved.annualTarget}
                onChange={handleInputChange}
              />
              <Input
                name="targetsAndAchieved.achieved"
                placeholder="Achieved"
                value={newLocation.targetsAndAchieved.achieved}
                onChange={handleInputChange}
              />
              <Input
                name="headOfBrand"
                placeholder="Head of Brand"
                value={newLocation.headOfBrand}
                onChange={handleInputChange}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleSubmit}>Submit</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location, index) => (
          <Card
            key={index}
            className="mb-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
            onClick={() => handleCardClick(location.locationName)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <p>{location.locationName}</p>
                <Badge className={"text-xs"}>{location.headOfBrand}</Badge>
              </CardTitle>
              <div className="flex space-x-2 my-2">
                {location.serviceDivisions.map((service, index) => (
                  <Badge key={index} className={"text-xs"} variant="outline">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <CardDescription className="flex justify-between items-center">
                      <p className="font-bold">Total Sales:</p>
                      <span>{location.salesDetails.totalSales}</span>
                    </CardDescription>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex items-center justify-between">
                      <p>Total Sales:</p>
                      <span>{location.salesDetails.totalSales}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p>Top Product</p>
                      <span className="text-xs">
                        {location.salesDetails.topProduct}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p>Growth Rate</p>
                      <span className="text-xs">
                        {location.salesDetails.growthRate}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-between">
                      <p>Quarter Wise Sales:</p>
                      <ul>
                        {location.salesDetails.quarterWise.map((q, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {q.quarter}:
                            <span className="text-xs">{q.sales}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <CardDescription className="flex justify-between items-center">
                      <p className="font-bold">Total Stock:</p>
                      <span>{location.inventoryReport.totalStock}</span>
                    </CardDescription>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex items-center justify-between">
                      <p>Damaged Units:</p>
                      <span className="text-xs">
                        {location.inventoryReport.damagedUnits}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p>Last Audit:</p>
                      <span className="text-xs">
                        {location.inventoryReport.lastAudit}
                      </span>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <CardDescription className="flex justify-between items-center">
                      <p className="font-bold">Annual Expenses:</p>
                      <span>{location.operationalExpenses.annual}</span>
                    </CardDescription>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex items-center justify-between">
                      <p>Marketing:</p>
                      <span className="text-xs">
                        {location.operationalExpenses.marketing}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p>R&D:</p>
                      <span className="text-xs">
                        {location.operationalExpenses.RnD}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p>Logistics:</p>
                      <span className="text-xs">
                        {location.operationalExpenses.logistics}
                      </span>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <CardDescription className="flex justify-between items-center">
                      <p className="font-bold">Annual Targets:</p>
                      <span>
                        {location.targetsAndAchieved.achieved} /{" "}
                        {location.targetsAndAchieved.annualTarget}
                      </span>
                    </CardDescription>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex flex-col">
                      <p className="text-center">
                        Quarter Wise Achieved/Targets:
                      </p>
                      <ul className="flex flex-col gap-1">
                        {location.targetsAndAchieved.quarterWise.map((q, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between"
                          >
                            {q.quarter}:
                            <span className="text-xs">
                              {q.achieved} / {q.target}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
