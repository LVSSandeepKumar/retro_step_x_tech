"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useSidebarContext } from "@/context/SidebarContext";
import { useState } from "react";
import { ArrowDown } from "lucide-react";

const brands = ["Bajaj", "Triumph", "Vespa", "Tata"];

const Sidebar = () => {
  const pathname = usePathname();
  const currentBrand = pathname.split("/")[2];
  const locationName = pathname.split("/")[4];
  const subLocationName = pathname.split("/")[6];
  const decodedSubLocationName = decodeURIComponent(subLocationName);
  const { showSidebar } = useSidebarContext();
  const [isBillsOpen, setIsBillsOpen] = useState(false);

  const currentPage = pathname.split("/")[7];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen sticky top-0 p-4">
      <Link href="/" className="text-lg font-bold">
        Retro_App
      </Link>

      <Separator className="my-4" />
      <h2 className="text-md font-semibold my-4">Brands</h2>
      <ul className="space-y-2">
        {brands.map((brand) => (
          <li key={brand}>
            <Link href={`/brands/${brand}`}>
              <span
                className={`block p-2 rounded ${
                  currentBrand === brand ? "bg-gray-600" : "hover:bg-gray-700"
                }`}
              >
                {brand}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {showSidebar && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold my-4">
            {decodedSubLocationName} Details
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
