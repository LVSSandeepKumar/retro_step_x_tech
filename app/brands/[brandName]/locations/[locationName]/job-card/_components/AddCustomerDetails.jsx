import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const AddCustomerDetails = ({ newJobCard, handleInputChange, handleCancel, handleInputSave }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0, transform: "scale(0.9)" }}
      animate={{ opacity: 1, transform: "scale(1)" }}
      transition={{ duration: 0.3, ease: "easeIn" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-4/5 max-w-4xl">
        <div className="grid grid-cols-2 gap-5">
          <h3 className="col-span-2 text-xl font-semibold mt-4 text-center">
            Add Customer Details
          </h3>
          <input
            type="text"
            name="name"
            value={newJobCard.name}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Name"
          />
          <input
            type="text"
            name="mobileNo"
            value={newJobCard.mobileNo}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Mobile No"
          />
          <input
            type="text"
            name="address"
            value={newJobCard.address}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Address"
          />
          <input
            type="email"
            name="email"
            value={newJobCard.email}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Email"
          />
          <h3 className="col-span-2 text-xl font-semibold mt-4 text-center">
            Add Vehicle Details
          </h3>
          <input
            type="text"
            name="brand"
            value={newJobCard.brand}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Brand"
          />
          <input
            type="text"
            name="modelNo"
            value={newJobCard.modelNo}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Model No"
          />
          <input
            type="text"
            name="yearOfManufacture"
            value={newJobCard.yearOfManufacture}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Year of Manufacture"
          />
          <input
            type="text"
            name="engineNo"
            value={newJobCard.engineNo}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Engine No"
          />
          <input
            type="text"
            name="chassisNo"
            value={newJobCard.chassisNo}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Chassis No"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleCancel}
            className="bg-red-500 text-white mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleInputSave}
            className="bg-blue-500 text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddCustomerDetails;
