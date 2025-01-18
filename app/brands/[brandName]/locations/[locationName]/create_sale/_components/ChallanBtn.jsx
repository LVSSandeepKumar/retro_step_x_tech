import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ReceiptTemplateExact from "./Challan"; // Adjust the path based on your structure
import { Button } from "@/components/ui/button";
import DeliveryChallan from "./DelivaryChallan";

export default function GenerateChallan({ type, data, label }) {

  const receiptDetails = {
    receiptNumber: "32",
    customerName: "Venkey",
    amount: "50000",
    amountInWords: "Fifty Thousand Only",
    paymentMode: "Cash",
    vehicleModel: "KTM 390 Adventure",
    date: "17-Jan-2025",
    place: "Hyderabad",
    companyName: "Tirumala Automotives",
    receiptNumber:'34'
  };


  const challanDetails = {
    challanNumber: "DC001",
    date: "2024-01-18",
    customerName: "John Doe",
    mobileNumber: "9876543210",
    address: "123 Main Street, City",
    vehicle: "KTM",
    vehicleModel: "Duke 390",
    color: "Orange",
    engineNumber: "KTM123456",
    chassisNumber: "CHASSIS789012",
    accessories: [
      { name: "Tool Kit", quantity: "1", remarks: "Complete" },
      { name: "First Aid Kit", quantity: "1", remarks: "Sealed" },
      { name: "User Manual", quantity: "1", remarks: "Included" }
    ]
  };
  const [showDialog, setShowDialog] = useState(false);
  console.log(data);
  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <div>
      <Button className="ml-4" onClick={handleOpenDialog}>
        {label || "Generate Challan"}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
         
        </DialogTrigger>
        <DialogContent className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>
              {type === 'advance' ? 'Advance Receipt' : 'Receipt Details'}
            </DialogTitle>
            <DialogDescription>
              {type === 'advance' ? 'Advance payment details' : 'Below are the details of the generated receipt.'}
            </DialogDescription>
          </DialogHeader>
          <div>
            {type === 'advance' && 
              <ReceiptTemplateExact type={type} details={receiptDetails} label={label} />
            }
             {type === 'bike' && 
              <DeliveryChallan type={type} details={challanDetails} label={label} />
            }
          </div>
          <Button onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
