"use client";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import "@/app/globals.css";
import LayoutWrapper from "@/app/_components/LayoutWrapper";
import { usePathname } from "next/navigation";
import { useHeaderContext } from "@/context/HeaderContext";
import { useSidebarContext } from "@/context/SidebarContext";
import { useEffect } from "react";

export default function BrandLayout({ children }) {
  return (
    <LayoutWrapper>
      <section>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-col flex-grow">
            <Header />
            <div className="p-4">
              {children}
            </div>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
