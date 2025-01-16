"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSidebarContext } from "@/context/SidebarContext";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const { setShowLocationDetails, setShowSidebar } = useSidebarContext();

  useEffect(() => {
    const pathParts = pathname.split('/');
    const isLocationRoute = pathParts.length >= 4 && pathParts[3] === 'locations';
    setShowLocationDetails(isLocationRoute);

    // Set showSidebar based on path or other conditions if needed
    setShowSidebar(true); // or your logic to determine sidebar visibility
  }, [pathname, setShowLocationDetails, setShowSidebar]);

  return (
    <main className="min-h-screen">
      {children}
    </main>
  );
}
