"use client";
import LayoutWrapper from "@/app/_components/LayoutWrapper";
import "@/app/globals.css";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

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
