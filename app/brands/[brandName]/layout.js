"use client";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/ui/header";
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
    const brandName = pathName.split("/").pop() || "Brand Page";
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header heading={brandName}/>
        {children}
      </body>
    </html>
  );
}
