"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@/components/ui/Pagination";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TruncatedText from "@/components/ui/TruncatedText";
import { useRouter } from "next/navigation";

const ProductsPage = () => {
  const router = useRouter();

  // Data states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(25);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch product data and format null/empty values as "N/A"
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(
          "http://192.168.0.5:5005/api/products"
        );
        const formattedProducts = response.data.data.map((prod) => ({
          ...prod,
          id: prod.id === null || prod.id === "" ? "N/A" : prod.id,
          name: prod.name === null || prod.name === "" ? "N/A" : prod.name,
          code: prod.code === null || prod.code === "" ? "N/A" : prod.code,
          hsnCode:
            prod.hsnCode === null || prod.hsnCode === "" ? "N/A" : prod.hsnCode,
          price: prod.price === null || prod.price === "" ? "N/A" : prod.price,
          type: prod.type === null || prod.type === "" ? "N/A" : prod.type,
          brandId:
            prod.brandId === null || prod.brandId === "" ? "N/A" : prod.brandId,
          locationId:
            prod.locationId === null || prod.locationId === ""
              ? "N/A"
              : prod.locationId,
          moq: prod.moq === null || prod.moq === "" ? "N/A" : prod.moq,
          partName:
            prod.partName === null || prod.partName === ""
              ? "N/A"
              : prod.partName,
          availableInventory:
            prod.availableInventory === null || prod.availableInventory === ""
              ? "N/A"
              : prod.availableInventory,
          sudoInventory:
            prod.sudoInventory === null || prod.sudoInventory === ""
              ? "N/A"
              : prod.sudoInventory,
          uom: prod.uom === null || prod.uom === "" ? "N/A" : prod.uom,
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter((prod) => {
    return (
      prod.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.hsnCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // No additional sorting in this version
  const sortedProducts = [...filteredProducts];

  // Slice for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:px-4 lg:py-6 max-w-6xl mx-auto">
      {/* Header with back arrow, title, and "Create Product" button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold ml-2">Products</h1>
        </div>
        <Button
          onClick={() => router.push("./create-product")}
          >
          Create Product
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="Search by ID, Name, Code, HSN Code, Price, Type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-6xl"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="text-center font-bold">ID</TableCell>
            <TableCell className="text-center font-bold">Name</TableCell>
            <TableCell className="text-center font-bold">Code</TableCell>
            <TableCell className="text-center font-bold">HSN Code</TableCell>
            <TableCell className="text-center font-bold">Price</TableCell>
            {/* <TableCell className="text-center font-bold">Type</TableCell> */}
            <TableCell className="text-center font-bold">Brand ID</TableCell>
            <TableCell className="text-center font-bold">Location ID</TableCell>
            <TableCell className="text-center font-bold">MOQ</TableCell>
            {/* <TableCell className="text-center font-bold">Part Name</TableCell> */}
            <TableCell className="text-center font-bold">Avail Inv</TableCell>
            <TableCell className="text-center font-bold">Sudo Inv</TableCell>
            <TableCell className="text-center font-bold">UOM</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentProducts.map((product, index) => (
            <TableRow key={index} className="hover:bg-gray-100">
              <TableCell className="text-center">
                <TruncatedText text={product.id} width="100px" />
              </TableCell>
              <TableCell className="text-left pl-6">
                <TruncatedText text={product.name} width="150px" />
              </TableCell>
              <TableCell className="text-center">
                <TruncatedText text={product.code} width="120px" />
              </TableCell>
              <TableCell className="text-center">
                <TruncatedText text={product.hsnCode} width="120px" />
              </TableCell>
              <TableCell className="text-center">
                <TruncatedText text={product.price} width="100px" />
              </TableCell>
              {/* <TableCell className="text-center">
                <TruncatedText text={product.type} width="120px" />
              </TableCell> */}
              <TableCell className="text-center">
                <TruncatedText text={product.brandId} width="100px" />
              </TableCell>
              <TableCell className="text-center">
                <TruncatedText text={product.locationId} width="100px" />
              </TableCell>
              <TableCell className="text-center">
                <TruncatedText text={product.moq} width="100px" />
              </TableCell>
              {/* <TableCell className="text-center">
                <TruncatedText text={product.partName} width="150px" />
              </TableCell> */}
              <TableCell className="text-center">
                <TruncatedText text={product.availableInventory} width="100px" />
              </TableCell>
              <TableCell className="text-center">
                <TruncatedText text={product.sudoInventory} width="100px" />
              </TableCell>
              <TableCell className="text-center">
                <TruncatedText text={product.uom} width="100px" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
        <Pagination
          totalPosts={sortedProducts.length}
          postsPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
