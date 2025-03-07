"use client";
import { useRouter } from "next/navigation"; // Add this import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSidebarContext } from "@/context/SidebarContext";
import { brandsData, locations as locationData } from "@/lib/constants";
import { pickABrand } from "@/lib/utils";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import AddJobCardPage from "@/components/AddJobCardPage"; // Adjust the path based on your project structure

const Sidebar = () => {
  const router = useRouter(); // Add this line
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentBrand = pathname.split("/")[2];
  const locationName = pathname.split("/")[4];
  const subLocationName = pathname.split("/")[6];
  const decodedSubLocationName = decodeURIComponent(subLocationName);
  const currentPage = pathname.split("/")[7];

  const [isExpensesOpen, setIsExpensesOpen] = useState(false);
  const [isMasterOpen, setIsMasterOpen] = useState(false); // Add this state
  const [brandSearch, setBrandSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [isAddJobCardVisible, setIsAddJobCardVisible] = useState(false); // Add this state

  const { showLocationDetails, setShowLocationDetails } = useSidebarContext();

  // Check if we're in a location route or deeper
  useEffect(() => {
    const pathParts = pathname.split("/");
    const isLocationRoute =
      pathParts.length >= 4 && pathParts[3] === "locations";
    setShowLocationDetails(isLocationRoute);
  }, [pathname, setShowLocationDetails]);

  // Get brands from brandsData
  const brands = brandsData.map((brand) => brand.brandName);

  // Get locations from locationData
  const locationGroups = {
    own: locationData.find((loc) => loc.type === "own")?.cities || [],
    sub: locationData.find((loc) => loc.type === "sub")?.cities || [],
  };

  // Filter data based on search
  const filteredBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredLocations = {
    own: locationGroups.own.filter((loc) =>
      loc.toLowerCase().includes(locationSearch.toLowerCase())
    ),
    sub: locationGroups.sub.filter((loc) =>
      loc.toLowerCase().includes(locationSearch.toLowerCase())
    ),
  };

  const handleSearch = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "brand") {
      setBrandSearch(e.target.value);
    } else {
      setLocationSearch(e.target.value);
    }
  };

  const handleItemClick = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(path);
    if (path.includes("/brands/")) {
      setIsBrandsOpen(false);
    } else {
      setIsLocationsOpen(false);
    }
  };

  const handleSearchClick = (e) => {
    e.stopPropagation();
  };

  const handleAddJobCardClick = () => {
    setIsAddJobCardVisible(true);
  };

  const handleSaveJobCard = (newJobCard) => {
    // Save the new job card data
    // ...existing code to save data...
    setIsAddJobCardVisible(false);
  };

  const handleCancelJobCard = () => {
    setIsAddJobCardVisible(false);
  };

  const toggleSubSidebar = (sidebar) => {
    if (sidebar === "expenses") {
      setIsExpensesOpen(!isExpensesOpen);
      setIsMasterOpen(false);
    }
    if (sidebar === "master") {
      setIsMasterOpen(!isMasterOpen);
      setIsExpensesOpen(false);
    }
  };

  return (
    <div
      className={`bg-gray-800 text-white h-screen sticky top-0 p-4 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo section */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/">
          <h2 className="text-md font-semibold">Tirumala Enterprises</h2>
        </Link>
      </div>
      <Separator className="my-4" />

      {!isCollapsed && (
        <>
          {/* Modified Brands Dropdown */}
          <DropdownMenu
            open={isBrandsOpen}
            onOpenChange={setIsBrandsOpen}
            modal={false}
          >
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-center justify-between p-2 hover:bg-gray-700 rounded">
                <h2 className="text-md font-semibold">Brands</h2>
                {isBrandsOpen ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-gray-700 text-white"
              onCloseAutoFocus={(e) => e.preventDefault()}
              onInteractOutside={(e) => e.preventDefault()}
            >
              <div className="p-2 sticky top-0 bg-gray-700 border-b border-gray-600">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search brands..."
                    value={brandSearch}
                    onChange={(e) => handleSearch(e, "brand")}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="pl-8 bg-gray-600 border-gray-600 text-white"
                  />
                </div>
              </div>
              <ScrollArea className="h-[200px]">
                {filteredBrands.map((brand) => (
                  <DropdownMenuItem
                    key={brand}
                    className={`${currentBrand === brand ? "bg-gray-600" : ""}`}
                    onSelect={(e) => e.preventDefault()}
                    onClick={(e) => handleItemClick(e, `/brands/${brand}`)}
                  >
                    {brand}
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Modified Locations Dropdown */}
          <DropdownMenu
            open={isLocationsOpen}
            onOpenChange={setIsLocationsOpen}
            modal={false}
          >
            <DropdownMenuTrigger className="w-full mt-8">
              <div className="flex items-center justify-between p-2 hover:bg-gray-700 rounded">
                <h2 className="text-md font-semibold">Locations</h2>
                {isLocationsOpen ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-gray-700 text-white"
              onCloseAutoFocus={(e) => e.preventDefault()}
              onInteractOutside={(e) => e.preventDefault()}
            >
              <div className="p-2 sticky top-0 bg-gray-700 border-b border-gray-600">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search locations..."
                    value={locationSearch}
                    onChange={(e) => handleSearch(e, "location")}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="pl-8 bg-gray-600 border-gray-600 text-white"
                  />
                </div>
              </div>
              <ScrollArea className="h-[300px]">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="font-semibold sticky top-0 bg-gray-700 z-10">
                    Own Locations
                  </DropdownMenuItem>
                  {filteredLocations.own.map((location) => (
                    <DropdownMenuItem key={location}>
                      <Link
                        href={`/brands/${pickABrand()}/locations/${locationName}`}
                        className="w-full"
                      >
                        {location}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="font-semibold sticky top-0 bg-gray-700 z-10">
                    Sub Locations
                  </DropdownMenuItem>
                  {filteredLocations.sub.map((location) => (
                    <DropdownMenuItem key={location}>
                      <Link
                        href={`/brands/${pickABrand()}/locations/${locationName}`}
                        className="w-full"
                      >
                        {location}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}

      {/* sidebar content only from brand level and below */}
      {showLocationDetails && (
        <div className="flex flex-col gap-4 mt-6 border-t pt-6">
          <h1 className="text-lg font-semibold">{locationName} Details</h1>

          <ul className="space-y-2">
            <li>
              <button
                className="block w-full text-left p-2 rounded hover:bg-gray-700"
                onClick={() => toggleSubSidebar("expenses")}
              >
                <span className="flex items-center justify-between gap-2">
                  Expenses{" "}
                  {isExpensesOpen ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </span>
              </button>
              {isExpensesOpen && (
                <ul className="pl-4 space-y-2">
                  <li
                    className={`block p-2 rounded ${
                      currentPage === "vouchers"
                        ? "bg-gray-600"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <Link
                      href={`/brands/${currentBrand}/locations/${locationName}/expenses/vouchers`}
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
                      href={`/brands/${currentBrand}/locations/${locationName}/expenses/marketing`}
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
                href={`/brands/${currentBrand}/locations/${locationName}/employees`}
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
                href={`/brands/${currentBrand}/locations/${locationName}/visits`}
              >
                Visits
              </Link>
            </li>
            <li
              className={`block p-2 rounded ${
                currentPage === "visits" ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
            >
              <Link
                href={`/brands/${currentBrand}/locations/${locationName}/create_sale`}
              >
                Create Sale
              </Link>
            </li>
            <li
              className={`block p-2 rounded ${
                currentPage === "visits" ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
            >
              <Link
                href={`/brands/${currentBrand}/locations/${locationName}/job-card`}
              >
                Job Card
              </Link>
            </li>

            <li
              className={`block p-2 rounded ${
                currentPage === "visits" ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
            >
              <ul className="space-y-2">
                <button
                  className="block w-full text-left  rounded hover:bg-gray-700"
                  onClick={() => toggleSubSidebar("master")}
                >
                  <span className="flex items-center justify-between gap-2">
                    Master{" "}
                    {isMasterOpen ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </span>
                </button>
                {isMasterOpen && (
                  <ul className="pl-4 space-y-2">
                    <li
                      className={`block p-2 rounded ${
                        currentPage === "product"
                          ? "bg-gray-600"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <Link
                        href={`/brands/${currentBrand}/locations/${locationName}/master/product`}
                      >
                        Products
                      </Link>
                    </li>
                    <li
                      className={`block p-2 rounded ${
                        currentPage === "customer"
                          ? "bg-gray-600"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <Link
                        href={`/brands/${currentBrand}/locations/${locationName}/master/customer`}
                      >
                        Customer
                      </Link>
                    </li>
                  </ul>
                )}
              </ul>
            </li>

            <li
              className={`block p-2 rounded ${
                currentPage === "visits" ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
            >
              <Link href="/OSJ">OSJ</Link>
            </li>
          </ul>
        </div>
      )}

      {isAddJobCardVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <AddJobCardPage
            onSave={handleSaveJobCard}
            onCancel={handleCancelJobCard}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
