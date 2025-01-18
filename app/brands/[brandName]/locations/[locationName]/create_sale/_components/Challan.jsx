"use client";
import React, { useRef } from "react";

const ReceiptTemplateExact = ({ details }) => {
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

  

  return (
    <div>
      <div
        ref={printRef}
        style={{
          border: "1px solid black",
          padding: "20px",
          width: "800px",
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            textAlign: "center",
            borderBottom: "2px solid black",
            paddingBottom: "10px",
          }}
        >
          <h3 style={{ margin: "0", textTransform: "uppercase" }}>
            Receipt for Advance Booking
          </h3>
          <p style={{ fontSize: "12px", margin: "5px 0" }}>
            Ongole: 9121182099 | Ram Nagar: 7207817555 | Addanki: 9701050818 | Adda Road: 7207828555
          </p>
          <p style={{ fontSize: "12px", margin: "5px 0" }}>
            Chirala: 9246465452 | Chimakurthy: 7207832555 | Inkollu: 9912400740
          </p>
          <p style={{ fontSize: "12px", margin: "5px 0" }}>
            Kunta: 7207828444 | Martur: 9246465401 | Medarametla: 9704344798
          </p>
          <p style={{ fontSize: "12px", margin: "5px 0" }}>
            S.Konda: 7207831555 | Tangutur: 7207830555 | Ulavapadu: 7207807444
          </p>
        </div>
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <strong>KTM: 9010857552</strong>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>No:</strong> {details.receiptNumber}
          </p>
          <p>
            <strong>For:</strong> {details.vehicle}
          </p>
        </div>
        <p>
          Received with thanks from Sri/Smt/Ms: <strong>{details.customerName}</strong>
        </p>
        <p>A sum of Rs: <strong>{details.amount}</strong></p>
        <p>(Rupees: {details.amountInWords})</p>
        <p>
          Vide Cash/Cheque/DD/Pay Order: <strong>{details.paymentMode}</strong>
        </p>
        <p>
          Towards advance for booking of vehicle Model Number:{" "}
          <strong>{details.vehicleModel}</strong>
        </p>
        <p>Dated: <strong>{details.date}</strong></p>
        <p>Place: <strong>{details.place}</strong></p>
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <p>For <strong>Tirumala Automotives</strong></p>
          <p>Authorised Signatory</p>
        </div>
      </div>
      <button onClick={handlePrint} style={{ marginTop: "20px" }}>
        Print Receipt
      </button>
    </div>
  );
};

export default ReceiptTemplateExact;
