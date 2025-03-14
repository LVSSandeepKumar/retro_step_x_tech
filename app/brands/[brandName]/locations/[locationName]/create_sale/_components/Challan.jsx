"use client";
import React, { useRef } from "react";
// import QRCodeCanvas from "qrcode.react";

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

  // Create QR code data string
  const qrData = JSON.stringify({
    receiptNo: details.receiptNumber,
    customer: details.customerName,
    vehicle: details.vehicle,
    model: details.vehicleModel,
    amount: details.amount,
    date: details.date
  });

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
        {/* Original Header */}
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
          <p style={{ fontSize: "8px" }}>
            Ongole: 9121182099 | Ram Nagar: 7207817555 | Addanki: 9701050818 | Adda Road: 7207828555
          </p>
          <p style={{ fontSize: "8px" }}>
            Chirala: 9246465452 | Chimakurthy: 7207832555 | Inkollu: 9912400740
          </p>
          <p style={{ fontSize: "8px" }}>
            Kunta: 7207828444 | Martur: 9246465401 | Medarametla: 9704344798
          </p>
          <p style={{ fontSize: "8px" }}>
            S.Konda: 7207831555 | Tangutur: 7207830555 | Ulavapadu: 7207807444
          </p>
        </div>

        {/* KTM Contact */}
        <div style={{ marginTop: "10px", marginBottom: "20px" }}>
          <strong>KTM: 9010857552</strong>
        </div>

        {/* Main Content Container */}
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Receipt Details Section */}
          <div style={{ flex: "1", display: "flex", gap: "40px" }}>
            {/* Left Column */}
            <div style={{ flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "8px 0", width: "130px" }}><strong>Receipt No:</strong></td>
                    <td>{details.receiptNumber}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Customer Name:</strong></td>
                    <td>{details.customerName}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Amount:</strong></td>
                    <td>Rs. {details.amount}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>In Words:</strong></td>
                    <td>{details.amountInWords}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Payment Mode:</strong></td>
                    <td>{details.paymentMode}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Right Column */}
            <div style={{ flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "8px 0", width: "130px" }}><strong>Vehicle:</strong></td>
                    <td>{details.vehicle}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Model Number:</strong></td>
                    <td>{details.vehicleModel}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Date:</strong></td>
                    <td>{details.date}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Place:</strong></td>
                    <td>{details.place}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* QR Code Section */}
          <div style={{ 
            width: "150px", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            justifyContent: "flex-start",
     
          }}>
            {/* <QRCodeCanvas  
              value={qrData}
              size={120}
              level={"H"}
              includeMargin={true}
            /> */}
            <div style={{ fontSize: "8px", textAlign: "center" }}>
              Scan for digital copy
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div style={{ 
          borderTop: "1px solid #ddd",
          paddingTop: "20px",
          display: "flex",
          justifyContent: "flex-end" 
        }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ marginBottom: "20px" }}>For <strong>Tirumala Automotives</strong></p>
            <p style={{ 
              borderTop: "1px solid #000", 
              paddingTop: "8px",
              display: "inline-block" 
            }}>Authorised Signatory</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handlePrint} 
        style={{ 
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Print Receipt
      </button>
    </div>
  );
};

export default ReceiptTemplateExact;
