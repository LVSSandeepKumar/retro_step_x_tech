import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // shadCN button component
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
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import React from "react";
import { useParams } from "next/navigation";

const BestPerformingBranchCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [branchData, setBranchData] = useState([]);

  const { brandName } = useParams();

  const getTopItem = (brandName) => {
    const items = {
      Bajaj: ["Bajaj Pulsar 150", "Bajaj Avenger 150", "Bajaj Dominar 250"],
      Vespa: ["Vespa 125", "Vespa 150", "Vespa 125 Street"],
      Triumph: [
        "Triumph Street Triple",
        "Triumph Street Triple 125",
        "Triumph Street Triple 150",
      ],
      Tata: ["Tata Nexon", "Tata Nexon 2.0", "Tata Nexon 2.0 XZ"],
    };
    const brandItems = items[brandName] || [];
    return brandItems[Math.floor(Math.random() * brandItems.length)];
  };

  useEffect(() => {
    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const data = [
      {
        name: "Branch A",
        sales: generateRandomNumber(11000, 13000),
        revenue: `₹${generateRandomNumber(1000000, 2000000)}`,
        topItem: getTopItem(brandName),
      },
      {
        name: "Branch B",
        sales: generateRandomNumber(8000, 10000),
        revenue: `₹${generateRandomNumber(800000, 1500000)}`,
        topItem: getTopItem(brandName),
      },
      {
        name: "Branch C",
        sales: generateRandomNumber(6000, 7000),
        revenue: `₹${generateRandomNumber(700000, 1200000)}`,
        topItem: getTopItem(brandName),
      },
      {
        name: "Branch D",
        sales: generateRandomNumber(3000, 5000),
        revenue: `₹${generateRandomNumber(600000, 1000000)}`,
        topItem: getTopItem(brandName),
      },
    ];

    setBranchData(data);
  }, [brandName]);

  return (
    <div className="relative overflow-hidden rounded-lg border bg-white p-6 shadow-md">
      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-current animate-sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: "2s",
              color: ["#f59e0b", "#3b82f6", "#ef4444", "#10b981"][
                Math.floor(Math.random() * 4)
              ],
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative">
        {branchData.length > 0 && (
          <>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Congratulations {branchData[0].name}! 🎉
            </h2>
            <p className="text-sm text-gray-500">
              Best performing branch of the month
            </p>
            <div className="text-4xl font-bold my-4">
              {branchData[0].revenue}
            </div>
          </>
        )}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="default">View Branch Performance</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Best Performing Branches This Month</DialogTitle>
              <DialogDescription>
                Details of branch performance this month
              </DialogDescription>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Branch Name</TableCell>
                  <TableCell>No. of Sales</TableCell>
                  <TableCell>Revenue Generated</TableCell>
                  <TableCell>Top Sale Item</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branchData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.sales}</TableCell>
                    <TableCell>{data.revenue}</TableCell>
                    <TableCell>{data.topItem}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BestPerformingBranchCard;
