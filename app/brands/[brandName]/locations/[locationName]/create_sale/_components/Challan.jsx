"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";

const ReceiptTemplate = ({ type, data }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Print</title></head><body>");
    printWindow.document.write(printContent.outerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const renderBikeChallan = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Bike Purchase Receipt</h2>
      <div className="space-y-2">
        <p><strong>Model:</strong> {data.bikeDetails.selectedModel}</p>
        <p><strong>Customer:</strong> {data.customerDetails.customerName}</p>
        <p><strong>Contact:</strong> {data.customerDetails.customerNo}</p>
        <p><strong>Price:</strong> ₹{data.bikeDetails.onRoadPrice.toLocaleString()}</p>
        {data.exchangeDetails && (
          <>
            <p><strong>Exchange Value:</strong> ₹{data.exchangeDetails.exchangeValue}</p>
            <p><strong>Final Price:</strong> ₹{data.bikeDetails.onRoadPriceAfterExchange.toLocaleString()}</p>
          </>
        )}
      </div>
    </div>
  );

  const renderAccessoriesChallan = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Accessories & Apparel Receipt</h2>
      <div className="space-y-4">
        {data.accessories.items.length > 0 && (
          <div>
            <h3 className="font-semibold">Accessories</h3>
            {data.accessories.items.map((item, index) => (
              <div key={index} className="ml-4">
                <p>{item.accessoryName} - ₹{item.finalPrice}</p>
              </div>
            ))}
            <p className="font-semibold">Total: ₹{data.accessories.total}</p>
          </div>
        )}
        {data.apparel.items.length > 0 && (
          <div>
            <h3 className="font-semibold">Apparel</h3>
            {data.apparel.items.map((item, index) => (
              <div key={index} className="ml-4">
                <p>{item.apparelName} - ₹{item.finalPrice}</p>
              </div>
            ))}
            <p className="font-semibold">Total: ₹{data.apparel.total}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCompleteChallan = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Complete Sale Receipt</h2>
      {renderBikeChallan()}
      {renderAccessoriesChallan()}
      <div className="mt-4 pt-4 border-t">
        <h3 className="font-semibold">Payment Details</h3>
        <p><strong>Payment Method:</strong> {data.paymentDetails.method}</p>
        {data.paymentDetails.spotPayment && (
          <div className="ml-4">
            {data.paymentDetails.spotPayment.transactions.map((t, i) => (
              <p key={i}>{t.paymentMode}: ₹{t.amount}</p>
            ))}
          </div>
        )}
        {data.paymentDetails.finance && (
          <div className="ml-4">
            <p>Down Payment: ₹{data.paymentDetails.finance.downPayment}</p>
            <p>Loan Amount: ₹{data.paymentDetails.finance.loanAmount}</p>
          </div>
        )}
        <p className="mt-4 text-xl font-bold">
          Grand Total: ₹{data.pricing.totalAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div ref={printRef}>
        {type === 'bike' && renderBikeChallan()}
        {type === 'accessories' && renderAccessoriesChallan()}
        {type === 'complete' && renderCompleteChallan()}
      </div>
      <Button onClick={handlePrint} className="mt-4">
        Print {type.charAt(0).toUpperCase() + type.slice(1)} Receipt
      </Button>
    </div>
  );
};

const GenerateChallan = ({ type, data, label }) => {
  return (
    <Button
      onClick={() => {
        const challanWindow = window.open("", "_blank");
        challanWindow.document.write("<div id='challan'></div>");
        const root = ReactDOM.createRoot(challanWindow.document.getElementById('challan'));
        root.render(<ReceiptTemplate type={type} data={data} />);
      }}
    >
      {label}
    </Button>
  );
};

export default GenerateChallan;
