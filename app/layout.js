import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeaderProvider } from "@/context/HeaderContext";
import { SidebarProvider } from "@/context/SidebarContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Retro App",
  description: "By StepXTech",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeaderProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </HeaderProvider>
      </body>
    </html>
  );
}
