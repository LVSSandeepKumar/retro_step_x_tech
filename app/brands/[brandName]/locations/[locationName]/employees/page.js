"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, ArrowLeft, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PickAName } from "@/lib/utils";
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

const EmployeesPage = () => {
  const router = useRouter();
  const { brandName, locationName, sublocationName } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "targets",
    direction: "descending",
  });
  const [data, setData] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  useEffect(() => {
    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const mockEmployees = [
      {
        employeeID: `EMP-${generateRandomNumber(1, 99)}`,
        role: "Manager",
        name: PickAName(),
        mobileNo: generateRandomNumber(9000000000, 9999999999),
        email: `${PickAName()}@email.com`,
        status: "Active",
        department: "Sales",
        designations: "Sales Manager",
        targets: "N/A",
        achieved: "N/A",
        salary: `₹${generateRandomNumber(30, 35)},000`,
      },
      {
        employeeID: `EMP-${generateRandomNumber(1, 99)}`,
        role: "Manager",
        name: PickAName(),
        mobileNo: generateRandomNumber(9000000000, 9999999999),
        email: `${PickAName()}@email.com`,
        status: "Active",
        department: "Sales",
        designations: "Sales Manager",
        targets: "N/A",
        achieved: "N/A",
        salary: `₹${generateRandomNumber(30, 35)},000`,
      },
      {
        employeeID: `EMP-${generateRandomNumber(1, 99)}`,
        role: "Sales Person",
        name: PickAName(),
        mobileNo: generateRandomNumber(9000000000, 9999999999),
        email: `${PickAName()}@email.com`,
        status: "Active",
        department: "Sales",
        designations: "Sales Person",
        targets: `₹${generateRandomNumber(20, 25)},000`,
        achieved: `₹${generateRandomNumber(15, 20)},000`,
        salary: `₹${generateRandomNumber(30, 35)},000`,
      },
      {
        employeeID: `EMP-${generateRandomNumber(1, 99)}`,
        role: "Sales Person",
        name: PickAName(),
        mobileNo: generateRandomNumber(9000000000, 9999999999),
        email: `${PickAName()}@email.com`,
        status: "Active",
        department: "Sales",
        designations: "Sales Person",
        targets: `₹${generateRandomNumber(20, 25)},000`,
        achieved: `₹${generateRandomNumber(15, 20)},000`,
        salary: `₹${generateRandomNumber(20, 25)},000`,
      },
    ];
    setData(mockEmployees);
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.employeeID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.designations.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleEditClick = (employee) => {
    setCurrentEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setIsEditDialogOpen(false);
    // Update the employee data here
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setIsAddDialogOpen(false);
    // Add the new employee data here
  };

  return (
    <div className="p-4 md:p-6 lg:px-4 lg:py-6">
      <div className="flex items-center mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-semibold">Employees</h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="Search by Employee ID, Name, Role, Department, Designations"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-6xl"
        />
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Employee</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Employee</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new employee.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee ID
                </label>
                <Input
                  type="text"
                  name="employeeID"
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <Input type="text" name="role" className="mt-1 block w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input type="text" name="name" className="mt-1 block w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile No.
                </label>
                <Input
                  type="text"
                  name="mobileNo"
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input type="text" name="email" className="mt-1 block w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <Input
                  type="text"
                  name="status"
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <Input
                  type="text"
                  name="department"
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Designations
                </label>
                <Input
                  type="text"
                  name="designations"
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Targets
                </label>
                <Input
                  type="text"
                  name="targets"
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Achieved
                </label>
                <Input
                  type="text"
                  name="achieved"
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <Input
                  type="text"
                  name="salary"
                  className="mt-1 block w-full"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Employee ID</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Mobile No.</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Designations</TableCell>
            <TableCell onClick={() => requestSort("targets")}>
              <span className="ml-2 flex items-center gap-2">
                Targets
                <ArrowDownUp className="size-4" />
              </span>
            </TableCell>
            <TableCell onClick={() => requestSort("achieved")}>
              <span className="ml-2 flex items-center gap-2">
                Achieved
                <ArrowDownUp className="size-4" />
              </span>
            </TableCell>
            <TableCell onClick={() => requestSort("salary")}>
              <span className="ml-2 flex items-center gap-2">
                Salary
                <ArrowDownUp className="size-4" />
              </span>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.employeeID}</TableCell>
              <TableCell>{item.role}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.mobileNo}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.department}</TableCell>
              <TableCell>{item.designations}</TableCell>
              <TableCell>{item.targets}</TableCell>
              <TableCell>{item.achieved}</TableCell>
              <TableCell>{item.salary}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleEditClick(item)}
                >
                  <Edit className="size-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {currentEmployee && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>
                Edit the details of the employee.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleEditSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee ID
                </label>
                <Input
                  type="text"
                  name="employeeID"
                  defaultValue={currentEmployee.employeeID}
                  className="mt-1 block w-full"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <Input
                  type="text"
                  name="role"
                  defaultValue={currentEmployee.role}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  defaultValue={currentEmployee.name}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile No.
                </label>
                <Input
                  type="text"
                  name="mobileNo"
                  defaultValue={currentEmployee.mobileNo}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="text"
                  name="email"
                  defaultValue={currentEmployee.email}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <Input
                  type="text"
                  name="status"
                  defaultValue={currentEmployee.status}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <Input
                  type="text"
                  name="department"
                  defaultValue={currentEmployee.department}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Designations
                </label>
                <Input
                  type="text"
                  name="designations"
                  defaultValue={currentEmployee.designations}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Targets
                </label>
                <Input
                  type="text"
                  name="targets"
                  defaultValue={currentEmployee.targets}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Achieved
                </label>
                <Input
                  type="text"
                  name="achieved"
                  defaultValue={currentEmployee.achieved}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <Input
                  type="text"
                  name="salary"
                  defaultValue={currentEmployee.salary}
                  className="mt-1 block w-full"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmployeesPage;
