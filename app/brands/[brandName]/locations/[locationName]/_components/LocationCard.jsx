"use client";

import { useRouter } from "next/navigation";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
const LocationCard = ({ location, index }) => {
  const router = useRouter();

  const handleCardClick = (locationName) => {
    router.push(`/brands/${brandName}/locations/${locationName}`);
  };

  return (
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
                      {q.quarter}:<span className="text-xs">{q.sales}</span>
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
                <p className="text-center">Quarter Wise Achieved/Targets:</p>
                <ul className="flex flex-col gap-1">
                  {location.targetsAndAchieved.quarterWise.map((q, i) => (
                    <li key={i} className="flex items-center justify-between">
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
  );
};

export default LocationCard;
