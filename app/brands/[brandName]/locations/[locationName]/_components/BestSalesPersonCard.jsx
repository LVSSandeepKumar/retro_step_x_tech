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
import { PickAName } from "@/lib/utils";

const BestSalesPersonCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [salesData, setSalesData] = useState([]);

  const { brandName } = useParams();

  const getTopItem = (brandName) => {
    const items = {
      Bajaj: ["Bajaj Pulsar 150", "Bajaj Avenger 150", "Bajaj Dominar 250"],
      Vespa: ["Vespa 125", "Vespa 150", "Vespa 125 Street"],
      Triumph: ["Triumph Street Triple", "Triumph Street Triple 125", "Triumph Street Triple 150"],
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
        name: PickAName(),
        sales: generateRandomNumber(11, 13),
        revenue: `₹${generateRandomNumber(100000, 200000)}`,
        topItem: getTopItem(brandName),
      },
      {
        name: PickAName(),
        sales: generateRandomNumber(8, 10),
        revenue: `₹${generateRandomNumber(80000, 150000)}`,
        topItem: getTopItem(brandName),
      },
      {
        name: PickAName(),
        sales: generateRandomNumber(6, 7),
        revenue: `₹${generateRandomNumber(70000, 120000)}`,
        topItem: getTopItem(brandName),
      },
      {
        name: PickAName(),
        sales: generateRandomNumber(3, 5),
        revenue: `₹${generateRandomNumber(60000, 100000)}`,
        topItem: getTopItem(brandName),
      },
    ];

    setSalesData(data);
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
        {salesData.length > 0 && (
          <>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Congratulations {salesData[0].name}! 🎉
            </h2>
            <p className="text-sm text-gray-500">Best seller of the month</p>
            <div className="text-4xl font-bold my-4">{salesData[0].revenue}</div>
          </>
        )}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="default">View Sales</Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>Best Sellers This Month</DialogTitle>
              <DialogDescription>
                Details of sales made this month
              </DialogDescription>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Sales Person Name</TableCell>
                  <TableCell>No. of Sales</TableCell>
                  <TableCell>Revenue Generated</TableCell>
                  <TableCell>Top Sale Item</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.map((data, index) => (
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

export default BestSalesPersonCard;
