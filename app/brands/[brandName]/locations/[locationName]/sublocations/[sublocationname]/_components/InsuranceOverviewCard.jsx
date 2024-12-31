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
import {
  PickAName,
  pickAPolicyProvider,
  pickAProduct
} from "@/lib/utils";
import { ArrowDownUp } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const InsuranceOverviewCard = () => {
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

  useEffect(() => {
    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    setSold(generateRandomNumber(50, 85));
    setTotal(100 - sold);
    setPercentage((Math.random() * 100).toFixed(2));

    const insuranceData = [
      {
        policyNo: `pl-${generateRandomNumber(1, 100)}`,
        providerName: pickAPolicyProvider(),
        claimAmount: generateRandomNumber(1000, 5000),
        claimDate: "2023-06-01",
        status: "Pending",
        approvedAmount: "N/A",
        expiryDate: "2023-06-30",
        ownerName: PickAName(),
        ownerNo: generateRandomNumber(9000000000, 9999999999),
        vehicleNo: `VH-${generateRandomNumber(1, 100)}`,
        vehicleName: pickAProduct(brandName),
        claimDate: "2023-06-01",
      },
      {
        policyNo: `pl-${generateRandomNumber(1, 100)}`,
        providerName: pickAPolicyProvider(),
        claimAmount: generateRandomNumber(1000, 5000),
        claimDate: "2023-07-01",
        status: "Pending",
        approvedAmount: "N/A",
        expiryDate: "2023-07-30",
        ownerName: PickAName(),
        ownerNo: generateRandomNumber(9000000000, 9999999999),
        vehicleNo: `VH-${generateRandomNumber(1, 100)}`,
        vehicleName: pickAProduct(brandName),
        claimDate: "2023-07-01",
      },
      {
        policyNo: `pl-${generateRandomNumber(1, 100)}`,
        providerName: pickAPolicyProvider(),
        claimAmount: generateRandomNumber(1000, 5000),
        claimDate: "2023-08-01",
        status: "Approved",
        approvedAmount: generateRandomNumber(500, 1000),
        expiryDate: "2023-08-30",
        ownerName: PickAName(),
        ownerNo: generateRandomNumber(9000000000, 9999999999),
        vehicleNo: `VH-${generateRandomNumber(1, 100)}`,
        vehicleName: pickAProduct(brandName),
        claimDate: "2023-08-01",
      },
      {
        policyNo: `pl-${generateRandomNumber(1, 100)}`,
        providerName: pickAPolicyProvider(),
        claimAmount: generateRandomNumber(1000, 5000),
        claimDate: "2023-09-01",
        status: "Approved",
        approvedAmount: generateRandomNumber(500, 1000),
        expiryDate: "2023-09-30",
        ownerName: PickAName(),
        ownerNo: generateRandomNumber(9000000000, 9999999999),
        vehicleNo: `VH-${generateRandomNumber(1, 100)}`,
        vehicleName: pickAProduct(brandName),
        claimDate: "2023-09-01",
      },
    ];
    setData(insuranceData);
  }, []);

  const filteredData = data.filter((item) => {
    console.log(item.productName);
    return (
      item.policyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.providerName &&
        item.providerName.toLowerCase().includes(searchTerm.toLowerCase()))
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
          Insurance Overview
        </CardTitle>
        <p className="text-gray-400 text-sm">{percentage}% since last month</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Combined Progress Bar */}
          <div className="">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span className="text-md mb-2 text-gray-600">Approved</span>
                <span className="text-lg font-bold text-gray-800 mb-2">
                  {sold}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-md mb-2 text-gray-600">Pending</span>
                <span className="text-lg font-bold text-gray-800 mb-2">
                  {total - sold}%
                </span>
              </div>
            </div>
            <Progress value={sold} className="bg-gray-200" />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="default">View Insurance Overview</Button>
            </DialogTrigger>
            <DialogContent className="max-w-8xl">
              <DialogHeader>
                <DialogTitle>Insurance Overview</DialogTitle>
                <DialogDescription>
                  Details of Insurance information
                </DialogDescription>
              </DialogHeader>
              <Input
                type="text"
                placeholder={`Search by Provider Name, Policy No., Owner Name, Vehicle No.`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell className="font-semibold">Policy No.</TableCell>
                    <TableCell className="font-semibold">
                      Policy Provider
                    </TableCell>
                    <TableCell onClick={() => requestSort("date")}>
                      <span className="ml-2 flex items-center gap-2 font-semibold">
                        Claim Amount
                        <ArrowDownUp className="size-4" />
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      Status
                    </TableCell>
                    <TableCell onClick={() => requestSort("amount")}>
                      <span className="ml-2 flex items-center gap-2 font-semibold">
                        Approved Amount
                        <ArrowDownUp className="size-4" />
                      </span>
                    </TableCell>
                    <TableCell onClick={() => requestSort("amount")}>
                      <span className="ml-2 flex items-center gap-2 font-semibold">
                        Expiry Date
                        <ArrowDownUp className="size-4" />
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">Owner Name</TableCell>
                    <TableCell className="font-semibold">Mobile No.</TableCell>
                    <TableCell className="font-semibold">Vehicle No.</TableCell>
                    <TableCell className="font-semibold">Vehicle/Model Name</TableCell>
                    <TableCell onClick={() => requestSort("amount")}>
                      <span className="ml-2 flex items-center gap-2 font-semibold">
                        Claim Date
                        <ArrowDownUp className="size-4" />
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">Balance Amount</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.policyNo}</TableCell>
                      <TableCell>{item.providerName}</TableCell>
                      <TableCell>₹ {item.claimAmount}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>₹ {item.approvedAmount}</TableCell>
                      <TableCell>{item.expiryDate}</TableCell>
                      <TableCell>{item.ownerName}</TableCell>
                      <TableCell>{item.ownerNo}</TableCell>
                      <TableCell>{item.vehicleNo}</TableCell>
                      <TableCell>{item.vehicleName}</TableCell>
                      <TableCell>{item.claimDate}</TableCell>
                      <TableCell>₹ {item.claimAmount - item.approvedAmount}</TableCell>
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
      </CardContent>
    </Card>
  );
};

export default InsuranceOverviewCard;
