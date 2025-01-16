"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SalesAndServicesDetailsChart from "./SalesAndServicesDetailsChart"
import LocationRevenueDetails from "./LocationRevenueDetails"

export function DetailDialog({ open, onOpenChange, selectedCard, period, chartData }) {
  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-6xl h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedCard === "sales" 
              ? "Brand-wise Sales"
              : selectedCard === "services"
              ? "Services Distribution"
              : "Other Revenue Analysis"}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="location">Location Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4">
            <SalesAndServicesDetailsChart 
              selectedCard={selectedCard} 
              period={period}
              data={chartData}
            />
          </TabsContent>
          <TabsContent value="location" className="mt-4">
            <LocationRevenueDetails 
              type={selectedCard}
              amount={chartData.reduce((sum, item) => sum + item.value, 0)}
              count={chartData.reduce((sum, item) => sum + item.count, 0)}
              period={period}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
