import React, { useEffect, useState } from "react";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowDownUp } from "lucide-react";

const DeliveryCard = () => {
    const [deliveryData, setDeliveryData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        deliveryStatus: "all", // Options: all, pending, delivered
        bikeType: "all", // Options: all, new, old
        deliveryDate: "all", // Options: all, today, yesterday, tomorrow
    });
    const [sortConfig, setSortConfig] = useState({ key: "deliveryDate", direction: "descending" });

    useEffect(() => {
        const generateRandomNumber = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const yesterday = generateRandomNumber(5, 15);
        const today = generateRandomNumber(8, 20);
        const tomorrow = generateRandomNumber(10, 25);
        const total = yesterday + today + tomorrow;
        const percentageCompleted = Math.floor((yesterday / total) * 100);

        setDeliveryData({ yesterday, today, tomorrow, total, percentageCompleted });
    }, []);

    if (!deliveryData) return null;

    const deliveryDetails = [
        {
            orderNumber: "ON001",
            bikeName: "Bajaj Dominar 125",
            engineNo: "12AB1234",
            trNo: "TR123",
            ChassisNo: "CH123",
            amountPaid: "₹5000",
            remainingAmount: "₹75000",
            customerName: "Venkatesh",
            deliveryPerson: "Ravi",
            deliveryDate: "2024-01-25", // Tomorrow
            bikeType: "new",
            status: "pending",
        },
        {
            orderNumber: "ON002",
            bikeName: "Bajaj Pulsar 150",
            engineNo: "12CD5678",
            trNo: "TR456",
            ChassisNo: "CH456",
            amountPaid: "₹6000",
            remainingAmount: "₹94000",
            customerName: "Mahesh",
            deliveryPerson: "Ramesh",
            deliveryDate: "2024-01-24", // Today
            bikeType: "old",
            status: "delivered",
        },
        {
            orderNumber: "ON003",
            bikeName: "Triumph Street 125",
            engineNo: "12EF9012",
            trNo: "TR789",
            ChassisNo: "CH789",
            amountPaid: "₹4500",
            remainingAmount: "₹85500",
            customerName: "Sachin",
            deliveryPerson: "Kumar",
            deliveryDate: "2024-01-23", // Yesterday
            bikeType: "new",
            status: "delivered",
        },
        {
            orderNumber: "ON004",
            bikeName: "Vespa 125",
            engineNo: "12GH3456",
            trNo: "TR012",
            ChassisNo: "CH012",
            amountPaid: "₹5500",
            remainingAmount: "₹945000",
            customerName: "Vijay",
            deliveryPerson: "Suresh",
            deliveryDate: "2024-01-25", // Tomorrow
            bikeType: "old",
            status: "pending",
        },
    ];

    const filterDeliveries = (deliveries) => {
        return deliveries.filter((delivery) => {
            const matchesSearch =
                delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                delivery.bikeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                delivery.deliveryPerson.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                filters.deliveryStatus === "all" ||
                filters.deliveryStatus === delivery.status;

            const matchesBikeType =
                filters.bikeType === "all" ||
                filters.bikeType === delivery.bikeType;

            const matchesDate = (() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                const deliveryDate = new Date(delivery.deliveryDate);

                if (filters.deliveryDate === "all") return true;
                if (filters.deliveryDate === "today" && deliveryDate.toDateString() === today.toDateString()) return true;
                if (filters.deliveryDate === "yesterday" && deliveryDate.toDateString() === yesterday.toDateString()) return true;
                if (filters.deliveryDate === "tomorrow" && deliveryDate.toDateString() === tomorrow.toDateString()) return true;

                return false;
            })();

            return matchesSearch && matchesStatus && matchesBikeType && matchesDate;
        });
    };

    const sortedDeliveries = filterDeliveries(deliveryDetails).sort((a, b) => {
        if (sortConfig.key === "deliveryDate") {
            const dateA = new Date(a.deliveryDate);
            const dateB = new Date(b.deliveryDate);
            return sortConfig.direction === "ascending" ? dateA - dateB : dateB - dateA;
        }
        return 0;
    });

    const formatDeliveryDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <div className="col-start-1 col-end-3 p-4 rounded-lg border shadow-md bg-white">
            <h2 className="text-lg font-semibold mb-2">Delivery Details</h2>
            <div className="flex gap-4 mb-4">
                <Input
                    type="text"
                    placeholder="Search by Order No, Bike Name, Customer Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, deliveryStatus: value }))}
                    defaultValue="all"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Delivery Status" />
                    </SelectTrigger>

                    <SelectContent >
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, bikeType: value }))}
                    defaultValue="all"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Bike Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="old">Old</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, deliveryDate: value }))}
                    defaultValue="all"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Delivery Date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell>Order Number</TableCell>
                        <TableCell>Bike Name</TableCell>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Delivery Person</TableCell>
                        <TableCell onClick={() => setSortConfig({ key: "deliveryDate", direction: "ascending" })}>
                            <span className="flex items-center gap-2">
                                Delivery Date
                                <ArrowDownUp className="size-4" />
                            </span>
                        </TableCell>
                        <TableCell>Amount Paid</TableCell>
                        <TableCell>Remaining Amount</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedDeliveries.map((delivery, index) => (
                        <TableRow key={index}>
                            <TableCell>{delivery.orderNumber}</TableCell>
                            <TableCell>{delivery.bikeName}</TableCell>
                            <TableCell>{delivery.customerName}</TableCell>
                            <TableCell>{delivery.deliveryPerson}</TableCell>
                            <TableCell>{formatDeliveryDate(delivery.deliveryDate)}</TableCell>
                            <TableCell>{delivery.amountPaid}</TableCell>
                            <TableCell>{delivery.remainingAmount}</TableCell>
                            <TableCell>{delivery.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default DeliveryCard;

