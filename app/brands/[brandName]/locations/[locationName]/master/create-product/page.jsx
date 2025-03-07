"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CreateProduct = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    hsnCode: "",
    price: 0,
    type: "",
    brandId: "",
    locationId: "",
    moq: 0,
    uom: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for locations and toggling the dropdown for the location field
  const [locations, setLocations] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Create a ref for the dropdown container
  const dropdownRef = useRef(null);

  const fields = [
    { name: "name", label: "Name", required: true },
    { name: "code", label: "Code", required: true },
    { name: "hsnCode", label: "HSN Code", required: true },
    { name: "price", label: "Price", required: true, type: "number" },
    { name: "type", label: "Type", required: true },
    { name: "brandId", label: "Brand ID", required: true },
    { name: "locationId", label: "Location", required: true },
    { name: "moq", label: "MOQ", required: true, type: "number" },
    { name: "uom", label: "UOM", required: true },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get("http://192.168.0.3:5002/api/locations");
      setLocations(response.data.data);
      console.log("Locations fetched:", response.data.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  const validateForm = () => {
    for (const field of fields) {
      const value = formData[field.name];
      if (field.required && !value) {
        setError(`${field.label} is required.`);
        return false;
      }
      if (field.type === "number" && isNaN(value)) {
        setError(`${field.label} must be a valid number.`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://192.168.0.3:5005/api/product",
        formData
      );
      console.log("Product created:", response.data);
      // Optionally, redirect or reset form here if needed.
    } catch (err) {
      console.error("Error creating product:", err);
      setError("Error creating product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Find the selected location based on formData.locationId.
  // We convert the location id from API to string for comparison.
  const selectedLocation = locations.find(
    (loc) => String(loc.id) === formData.locationId
  );

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 md:p-6 lg:px-4 lg:py-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Product</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.name === "locationId" ? (
              <div className="relative" ref={dropdownRef}>
                <Input
                  type="text"
                  name="locationId"
                  value={selectedLocation ? selectedLocation.name : ""}
                  placeholder="Click to select location"
                  onFocus={() => {
                    fetchLocations();
                    setShowLocationDropdown(true);
                  }}
                  readOnly
                  required={field.required}
                  className="mt-1 block w-full cursor-pointer"
                />
                {showLocationDropdown && (
                  <select
                    name="locationId"
                    value={formData.locationId}
                    onChange={(e) => {
                      handleChange(e);
                      setShowLocationDropdown(false);
                    }}
                    onBlur={() => setShowLocationDropdown(false)}
                    required={field.required}
                    className="absolute top-full left-0 mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white z-10"
                    size="5"
                  >
                    <option value="">Select a location</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              <Input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                className="mt-1 block w-full"
              />
            )}
          </div>
        ))}
        <div className="col-span-3 flex justify-center">
          <Button type="submit" disabled={loading} className="mt-4">
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
