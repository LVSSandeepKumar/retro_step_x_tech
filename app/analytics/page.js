"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import VerifiedUnverifiedTable from "./_components/VerifiedUnverifiedTable";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState("verified");
  const router = useRouter();

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>
      <Tabs defaultValue="verified" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-background mb-4">
          <div className="container mx-auto flex">
            <TabsTrigger
              value="verified"
              className="flex-1 data-[state=active]:bg-primary/5"
              onClick={() => setActiveTab("verified")}
            >
              Verified
            </TabsTrigger>
            <TabsTrigger
              value="unverified"
              className="flex-1 data-[state=active]:bg-primary/5"
              onClick={() => setActiveTab("unverified")}
            >
              Unverified
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="verified" className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Verified Analytics</h2>
            {/* Add your verified analytics components here */}
            <VerifiedUnverifiedTable currentTab={activeTab} />
          </div>
        </TabsContent>

        <TabsContent value="unverified" className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Unverified Analytics</h2>
            {/* Add your unverified analytics components here */}
            <VerifiedUnverifiedTable currentTab={activeTab} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
