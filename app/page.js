"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { brandsData } from "@/lib/constants";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [brands, setBrands] = useState(brandsData);
  const [newBrand, setNewBrand] = useState({
    brandName: "",
    salesDetails: { totalSales: "", topProduct: "", growthRate: "" },
    inventoryReport: { totalStock: "" },
    operationalExpenses: { annual: "" },
    targetsAndAchieved: { annualTarget: "", achieved: "" },
    headOfBrand: "",
  });

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewBrand((prev) => {
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
    setBrands((prev) => [...prev, newBrand]);
    setNewBrand({
      brandName: "",
      salesDetails: { totalSales: "", topProduct: "", growthRate: "" },
      inventoryReport: { totalStock: "" },
      operationalExpenses: { annual: "" },
      targetsAndAchieved: { annualTarget: "", achieved: "" },
      headOfBrand: "",
    });
  };

  const handleCardClick = (brandName) => {
    console.log(brandName);
    router.push(`/brands/${brandName}`);
  };

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const salesData = months.map((month) => {
    const data = { month };
    brands.forEach((brand) => {
      const monthData = brand.salesDetails.monthWise.find(
        (m) => m.month === month
      );
      data[brand.brandName] = parseFloat(
        monthData.sales.replace(/[^0-9.-]+/g, "")
      );
    });
    return data;
  });

  return (
    <div>
      <div className="p-4 md:p-6 lg:p-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Brands</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2" size={16} />
                Create Brand
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Brand</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new brand.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  name="brandName"
                  placeholder="Brand Name"
                  value={newBrand.brandName}
                  onChange={handleInputChange}
                />
                <Input
                  name="salesDetails.totalSales"
                  placeholder="Total Sales"
                  value={newBrand.salesDetails.totalSales}
                  onChange={handleInputChange}
                />
                <Input
                  name="inventoryReport.totalStock"
                  placeholder="Total Stock"
                  value={newBrand.inventoryReport.totalStock}
                  onChange={handleInputChange}
                />
                <Input
                  name="operationalExpenses.annual"
                  placeholder="Annual Expenses"
                  value={newBrand.operationalExpenses.annual}
                  onChange={handleInputChange}
                />
                <Input
                  name="targetsAndAchieved.annualTarget"
                  placeholder="Annual Target"
                  value={newBrand.targetsAndAchieved.annualTarget}
                  onChange={handleInputChange}
                />
                <Input
                  name="targetsAndAchieved.achieved"
                  placeholder="Achieved"
                  value={newBrand.targetsAndAchieved.achieved}
                  onChange={handleInputChange}
                />
                <Input
                  name="headOfBrand"
                  placeholder="Head of Brand"
                  value={newBrand.headOfBrand}
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
          {brands.map((brand, index) => (
            <Card
              key={index}
              className="mb-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => handleCardClick(brand.brandName)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <p>{brand.brandName}</p>
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
                          {brand.salesDetails.quarterWise.map((q, i) => (
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
                        <span>{brand.inventoryReport.totalStock}</span>
                      </CardDescription>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="flex items-center flex-col">
                        <p>Warehouses: </p>
                        <ul className="flex flex-col gap-1 items-center">
                          {brand.inventoryReport.warehouses.map((w, i) => (
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
                          {brand.targetsAndAchieved.quarterWise.map((q, i) => (
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

        <h1 className="text-xl font-bold my-6">
          Monthly Brand Sales Performance
        </h1>
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
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {brands.map((brand) => (
              <Line
                key={brand.brandName}
                type="monotone"
                dataKey={brand.brandName}
                stroke="black"
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
