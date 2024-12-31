"use client";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import "@/app/globals.css";
import { usePathname } from "next/navigation";
import { useHeaderContext } from "@/context/HeaderContext";
import { useSidebarContext } from "@/context/SidebarContext";
import { useEffect } from "react";

export default function BrandLayout({ children }) {
  const { setHeading } = useHeaderContext();
  const { showSidebar, setShowSidebar } = useSidebarContext();
  const pathName = usePathname();
  const brandName = pathName.split("/")[2];
  const locationName = pathName.split("/")[4];
  const decodedLocationName = decodeURIComponent(locationName);
  const sublocationName = pathName.split("/")[6];
  const decodedSubLocationName = decodeURIComponent(sublocationName);

  useEffect(() => {
    if (brandName && locationName && sublocationName) {
      setHeading(`${brandName} - ${decodedSubLocationName}, ${decodedLocationName}`);
      setShowSidebar(true);
    } else if (brandName && locationName) {
      setHeading(`${brandName} - ${decodedLocationName}`);
      setShowSidebar(false);
    } else if (brandName) {
      setHeading(`${brandName}`);
      setShowSidebar(false);
    }
  }, [brandName, setHeading, pathName, locationName, sublocationName, setShowSidebar]);

  return (
    <section>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-grow">
          <Header heading={brandName} />
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
