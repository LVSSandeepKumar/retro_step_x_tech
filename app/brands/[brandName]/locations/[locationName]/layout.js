"use client";
import Header from "@/components/header";
import "@/app/globals.css";
import { usePathname } from "next/navigation";

export default function BrandLayout({ children }) {
  const pathName = usePathname();
  const pathSegments = pathName.split("/");
  const brandName = pathSegments[2] || "Brand";
  const locationName = pathSegments[4] || "Location";
  const decodedLocationName = decodeURIComponent(locationName);
  return (
    <section>
      <Header heading={`${brandName} - ${decodedLocationName}`} />
      {children}
    </section>
  );
}
