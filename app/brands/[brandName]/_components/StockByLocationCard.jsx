"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Warehouse } from "lucide-react"; // For the warehouse icon

const StockByLocationCard = ({ locations }) => {
  const totalStock = locations.reduce((acc, location) => {
    return acc + location.inventoryReport.totalStock;
  }, 0);

  const locationData = locations.map((location) => ({
    name: location.locationName,
    stock: location.inventoryReport.totalStock,
    percentage: (location.inventoryReport.totalStock / totalStock) * 100,
    color: "bg-gray-500", // You can customize the color based on your preference
  }));

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Warehouse className="w-5 h-5 text-gray-600" />
          Stock by Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {locationData.map((location, index) => (
            <li key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${location.color}`}
                    title={`${location.name}`}
                  ></span>
                  <span className="text-sm text-gray-700">{location.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {location.stock} units
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-full rounded-full ${location.color}`}
                  style={{ width: `${location.percentage}%` }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        Data updated 5 mins ago
      </CardFooter>
    </Card>
  );
};

export default StockByLocationCard;
