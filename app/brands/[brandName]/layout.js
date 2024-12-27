"use client";
import Header from "@/components/header";
import "@/app/globals.css";
import { usePathname } from "next/navigation";

export default function BrandLayout({ children }) {
  const pathName = usePathname();
  const brandName = pathName.split("/")[2] || "Brand Page";

  return (
    <section>
      <div className="flex">
        <div className="flex-1">
          <Header heading={brandName} />
          {children}
        </div>
      </div>
    </section>
  );
}
