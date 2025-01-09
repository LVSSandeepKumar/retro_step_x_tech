"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeaderProvider } from "@/context/HeaderContext";
import { SidebarProvider } from "@/context/SidebarContext";
import ChatBot from "./_components/ChatBot";
import LayoutWrapper from "./_components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <HeaderProvider>
          <SidebarProvider>
            <LayoutWrapper>
              {children}
              <ChatBot />
            </LayoutWrapper>
          </SidebarProvider>
        </HeaderProvider>
      </body>
    </html>
  );
}
