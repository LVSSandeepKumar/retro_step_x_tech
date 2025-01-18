import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { Label } from "@/components/ui/label";

const BikesSalesForm = () => {
    const [bikes] = useState([
        {
            "model": "Honda CBR",
            "variants": [
                {
                    "customerName": "Rajesh Kumar",
                    "kmReading": 15000,
                    "color": "Red",
                    "purchasePrice": 85000,
                    "salePrice": 95000,
                    "insurance": "Valid till Dec 2025"
                },
                {
                    "customerName": "Amit Patel",
                    "kmReading": 12000,
                    "color": "Black",
                    "purchasePrice": 82000,
                    "salePrice": 90000,
                    "insurance": "Valid till Mar 2025"
                }
            ]
        },

        {
            "model": "Royal Enfield Classic",
            "variants": [
                {
                    "customerName": "Suresh Mehta",
                    "kmReading": 15000,
                    "color": "Black",
                    "purchasePrice": 85000,
                    "salePrice": 950000,
                    "insurance": "Valid till Jun 2025"
                },
                {
                    "customerName": "Suresh Mehta",
                    "kmReading": 6000,
                    "color": "Red",
                    "purchasePrice": 90000,
                    "salePrice": 110000,
                    "insurance": "Valid till Jun 2025"
                },
                {
                    "customerName": "Suresh Mehta",
                    "kmReading": 8000,
                    "color": "Red",
                    "purchasePrice": 95000,
                    "salePrice": 110000,
                    "insurance": "Valid till Jun 2025"
                }
            ]
        },
        {
            "model": "KTM Duke 390",
            "variants": [
                {
                    "customerName": "Vikram Singh",
                    "kmReading": 10000,
                    "color": "Orange",
                    "purchasePrice": 200000,
                    "salePrice": 215000,
                    "insurance": "Valid till Jan 2026"
                },
                {
                    "customerName": "Anil Kapoor",
                    "kmReading": 5000,
                    "color": "White",
                    "purchasePrice": 210000,
                    "salePrice": 230000,
                    "insurance": "Valid till Nov 2025"
                }
            ]
        },
        {
            "model": "Yamaha R15",
            "variants": [
                {
                    "customerName": "Ravi Sharma",
                    "kmReading": 7000,
                    "color": "Blue",
                    "purchasePrice": 120000,
                    "salePrice": 130000,
                    "insurance": "Valid till Sep 2025"
                }
            ]
        },
        {
            "model": "Bajaj Pulsar NS200",
            "variants": [
                {
                    "customerName": "Rahul Verma",
                    "kmReading": 14000,
                    "color": "Yellow",
                    "purchasePrice": 105000,
                    "salePrice": 115000,
                    "insurance": "Valid till Apr 2026"
                },
                {
                    "customerName": "Karan Joshi",
                    "kmReading": 11000,
                    "color": "Red",
                    "purchasePrice": 102000,
                    "salePrice": 112000,
                    "insurance": "Valid till Jul 2025"
                }
            ]
        },
        {
            "model": "Suzuki Gixxer SF",
            "variants": [
                {
                    "customerName": "Pooja Yadav",
                    "kmReading": 6000,
                    "color": "Silver",
                    "purchasePrice": 140000,
                    "salePrice": 150000,
                    "insurance": "Valid till Feb 2026"
                }
            ]
        },
        {
            "model": "Hero Xpulse 200",
            "variants": [
                {
                    "customerName": "Deepak Gupta",
                    "kmReading": 3000,
                    "color": "White",
                    "purchasePrice": 130000,
                    "salePrice": 140000,
                    "insurance": "Valid till Aug 2025"
                }
            ]
        },
        {
            "model": "Kawasaki Ninja 300",
            "variants": [
                {
                    "customerName": "Akash Roy",
                    "kmReading": 8000,
                    "color": "Green",
                    "purchasePrice": 270000,
                    "salePrice": 290000,
                    "insurance": "Valid till Dec 2026"
                },
                {
                    "customerName": "Meena Khurana",
                    "kmReading": 4000,
                    "color": "Black",
                    "purchasePrice": 280000,
                    "salePrice": 300000,
                    "insurance": "Valid till Oct 2025"
                }
            ]
        },
        {
            "model": "TVS Apache RTR 160",
            "variants": [
                {
                    "customerName": "Sanjay Kapoor",
                    "kmReading": 9000,
                    "color": "Red",
                    "purchasePrice": 95000,
                    "salePrice": 105000,
                    "insurance": "Valid till Mar 2026"
                }
            ]
        },
        {
            "model": "BMW G310R",
            "variants": [
                {
                    "customerName": "Nidhi Sharma",
                    "kmReading": 2000,
                    "color": "Blue",
                    "purchasePrice": 280000,
                    "salePrice": 300000,
                    "insurance": "Valid till May 2026"
                },
                {
                    "customerName": "Arjun Singh",
                    "kmReading": 1500,
                    "color": "Black",
                    "purchasePrice": 290000,
                    "salePrice": 310000,
                    "insurance": "Valid till Jan 2025"
                }
            ]
        }
    ]
    );

    const [selectedBike, setSelectedBike] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        pincode: '',
        salePrice: '',
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleBikeSelect = (value) => {
        setSelectedBike(value);
    };

    return (
        <div className="">
        
                    {/* Customer Details Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Customer Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Form fields with Label component */}
                            <div className="space-y-2">
                                <div htmlFor="customerName">Customer Name</div>
                                <Input
                                    id="customerName"
                                    name="customerName"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <div htmlFor="phone">Phone Number</div>
                                <Input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <div htmlFor="aadhar">Aadhar Number</div>
                                <Input
                                    id="aadhar"
                                    type="Aadhar"
                                    name="aadhar"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <div htmlFor="address">Address</div>
                                <Input
                                    id="address"
                                    name="address"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <div htmlFor="city">City</div>
                                <Input
                                    id="city"
                                    name="city"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <div htmlFor="pincode">Pincode</div>
                                <Input
                                    id="pincode"
                                    name="pincode"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bike Selection Section */}
                    <div className="mt-6 space-y-4">
                        <h2 className="text-lg font-semibold">Bike Selection</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div>Select Bike Model</div>
                                <Select value={selectedBike} onValueChange={handleBikeSelect}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a bike" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bikes.map((bike, index) => (
                                            <SelectItem key={index} value={bike.model}>
                                                {bike.model}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <div>Select Bike Variant</div>
                                <Select
                                    value={selectedVariant ? JSON.stringify(selectedVariant) : ""}
                                    onValueChange={(value) => setSelectedVariant(JSON.parse(value))}
                                    disabled={!selectedBike}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a variant" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bikes
                                            .find(bike => bike.model === selectedBike)
                                            ?.variants.map((variant, index) => (
                                                <SelectItem key={index} value={JSON.stringify(variant)}>
                                                    {variant.color} - {variant.kmReading}km
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Sale Price Section */}
                    {selectedVariant && (
                        <div className="mt-6 space-y-4">
                            <h2 className="text-lg font-semibold">Price Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div>Purchase Price</div>
                                    <Input
                                        type="text"
                                        value={`₹${selectedVariant.purchasePrice}`}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div>Sale Price</div>
                                    <Input
                                        type="number"
                                        name="salePrice"
                                        value={formData.salePrice}
                                        onChange={handleInputChange}
                                        placeholder="Enter sale price"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Available Bikes Table */}
                    {selectedBike && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold mb-4">Available Bikes</h2>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Previous Owner</TableHead>
                                            <TableHead>KM Reading</TableHead>
                                            <TableHead>Color</TableHead>
                                            <TableHead>Purchase Price</TableHead>
                                            <TableHead>Sale Price</TableHead>
                                            <TableHead>Insurance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bikes
                                            .find(bike => bike.model === selectedBike)
                                            ?.variants.map((variant, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{variant.customerName}</TableCell>
                                                    <TableCell>{variant.kmReading}</TableCell>
                                                    <TableCell>{variant.color}</TableCell>
                                                    <TableCell>₹{variant.purchasePrice}</TableCell>
                                                    <TableCell>₹{variant.salePrice}</TableCell>
                                                    <TableCell>{variant.insurance}</TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
            
        </div>
    );
};

export default BikesSalesForm;