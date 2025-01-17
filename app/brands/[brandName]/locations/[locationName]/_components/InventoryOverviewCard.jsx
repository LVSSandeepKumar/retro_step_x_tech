import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pickAProduct } from "@/lib/utils";
import { ArrowDownUp } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const InventoryOverviewCard = ({ title }) => {
  const { brandName } = useParams();
  const [sold, setSold] = useState(0);
  const [total, setTotal] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });
  const [data, setData] = useState([]);

  const accesoriesNameArray =
    brandName === "Bajaj"
      ? ["Riding Gloves", "Handlebar Grips", "Engine Guard"]
      : brandName === "Vespa"
      ? ["Top Case", "Windshield", "Floor Mat"]
      : brandName === "Tata"
      ? ["Car Floor Mats", "Seat Covers", "Roof Rails"]
      : brandName === "Triumph"
      ? ["Heated Grips", "Tank Bag", "Panniers"]
      : [];

  const apparelsNameArray =
    brandName === "Bajaj"
      ? ["Riding Jacket", "Helmet", "Riding Boots"]
      : brandName === "Vespa"
      ? ["Open-face Helmet", "Riding Gloves", "Scooter Raincoat"]
      : brandName === "Tata"
      ? ["Tata Branded T-shirt", "Tata Cap", "Tata Hoodie"]
      : brandName === "Triumph"
      ? ["Leather Jacket", "Riding Gloves", "Motorcycle Boots"]
      : [];

  useEffect(() => {
    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    setPercentage((Math.random() * 100).toFixed(2));

    if (title === "Low Stock") {
      setSold(generateRandomNumber(80, 90));
      setTotal(100 - sold);  
      const lowStockData = [
        {
          productID: 1,
          productType: "Vehicle",
          productName:
            pickAProduct(brandName),
          inward: generateRandomNumber(15, 25),
          inwardDate: "2023-07-01",
          inwardPrice: generateRandomNumber(1000, 5000),
          sold: generateRandomNumber(0, 10),
          revenue: generateRandomNumber(1000, 5000),
        },
        {
          productID: 2,
          productType: "Accessories",
          productName:
            accesoriesNameArray[
              Math.floor(Math.random() * accesoriesNameArray.length)
            ],
          inward: generateRandomNumber(15, 25),
          inwardDate: "2023-08-01",
          inwardPrice: generateRandomNumber(1000, 5000),
          sold: generateRandomNumber(0, 10),
          revenue: generateRandomNumber(1000, 5000),
        },
        {
          productID: 3,
          productType: "Apparels",
          productName:
            apparelsNameArray[
              Math.floor(Math.random() * apparelsNameArray.length)
            ],
          inward: generateRandomNumber(15, 25),
          inwardDate: "2023-09-01",
          inwardPrice: generateRandomNumber(1000, 5000),
          sold: generateRandomNumber(0, 10),
          revenue: generateRandomNumber(1000, 5000),
        },
        {
          productID: 4,
          productType: "Vehicle",
          productName:
            pickAProduct(brandName),
          inward: generateRandomNumber(15, 25),
          inwardDate: "2023-10-01",
          inwardPrice: generateRandomNumber(1000, 5000),
          sold: generateRandomNumber(0, 10),
          revenue: generateRandomNumber(1000, 5000),
        },
      ];
      setData(lowStockData);
    } else if (title === "Fast Moving") {
      setSold(generateRandomNumber(80, 90));
      setTotal(100 - sold);
      const fastMovingData = [
        {
          productID: 1,
          productType: "Vehicle",
          productName:
            pickAProduct(brandName),
          inward: generateRandomNumber(15, 25),
          inwardDate: "2023-07-01",
          inwardPrice: generateRandomNumber(1000, 5000),
          sold: generateRandomNumber(10, 25),
          revenue: generateRandomNumber(1000, 5000),
        },
        {
          productID: 2,
          productType: "Accessories",
          productName:
            accesoriesNameArray[
              Math.floor(Math.random() * accesoriesNameArray.length)
            ],
          inward: generateRandomNumber(15, 25),
          inwardDate: "2023-08-01",
          inwardPrice: generateRandomNumber(1000, 5000),
          sold: generateRandomNumber(10, 25),
          revenue: generateRandomNumber(1000, 5000),
        },
        {
          productID: 3,
          productType: "Apparels",
          productName:
            apparelsNameArray[
              Math.floor(Math.random() * apparelsNameArray.length)
            ],
          inward: generateRandomNumber(15, 25),
          inwardDate: "2023-09-01",
          inwardPrice: generateRandomNumber(1000, 5000),
          sold: generateRandomNumber(10, 25),
          revenue: generateRandomNumber(1000, 5000),
        },
        {
          productID: 4,
          productType: "Vehicle",
          productName:
            pickAProduct(brandName),
          inward: generateRandomNumber(15, 25),
          inwardDate: "2023-10-01",
          inwardPrice: generateRandomNumber(1000, 5000),
          sold: generateRandomNumber(10, 25),
          revenue: generateRandomNumber(1000, 5000),
        },
      ];
      setData(fastMovingData);
    } else if (title === "Dead Stock") {
      setSold(generateRandomNumber(20, 30));
      setTotal(100 - sold);
      const deadStockData = [
        {
          productID: 1,
          productType: "Vehicle",
          productName:
         pickAProduct( brandName),
          inward: generateRandomNumber(15, 25),
          inwardDate: "2023-07-01",
          inwardPrice: generateRandomNumber(1000, 5000),
          sold: generateRandomNumber(0, 10),
          revenue: generateRandomNumber(1000, 5000),
        },
        {
          productID: 2,
          productType: "Accessories",
          productName:
         accesoriesNameArray[
              Math.floor(Math.random() * accesoriesNameArray.length)
            ],
          inward: generateRandomNumber(15, 25),
          inwardDate: "2023-08-01",
          inwardPrice: generateRandomNumber(1000, 5000),
          sold: generateRandomNumber(0, 10),
          revenue: generateRandomNumber(1000, 5000),
        },
        {
          productID: 3,
          productType: "Apparels",
          productName:
         apparelsNameArray[
              Math.floor(Math.random() * apparelsNameArray.length)
            ],
          inward: generateRandomNumber(15, 25),
          inwardDate: "2023-09-01",
          inwardPrice: generateRandomNumber(1000, 5000),
          sold: generateRandomNumber(0, 10),
          revenue: generateRandomNumber(1000, 5000),
        },
        {
          productID: 4,
          productType: "Vehicle",
          productName:
            pickAProduct(brandName),
          inward: generateRandomNumber(15, 25),
          inwardDate: "2023-10-01",
          inwardPrice: generateRandomNumber(1000, 5000),
          sold: generateRandomNumber(0, 10),
          revenue: generateRandomNumber(1000, 5000),
        },
      ];
      setData(deadStockData);
    }
  }, [title]);

  const filteredData = data.filter((item) => {
    console.log(item.productName);
    return (
      item.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.productName &&
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (sortConfig.direction === "ascending") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {title} Overview
        </CardTitle>
        <p className="text-gray-400 text-sm">{percentage}% since last month</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Combined Progress Bar */}
          <div className="">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span className="text-md mb-2 text-gray-600">Sales</span>
                <span className="text-lg font-bold text-gray-800 mb-2">
                  {sold}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-md mb-2 text-gray-600">Inwards</span>
                <span className="text-lg font-bold text-gray-800 mb-2">
                  {total - sold}%
                </span>
              </div>
            </div>
            <Progress value={sold} className="bg-gray-200" />
          </div>
          {(title === "Low Stock" ||
            title === "Fast Moving" ||
            title === "Dead Stock") && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="default">View {title} Overview</Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl">
                <DialogHeader>
                  <DialogTitle>{title} Overview</DialogTitle>
                  <DialogDescription>
                    Details of {title.toLowerCase()} information
                  </DialogDescription>
                </DialogHeader>
                <Input
                  type="text"
                  placeholder={`Search by ${title} Name, Seller Name, Customer Name`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4"
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell className="font-semibold">
                        Product ID
                      </TableCell>
                      <TableCell className="font-semibold">
                        Product Type
                      </TableCell>
                      <TableCell className="font-semibold">
                        Product Name
                      </TableCell>
                      <TableCell className="font-semibold">
                        Inward Items
                      </TableCell>
                      <TableCell onClick={() => requestSort("date")}>
                        <span className="ml-2 flex items-center gap-2 font-semibold">
                          Inward Date
                          <ArrowDownUp className="size-4" />
                        </span>
                      </TableCell>
                      <TableCell onClick={() => requestSort("amount")}>
                        <span className="ml-2 flex items-center gap-2 font-semibold">
                          Inward Price
                          <ArrowDownUp className="size-4" />
                        </span>
                      </TableCell>
                      <TableCell>Sold</TableCell>
                      <TableCell onClick={() => requestSort("amount")}>
                        <span className="ml-2 flex items-center gap-2 font-semibold">
                          Revenue
                          <ArrowDownUp className="size-4" />
                        </span>
                      </TableCell>
                      <TableCell>Remaining Stock</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productID}</TableCell>
                        <TableCell>{item.productType}</TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.inward}</TableCell>
                        <TableCell>{item.inwardDate}</TableCell>
                        <TableCell>₹ {item.inwardPrice}</TableCell>
                        <TableCell>{item.sold}</TableCell>
                        <TableCell>₹ {item.revenue}</TableCell>
                        <TableCell>{item.inward - item.sold}</TableCell>
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryOverviewCard;
