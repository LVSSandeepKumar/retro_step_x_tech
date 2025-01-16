"use client";
import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // Add showSidebar state
  
  const value = {
    showLocationDetails,
    setShowLocationDetails,
    showSidebar,
    setShowSidebar
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
};
