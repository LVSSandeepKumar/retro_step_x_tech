"use client";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

export default function AnalyticsLayout({ children }) {
  return (
    <div className="flex bg-slate-100">
      <Sidebar />
      <div className="flex-1">
        <Header heading={"Analytics"} />
        {children}
      </div>
    </div>
  );
}
