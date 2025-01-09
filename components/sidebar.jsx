"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useSidebarContext } from "@/context/SidebarContext";
import { useState } from "react";
import { ArrowDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const brands = ["Bajaj", "Triumph", "Vespa", "Tata"];

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentBrand = pathname.split("/")[2];
  const locationName = pathname.split("/")[4];
  const subLocationName = pathname.split("/")[6];
  const decodedSubLocationName = decodeURIComponent(subLocationName);
  const { showSidebar } = useSidebarContext();
  const [isBillsOpen, setIsBillsOpen] = useState(false);
  const [newBrand, setNewBrand] = useState({
    brandName: "",
    salesDetails: { totalSales: "", topProduct: "", growthRate: "" },
    inventoryReport: { totalStock: "" },
    operationalExpenses: { annual: "" },
    targetsAndAchieved: { annualTarget: "", achieved: "" },
    headOfBrand: "",
  });

  const currentPage = pathname.split("/")[7];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBrand((prev) => {
      const keys = name.split(".");
      if (keys.length > 1) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value,
          },
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = () => {
    // Handle brand creation here
    console.log('New brand:', newBrand);
    // Reset form
    setNewBrand({
      brandName: "",
      salesDetails: { totalSales: "", topProduct: "", growthRate: "" },
      inventoryReport: { totalStock: "" },
      operationalExpenses: { annual: "" },
      targetsAndAchieved: { annualTarget: "", achieved: "" },
      headOfBrand: "",
    });
  };

  return (
    <div 
      className={`bg-gray-800 text-white h-screen sticky top-0 p-4 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && <Link href="/" className="text-lg font-bold">Retro_App</Link>}
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-700 rounded"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <Separator className="my-4" />
      
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && <h2 className="text-md font-semibold">Brands</h2>}
        <Dialog>
          <DialogTrigger asChild>
            <button
              className={`flex items-center gap-2 p-2 hover:bg-gray-700 rounded transition-colors ${
                isCollapsed ? 'justify-center w-full' : 'text-sm'
              }`}
              title="Add Brand"
            >
              {isCollapsed ? (
                <Plus className="h-5 w-5" />
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Brand
                </>
              )}
            </button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Create New Brand</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new brand.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                name="brandName"
                placeholder="Brand Name"
                value={newBrand.brandName}
                onChange={handleInputChange}
              />
              <Input
                name="salesDetails.totalSales"
                placeholder="Total Sales"
                value={newBrand.salesDetails.totalSales}
                onChange={handleInputChange}
              />
              <Input
                name="inventoryReport.totalStock"
                placeholder="Total Stock"
                value={newBrand.inventoryReport.totalStock}
                onChange={handleInputChange}
              />
              <Input
                name="operationalExpenses.annual"
                placeholder="Annual Expenses"
                value={newBrand.operationalExpenses.annual}
                onChange={handleInputChange}
              />
              <Input
                name="targetsAndAchieved.annualTarget"
                placeholder="Annual Target"
                value={newBrand.targetsAndAchieved.annualTarget}
                onChange={handleInputChange}
              />
              <Input
                name="targetsAndAchieved.achieved"
                placeholder="Achieved"
                value={newBrand.targetsAndAchieved.achieved}
                onChange={handleInputChange}
              />
              <Input
                name="headOfBrand"
                placeholder="Head of Brand"
                value={newBrand.headOfBrand}
                onChange={handleInputChange}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleSubmit}>Submit</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ul className="space-y-2">
        {brands.map((brand) => (
          <li key={brand}>
            <Link href={`/brands/${brand}`}>
              <span
                className={`block p-2 rounded ${
                  currentBrand === brand ? "bg-gray-600" : "hover:bg-gray-700"
                } ${isCollapsed ? 'text-center' : ''}`}
                title={isCollapsed ? brand : ''}
              >
                {isCollapsed ? brand.charAt(0) : brand}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {showSidebar && !isCollapsed && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold my-4">
            {decodedSubLocationName === "undefined" ? "": decodedSubLocationName} Details
          </h2>
          <ul className="space-y-2">
            <li>
              <button
                className="block w-full text-left p-2 rounded hover:bg-gray-700"
                onClick={() => setIsBillsOpen(!isBillsOpen)}
              >
                <span className="flex items-center justify-between gap-2">
                  Bills <ArrowDown className="size-4" />
                </span>
              </button>
              {isBillsOpen && (
                <ul className="pl-4 space-y-2">
                  <li
                    className={`block p-2 rounded ${
                      currentPage === "vouchers"
                        ? "bg-gray-600"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <Link
                      href={`/brands/${currentBrand}/locations/${locationName}/sublocations/${subLocationName}/bills/vouchers`}
                    >
                      Vouchers
                    </Link>
                  </li>
                  <li
                    className={`block p-2 rounded ${
                      currentPage === "marketing"
                        ? "bg-gray-600"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <Link
                      href={`/brands/${currentBrand}/locations/${locationName}/sublocations/${subLocationName}/bills/marketing`}
                    >
                      Marketing
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li
              className={`block p-2 rounded ${
                currentPage === "employees"
                  ? "bg-gray-600"
                  : "hover:bg-gray-700"
              }`}
            >
              <Link
                href={`/brands/${currentBrand}/locations/${locationName}/sublocations/${subLocationName}/employees`}
              >
                Employees
              </Link>
            </li>
            <li
              className={`block p-2 rounded ${
                currentPage === "visits" ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
            >
              <Link
                href={`/brands/${currentBrand}/locations/${locationName}/sublocations/${subLocationName}/visits`}
              >
                Visits
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
