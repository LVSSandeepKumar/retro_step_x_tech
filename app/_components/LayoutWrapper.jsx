'use client';

import { usePathname } from "next/navigation";
import { useSidebarContext } from "@/context/SidebarContext";
import { useEffect } from "react";

export default function LayoutWrapper({ children }) {
  const { setShowSidebar } = useSidebarContext();
  const pathName = usePathname();
  
  useEffect(() => {
    const pathParts = pathName.split("/");
    const brandName = pathParts[2];
    const locationName = pathParts[4];
    const sublocationName = pathParts[6];

    // Show sidebar on home page and when we have brand details
    if (pathName === "/" || (brandName && (locationName || sublocationName))) {
      setShowSidebar(true);
    } else {
      setShowSidebar(false);
    }
  }, [pathName, setShowSidebar]);

  return children;
}
