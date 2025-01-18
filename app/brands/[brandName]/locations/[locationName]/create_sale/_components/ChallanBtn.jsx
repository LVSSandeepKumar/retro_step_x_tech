import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ReceiptTemplateExact from "./Challan"; // Adjust the path based on your structure
import { Button } from "@/components/ui/button";

export default function GenerateChallan() {
  const [showDialog, setShowDialog] = useState(false);

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const receiptDetails = {
    receiptNumber: "32",
    customerName: "John Doe",
    amount: "50000",
    amountInWords: "Fifty Thousand Only",
    paymentMode: "Cash",
    vehicleModel: "KTM 390 Adventure",
    date: "17-Jan-2025",
    place: "Hyderabad",
    companyName: "Tirumala Automotives",
  };

  return (
    <div>
      <Button className="ml-4" onClick={handleOpenDialog}>
        Generate Challan
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
         
        </DialogTrigger>
        <DialogContent className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
            <DialogDescription>
              Below are the details of the generated receipt.
            </DialogDescription>
          </DialogHeader>
          <div>
            <ReceiptTemplateExact details={receiptDetails} />
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleCloseDialog}
          >
            Close
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
