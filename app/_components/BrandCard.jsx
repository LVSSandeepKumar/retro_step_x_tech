"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { PickAName } from "@/lib/utils";

// Helper functions for generating random data
const generateRandomSales = () => ({
  totalSales: `₹${(Math.random() * 100 + 50).toFixed(1)}L`,
  topProduct: ["Pulsar 150", "Classic 350", "Apache RTR", "Activa 6G", "Jupiter"][
    Math.floor(Math.random() * 5)
  ],
  growthRate: `${(Math.random() * 30 + 5).toFixed(1)}% YoY`,
  quarterWise: Array(4).fill().map((_, i) => ({
    quarter: `Q${i + 1}`,
    sales: `₹${(Math.random() * 40 + 10).toFixed(0)}L`
  }))
});

const generateRandomInventory = () => ({
  totalStock: Math.floor(Math.random() * 5000 + 1000),
  damagedUnits: Math.floor(Math.random() * 50 + 10),
  lastAudit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  warehouses: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
});

const generateRandomExpenses = () => ({
  annual: `₹${(Math.random() * 10 + 5).toFixed(1)}Cr`,
  marketing: `₹${(Math.random() * 50 + 30).toFixed(0)}L`,
  RnD: `₹${(Math.random() * 40 + 20).toFixed(0)}L`,
  logistics: `₹${(Math.random() * 30 + 15).toFixed(0)}L`
});

const generateRandomTargets = () => {
  const target = (Math.random() * 200 + 100).toFixed(1);
  const achieved = (Math.random() * target).toFixed(1);
  return {
    annualTarget: `₹${target}Cr`,
    achieved: `₹${achieved}Cr`,
    quarterWise: Array(4).fill().map((_, i) => ({
      quarter: `Q${i + 1}`,
      target: `₹${(Math.random() * 50 + 25).toFixed(0)}L`,
      achieved: `₹${(Math.random() * 40 + 20).toFixed(0)}L`
    }))
  };
};

const generateRandomBrandData = (brand) => ({
  brandName: brand,
  logo: `/logos/${brand.toLowerCase()}.png`, // Assuming logo naming convention
  headOfBrand: PickAName(),
  salesDetails: generateRandomSales(),
  inventoryReport: generateRandomInventory(),
  operationalExpenses: generateRandomExpenses(),
  targetsAndAchieved: generateRandomTargets()
});

const BrandCard = ({ brands, onCardClick, onTitleClick }) => {
  const [brandsWithData, setBrandsWithData] = useState([]);

  useEffect(() => {
    const generatedData = brands?.map(brand => 
      typeof brand === 'string' ? generateRandomBrandData(brand) : brand
    );
    setBrandsWithData(generatedData);
  }, [brands]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {brandsWithData?.map((brand, index) => (
        <Card
          key={index}
          className="mb-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={() => onCardClick(brand)}
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <img src={`/groups/${brand.brandName.toLowerCase()}.jpg`} width={100} height={10} />
              <p onClick={(e) => {
                e.stopPropagation();
                onTitleClick(brand.brandName);
              }}>
                {brand.brandName}
              </p>
              <Badge className={"text-xs"}>{brand.headOfBrand}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <CardDescription className="flex justify-between items-center">
                    <p className="font-bold">Total Sales:</p>
                    <span>{brand.salesDetails.totalSales}</span>
                  </CardDescription>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex items-center justify-between">
                    <p>Top Product: </p>
                    <span className="text-xs">
                      {brand.salesDetails.topProduct}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Growth Rate: </p>
                    <span className="text-xs">
                      {brand.salesDetails.growthRate}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-between">
                    <p>Quarter Wise Sales:</p>
                    <ul>
                      {brand.salesDetails.quarterWise?.map((q, i) => (
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
                    <span>{brand.inventoryReport.totalStock}</span>
                  </CardDescription>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex items-center flex-col">
                    <p>Warehouses: </p>
                    <ul className="flex flex-col gap-1 items-center">
                      {brand.inventoryReport.warehouses?.map((w, i) => (
                        <li key={i} className="text-xs">
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <p>Damaged Units:</p>
                    <span className="text-xs">
                      {brand.inventoryReport.damagedUnits}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p>Last Audit:</p>
                    <span className="text-xs">
                      {brand.inventoryReport.lastAudit}
                    </span>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <CardDescription className="flex justify-between items-center">
                    <p className="font-bold">Annual Expenses:</p>
                    <span>{brand.operationalExpenses.annual}</span>
                  </CardDescription>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex items-center justify-between">
                    <p>Marketing:</p>
                    <span className="text-xs">
                      {brand.operationalExpenses.marketing}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p>R&D:</p>
                    <span className="text-xs">
                      {brand.operationalExpenses.RnD}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p>Logistics:</p>
                    <span className="text-xs">
                      {brand.operationalExpenses.logistics}
                    </span>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <CardDescription className="flex justify-between items-center">
                    <p className="font-bold">Annual Targets:</p>
                    <span>
                      {brand.targetsAndAchieved.achieved} /{" "}
                      {brand.targetsAndAchieved.annualTarget}
                    </span>
                  </CardDescription>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex flex-col">
                    <p className="text-center">
                      Quarter Wise Achieved/Targets:
                    </p>
                    <ul className="flex flex-col gap-1">
                      {brand.targetsAndAchieved.quarterWise?.map((q, i) => (
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
  );
};

export default BrandCard;
