"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products from the API on component mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`http://192.168.0.11:5005/api/products`);
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Master Product Page</h1>

{/* If Condition */}
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products?.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              {/* Product Name in Bold */}
              <h2 className="text-xl font-bold mb-2">{product.name}</h2>
              {/* Product Description */}
              <p className="mb-2">{product.description}</p>
              {/* Product Price */}
              <p className="font-semibold mb-2">${product.price}</p>
              {/* Optional: Product Image */}
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
              )}
            </div>
          ))}
        </div>
        )
      } 
    </div>
  );
};

export default product;
