"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the data from your API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://192.168.0.3:5001/api/customers"
        );
        console.log("API Response:", response); // Inspect the full response in console

        // If your API returns an array of objects, use response.data directly.
        // If your API structure is { data: { ... } }, adjust accordingly.
        const data = response.data.data || response.data;

        // If data is a single object, wrap it in an array for table rendering
        // (In case your API returns a single object like the example in your image)
        const customersArray = Array.isArray(data) ? data : [data];

        setCustomers(customersArray);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "1rem" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1rem" }}>
        <h1>Customers</h1>
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div className="flex items-center">
        <Button
          onClick={() => window.history.back()}
          variant="ghost"
          className="p-2 hover:bg-gray-100 font-bold rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        {/* <h1 className="text-2xl font-semibold ml-2">Products</h1> */}
        <h1 className="font-semibold ml-2 text-2xl">Customers</h1>
      </div>
      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Identification Number</th>
              <th>Phone</th>
              <th>Credit Limit</th>
              <th>Status</th>
              <th>Address</th>
              <th>Email</th>
              <th>Owner From</th>
              <th>Owner Until</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.identificationNumber}</td>
                <td>{customer.phone}</td>
                <td>{customer.creditLimit}</td>
                <td>{customer.status}</td>
                <td>{customer.address ?? "N/A"}</td>
                <td>{customer.email ?? "N/A"}</td>
                <td>{customer.ownerFrom ?? "N/A"}</td>
                <td>{customer.ownerUntil ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        th,
        td {
          border: 1px solid #ccc;
          padding: 0.75rem;
          text-align: left;
        }
        th {
          background-color: #f9f9f9;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        @media (max-width: 600px) {
          table,
          thead,
          tbody,
          th,
          td,
          tr {
            display: block;
            width: 100%;
          }
          thead tr {
            display: none;
          }
          td {
            border: none;
            padding: 0.5rem 0;
          }
          td:before {
            content: attr(data-label);
            font-weight: bold;
            display: inline-block;
            width: 120px;
          }
        }
      `}</style>
    </div>
  );
}
