import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ReceiptTemplateExact from "./Challan"; // Adjust the path based on your structure
import { Button } from "@/components/ui/button";

export default function GenerateChallan({ type, data, label }) {
  const [showDialog, setShowDialog] = useState(false);

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
            <ReceiptTemplateExact type={type} data={data} />
          </div>
          <Button onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
