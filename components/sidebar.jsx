"use client";
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
import { ArrowDown, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentBrand = pathname.split("/")[2];
  const locationName = pathname.split("/")[4];
  const subLocationName = pathname.split("/")[6];
  const decodedSubLocationName = decodeURIComponent(subLocationName);
  const { showSidebar } = useSidebarContext();
  const [isBillsOpen, setIsBillsOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);

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

  // ...rest of your existing code for newBrand state and handlers...

  return (
    <div
      className={`bg-gray-800 text-white h-screen sticky top-0 p-4 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* ...existing header... */}

      <div className="flex items-center justify-between mb-4">
        <Link href="/">
          <h2 className="text-md font-semibold">Retro App</h2>
        </Link>
      </div>
      <Separator className="my-4" />

      {!isCollapsed && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-md font-semibold">Brands</h2>
            {/* ...existing Dialog component... */}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search brands..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="pl-8 bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <DropdownMenu open={isBrandsOpen} onOpenChange={setIsBrandsOpen}>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span>Select Brand</span>
                <ArrowDown className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-700 text-white">
              {filteredBrands.map((brand) => (
                <DropdownMenuItem
                  key={brand}
                  className={`${currentBrand === brand ? "bg-gray-600" : ""}`}
                >
                  <Link href={`/brands/${brand}`} className="w-full">
                    {brand}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mt-8">
            <h2 className="text-md font-semibold mb-4">Locations</h2>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search locations..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="pl-8 bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <DropdownMenu
              open={isLocationsOpen}
              onOpenChange={setIsLocationsOpen}
            >
              <DropdownMenuTrigger className="w-full">
                <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <span>Select Location</span>
                  <ArrowDown className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-700 text-white">
                <ScrollArea className="h-[300px]">
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="font-semibold sticky top-0 bg-gray-700 z-10">
                      Own Locations
                    </DropdownMenuItem>
                    {filteredLocations.own.map((location) => (
                      <DropdownMenuItem key={location}>
                        <Link
                          href={`/brands/${pickABrand()}/locations/${location}`}
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
                          href={`/brands/${pickABrand()}/locations/${location}`}
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
          </div>
        </>
      )}

      {/* ...rest of the existing sidebar content... */}
    </div>
  );
};

export default Sidebar;
