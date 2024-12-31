import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table"; // Assuming shadCN's table components
import { filterProductsByBrandName } from "@/lib/utils";
import { useParams } from "next/navigation";

const BestSellingProductsTable = () => {
  const { brandName } = useParams();
  const products = filterProductsByBrandName(brandName);

  const [randomData, setRandomData] = useState([]);

  useEffect(() => {
    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const data = products.map((product, index) => ({
      ...product,
      sales: index === 0 ? `${generateRandomNumber(10, 25)}` : `${generateRandomNumber(10, 99)}`,
      revenue: index === 0 ? `₹${generateRandomNumber(10, 50)}L` : `₹${generateRandomNumber(10, 99)}K`,
    }));

    setRandomData(data);
  }, [products]);

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Best Selling Products</h2>
        <Button variant="outline" className="flex items-center gap-2">
          Export <span>📥</span>
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell className="text-right">Sales</TableCell>
            <TableCell className="text-right">Revenue</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {randomData.map((product, index) => (
            <TableRow key={index}>
              <TableCell className="flex items-center gap-4">
                {product.icon}
                {product.model}
              </TableCell>
              <TableCell className="text-right">{product.sales}</TableCell>
              <TableCell className="text-right">{product.revenue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  );
};

export default BestSellingProductsTable;
