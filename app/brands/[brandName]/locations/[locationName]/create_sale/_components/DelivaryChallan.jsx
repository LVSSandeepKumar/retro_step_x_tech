"use client";
import React, { useRef } from "react";
// import QRCode from "qrcode.react";

const DeliveryChallan = ({ details }) => {
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

  // QR code data
  const qrData = JSON.stringify({
    challanNo: details.challanNumber,
    customer: details.customerName,
    vehicle: details.vehicle,
    model: details.vehicleModel,
    color: details.color,
    engineNo: details.engineNumber,
    chassisNo: details.chassisNumber
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
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            borderBottom: "2px solid black",
            paddingBottom: "10px",
          }}
        >
          <h3 style={{ margin: "0", textTransform: "uppercase" }}>
            Vehicle Delivery Challan
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
          {/* Challan Details Section */}
          <div style={{ flex: "1", display: "flex", gap: "40px" }}>
            {/* Left Column - Customer Details */}
            <div style={{ flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "8px 0", width: "130px" }}><strong>Challan No:</strong></td>
                    <td>{details.challanNumber}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Date:</strong></td>
                    <td>{details.date}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Customer Name:</strong></td>
                    <td>{details.customerName}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Mobile:</strong></td>
                    <td>{details.mobileNumber}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Address:</strong></td>
                    <td>{details.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Right Column - Vehicle Details */}
            <div style={{ flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "8px 0", width: "130px" }}><strong>Vehicle:</strong></td>
                    <td>{details.vehicle}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Model:</strong></td>
                    <td>{details.vehicleModel}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Color:</strong></td>
                    <td>{details.color}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Engine No:</strong></td>
                    <td>{details.engineNumber}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}><strong>Chassis No:</strong></td>
                    <td>{details.chassisNumber}</td>
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
            paddingTop: "10px"
          }}>
            {/* <QRCode 
              value={qrData}
              size={120}
              level={"H"}
              includeMargin={true}
            /> */}
            <div style={{ fontSize: "8px", marginTop: "5px", textAlign: "center" }}>
              Scan for digital copy
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div style={{ marginTop: "20px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>Accessories Delivered:</h4>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>Item</th>
                <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>Quantity</th>
                <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {details.accessories?.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.name}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.quantity}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures Section */}
        <div style={{ 
          marginTop: "30px", 
          display: "flex", 
          justifyContent: "space-between",
          paddingTop: "20px"
        }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ 
              borderTop: "1px solid #000", 
              paddingTop: "8px",
              display: "inline-block" 
            }}>Customer Signature</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ 
              borderTop: "1px solid #000", 
              paddingTop: "8px",
              display: "inline-block" 
            }}>For Tirumala Automotives<br/>Authorised Signatory</p>
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
        Print Challan
      </button>
    </div>
  );
};

export default DeliveryChallan;