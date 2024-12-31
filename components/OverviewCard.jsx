import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { ArrowDownUp } from "lucide-react";
import { useParams } from "next/navigation";
import {
  PickAccessories,
  PickAColor,
  PickAName,
  pickAProduct,
} from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const OverviewCard = ({ title }) => {
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

  const productNameArray =
    brandName === "Bajaj"
      ? ["Bajaj Pulsar 150", "Bajaj Avenger 150", "Bajaj Dominar 250"]
      : brandName === "Vespa"
      ? ["Vespa 125", "Vespa 125XT"]
      : brandName === "Tata"
      ? ["Tata Nexon", "Tata Nexon 2.0", "Tata Nexon 2.0 XZ"]
      : brandName === "Triumph"
      ? [
          "Triumph Street Triple",
          "Triumph Street Triple 125",
          "Triumph Street Triple 150",
        ]
      : [];

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

    setSold(generateRandomNumber(50, 85));
    setTotal(100 - sold);
    setPercentage((Math.random() * 100).toFixed(2));

    if (title === "Sales") {
      const salesData = [
        {
          productId: 1,
          productName: pickAProduct(brandName),
          sellerName: PickAName(),
          customerName: PickAName(),
          customerNo: generateRandomNumber(9500000000, 9999999999),
          date: "2023-10-01",
          amount: 5000,
          color: PickAColor(),
          discount: generateRandomNumber(10, 40),
          insurance: generateRandomNumber(50, 100) * 1000,
          accessories: PickAccessories(),
          accessoriesAmount: generateRandomNumber(50, 100) * 100,
        },
        {
          productId: 2,
          productName: pickAProduct(brandName),
          sellerName: PickAName(),
          customerName: PickAName(),
          customerNo: generateRandomNumber(9500000000, 9999999999),
          date: "2023-10-02",
          amount: 3000,
          color: PickAColor(),
          discount: generateRandomNumber(10, 40),
          insurance: generateRandomNumber(50, 100) * 1000,
          accessories: PickAccessories(),
          accessoriesAmount: generateRandomNumber(50, 100) * 100,
        },
        {
          productId: 3,
          productName: pickAProduct(brandName),
          sellerName: PickAName(),
          customerName: PickAName(),
          customerNo: generateRandomNumber(9500000000, 9999999999),
          date: "2023-10-03",
          amount: 7000,
          color: PickAColor(),
          discount: generateRandomNumber(10, 40),
          insurance: generateRandomNumber(50, 100) * 1000,
          accessories: PickAccessories(),
          accessoriesAmount: generateRandomNumber(50, 100) * 100,
        },
        {
          productId: 4,
          productName: pickAProduct(brandName),
          sellerName: PickAName(),
          customerName: PickAName(),
          customerNo: generateRandomNumber(9500000000, 9999999999),
          date: "2023-10-04",
          amount: 2000,
          color: PickAColor(),
          discount: generateRandomNumber(10, 40),
          insurance: generateRandomNumber(50, 100) * 1000,
          accessories: PickAccessories(),
          accessoriesAmount: generateRandomNumber(50, 100) * 100,
        },
      ];
      setData(salesData);
    } else if (title === "Accessories") {
      const accessoriesData = [
        {
          productId: 1,
          productName: accesoriesNameArray,
          sellerName: PickAName(),
          customerName: PickAName(),
          customerNo: generateRandomNumber(9500000000, 9999999999),
          trNo: `tr${generateRandomNumber(1000, 9999)}`,
          bikeNo: `bk${generateRandomNumber(1000, 9999)}`,
          newBike: Math.random() > 0.5 ? true : false,
          date: "2023-10-01",
          amount: 1500,
          discount: generateRandomNumber(10, 40),
        },
        {
          productId: 2,
          productName: accesoriesNameArray,
          sellerName: PickAName(),
          customerName: PickAName(),
          customerNo: generateRandomNumber(9500000000, 9999999999),
          trNo: `tr${generateRandomNumber(1000, 9999)}`,
          bikeNo: `bk${generateRandomNumber(1000, 9999)}`,
          newBike: Math.random() > 0.5 ? true : false,
          date: "2023-10-02",
          amount: 1300,
          discount: generateRandomNumber(10, 40),
        },
        {
          productId: 3,
          productName: accesoriesNameArray,
          sellerName: PickAName(),
          customerName: PickAName(),
          customerNo: generateRandomNumber(9500000000, 9999999999),
          trNo: `tr${generateRandomNumber(1000, 9999)}`,
          bikeNo: `bk${generateRandomNumber(1000, 9999)}`,
          newBike: Math.random() > 0.5 ? true : false,
          date: "2023-10-03",
          amount: 1700,
          discount: generateRandomNumber(10, 40),
        },
        {
          productId: 4,
          productName: accesoriesNameArray,
          sellerName: PickAName(),
          customerName: PickAName(),
          customerNo: generateRandomNumber(9500000000, 9999999999),
          trNo: `tr${generateRandomNumber(1000, 9999)}`,
          bikeNo: `bk${generateRandomNumber(1000, 9999)}`,
          newBike: Math.random() > 0.5 ? true : false,
          date: "2023-10-04",
          amount: 1200,
          discount: generateRandomNumber(10, 40),
        },
      ];
      setData(accessoriesData);
    } else if (title === "Apparels") {
      const apparelsData = [
        {
          productId: 1,
          productName: apparelsNameArray,
          sellerName: PickAName(),
          customerName: PickAName(),
          customerNo: generateRandomNumber(9500000000, 9999999999),
          date: "2023-10-01",
          amount: 2500,
          discount: generateRandomNumber(10, 40),
        },
        {
          productId: 2,
          productName: apparelsNameArray,
          sellerName: PickAName(),
          customerName: PickAName(),
          customerNo: generateRandomNumber(9500000000, 9999999999),
          date: "2023-10-02",
          amount: 2100,
          discount: generateRandomNumber(10, 40),
        },
        {
          productId: 3,
          productName: apparelsNameArray,
          sellerName: PickAName(),
          customerName: PickAName(),
          customerNo: generateRandomNumber(9500000000, 9999999999),
          date: "2023-10-03",
          amount: 2800,
          discount: generateRandomNumber(10, 40),
        },
        {
          productId: 4,
          productName: apparelsNameArray,
          sellerName: PickAName(),
          customerName: PickAName(),
          customerNo: generateRandomNumber(9500000000, 9999999999),
          date: "2023-10-04",
          amount: 1900,
          discount: generateRandomNumber(10, 40),
        },
      ];
      setData(apparelsData);
    }
  }, [title]);

  const filteredData = data.filter(
    (item) =>
      (item.sellerName &&
        item.sellerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.customerName &&
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.color &&
        item.color.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                <span className="text-md mb-2 text-gray-600">{title}</span>
                <span className="text-lg font-bold text-gray-800 mb-2">
                  {sold}%
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-md mb-2 text-gray-600">Visits</span>
                <span className="text-lg font-bold text-gray-800 mb-2">
                  {100 - sold}%
                </span>
              </div>
            </div>
            <Progress value={sold} className="bg-gray-200" />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="default">View {title} Overview</Button>
            </DialogTrigger>
            <DialogContent className="max-w-8xl">
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
                    <TableCell className="font-semibold">Product ID</TableCell>
                    {(title === "Sales") && (
                      <TableCell className="font-semibold">
                        Product Name
                      </TableCell>
                    )}
                    <TableCell className="font-semibold">
                      SalesMan Name
                    </TableCell>
                    <TableCell className="font-semibold">
                      Customer Name
                    </TableCell>
                    <TableCell className="font-semibold">
                      Mobile Number
                    </TableCell>
                    {title === "Accessories" && (
                      <TableCell className="font-semibold">Bike No.</TableCell>
                    )}
                    {title === "Accessories" && (
                      <TableCell className="font-semibold">T/R No.</TableCell>
                    )}
                    <TableCell onClick={() => requestSort("date")}>
                      <span className="ml-2 flex items-center gap-2 font-semibold">
                        Date
                        <ArrowDownUp className="size-4" />
                      </span>
                    </TableCell>
                    <TableCell onClick={() => requestSort("amount")}>
                      <span className="ml-2 flex items-center gap-2 font-semibold">
                        Amount
                        <ArrowDownUp className="size-4" />
                      </span>
                    </TableCell>
                    {title === "Sales" && (
                      <TableCell className="font-semibold">
                        Insurance Amount
                      </TableCell>
                    )}
                    {title === "Sales" && (
                      <TableCell className="font-semibold">
                        Accessories
                      </TableCell>
                    )}
                    {title === "Sales" && (
                      <TableCell className="font-semibold">Color</TableCell>
                    )}
                    <TableCell className="font-semibold">Discount</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.productId}</TableCell>
                      {(title === "Sales") && (
                        <TableCell>{item.productName}</TableCell>
                      )}
                      <TableCell>{item.sellerName}</TableCell>
                      <TableCell>{item.customerName}</TableCell>
                      <TableCell>{item.customerNo}</TableCell>
                      {title === "Accessories" && (
                        <TableCell>
                          {!item.newBike ? item.bikeNo : "N/A"}
                        </TableCell>
                      )}
                      {title === "Accessories" && (
                        <TableCell>
                          {item.newBike ? item.trNo : "N/A"}
                        </TableCell>
                      )}
                      <TableCell>{item.date}</TableCell>
                      {title === "Sales" ? (
                        <TableCell>₹ {item.amount}</TableCell>
                      ) : (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <span className="cursor-pointer">
                                ₹ {item.amount}
                              </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {title === "Accessories" &&
                                item.productName &&
                                item.productName.map((accessory, index) => (
                                  <DropdownMenuItem key={index}>
                                    {accessory}
                                  </DropdownMenuItem>
                                ))}
                              {title === "Apparels" &&
                                item.productName &&
                                item.productName.map((apparel, index) => (
                                  <DropdownMenuItem key={index}>
                                    {apparel}
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                      {title === "Sales" && (
                        <TableCell>₹ {item.insurance}</TableCell>
                      )}
                      {title === "Sales" && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <span className="cursor-pointer">
                                ₹ {item.accessoriesAmount}
                              </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {item.accessories &&
                                item.accessories.map((accessory, index) => (
                                  <DropdownMenuItem key={index}>
                                    {accessory}
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                      {title === "Sales" && (
                        <TableCell>{item.color}</TableCell>
                      )}
                      <TableCell>{item.discount}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="default">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
