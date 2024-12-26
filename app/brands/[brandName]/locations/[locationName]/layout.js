"use client";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/header";
import "@/app/globals.css";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function BrandLayout({ children }) {
  const pathName = usePathname();
  const pathSegments = pathName.split("/");
  const brandName = pathSegments[2] || "Brand";
  const locationName = pathSegments[4] || "Location";
  const decodedLocationName = decodeURIComponent(locationName);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header heading={`${brandName} - ${decodedLocationName}`} />
        {children}
      </body>
    </html>
  );
}
