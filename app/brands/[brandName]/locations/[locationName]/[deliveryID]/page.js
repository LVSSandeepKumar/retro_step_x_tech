  "use client";
  import { Card, CardHeader, CardContent } from '@/components/ui/card';
  import { CalendarIcon, CheckCircleIcon, CurrencyIcon, TagIcon } from 'lucide-react';
  // import { CheckCircleIcon, TagIcon, CurrencyIcon, CalendarIcon } from 'lucide-react'; // Import icons

  const bikeInfo = {
    bikeName: "Yamaha R15",
    exShowroom: 150000,
    lifeTax: 2500,
    insurance: 5000,
    pdiCharges: 1000,
    accessories: 3000,
    onRoadPrice: 175500,
    onRoadPriceAfterExchange: 160000,
  };

  const oldBikeInfo = {
    bikeName: "Honda CB Hornet",
    registrationNo: "AP01ABC1234",
    color: "Red",
    manufacturingYear: "2018",
    purchaseAmount: 95000,
    sellingAmount: 85000,
  };

  const customerInfo = {
    customerName: "John Doe",
    customerNo: "1234567890",
    aadharNo: "XXXX-XXXX-XXXX",
  };

  const exchangeInfo = {
    exchangeBikeName: "Suzuki Gixxer",
    registrationNo: "AP02XYZ5678",
    manufacturingYear: "2017",
    kilometersRun: "20000",
    currentCondition: "Good",
    knownIssues: "No major issues",
    exchangeValue: 40000,
  };

  const spotPaymentInfo = {
    onRoadPrice: 175500,
    discountApplied: "10%",
    finalAmount: 158000,
  };

  const financePaymentInfo = {
    downPayment: 50000,
    remainingAmount: 108000,
    financeProvider: "HDFC",
    rateOfInterest: 12,
    tenure: 24,
    loanAmount: 108000,
    documents: "Uploaded",
  };

  // Helper for displaying labels and values with icons
  const displayField = (label, value, Icon) => (
    <div className="flex items-center justify-between py-2 text-sm">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="text-gray-500 w-5 h-5" />}
        <span className="text-gray-600 font-semibold">{label}</span>
      </div>
      <span className="text-gray-800">{value}</span>
    </div>
  );
  const BikeSalesInfoPage = () => {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-semibold text-center mb-6">Bike Sales Information</h1>
  
        {/* Single Card for All Info */}
        <Card className="mb-6 p-6 shadow-md rounded-lg bg-gray-50">
          <CardHeader className="flex items-center justify-between pb-3">
            <h2 className="text-xl font-semibold text-gray-700">Bike Sales Details</h2>
          </CardHeader>
          <CardContent className="space-y-6">
  
            {/* Bike Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayField("Bike Name", bikeInfo.bikeName, TagIcon)}
              {displayField("Ex Showroom", `₹${bikeInfo.exShowroom}`, CurrencyIcon)}
              {displayField("Life Tax", `₹${bikeInfo.lifeTax}`, CurrencyIcon)}
              {displayField("Insurance", `₹${bikeInfo.insurance}`, CurrencyIcon)}
              {displayField("PDI Charges", `₹${bikeInfo.pdiCharges}`, CurrencyIcon)}
              {displayField("Accessories", `₹${bikeInfo.accessories}`, CurrencyIcon)}
              {displayField("On Road Price", `₹${bikeInfo.onRoadPrice}`, CurrencyIcon)}
              {displayField("On Road Price After Exchange", `₹${bikeInfo.onRoadPriceAfterExchange}`, CurrencyIcon)}
            </div>
  
            {/* Old Bike Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayField("Bike Name", oldBikeInfo.bikeName, TagIcon)}
              {displayField("Registration No.", oldBikeInfo.registrationNo, CheckCircleIcon)}
              {displayField("Color", oldBikeInfo.color, CheckCircleIcon)}
              {displayField("Manufacturing Year", oldBikeInfo.manufacturingYear, CalendarIcon)}
              {displayField("Purchase Amount", `₹${oldBikeInfo.purchaseAmount}`, CurrencyIcon)}
              {displayField("Selling Amount", `₹${oldBikeInfo.sellingAmount}`, CurrencyIcon)}
            </div>
  
            {/* Customer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayField("Customer Name", customerInfo.customerName, CheckCircleIcon)}
              {displayField("Customer No.", customerInfo.customerNo, CheckCircleIcon)}
              {displayField("Aadhar Number", customerInfo.aadharNo, CheckCircleIcon)}
            </div>
  
            {/* Exchange Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayField("Bike Name", exchangeInfo.exchangeBikeName, TagIcon)}
              {displayField("Registration No.", exchangeInfo.registrationNo, CheckCircleIcon)}
              {displayField("Manufacturing Year", exchangeInfo.manufacturingYear, CalendarIcon)}
              {displayField("Kilometers Run", exchangeInfo.kilometersRun, CheckCircleIcon)}
              {displayField("Current Condition", exchangeInfo.currentCondition, CheckCircleIcon)}
              {displayField("Known Issues", exchangeInfo.knownIssues, CheckCircleIcon)}
              {displayField("Exchange Value", `₹${exchangeInfo.exchangeValue}`, CurrencyIcon)}
            </div>
  
            {/* Spot Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayField("On Road Price", `₹${spotPaymentInfo.onRoadPrice}`, CurrencyIcon)}
              {displayField("Discount Applied", spotPaymentInfo.discountApplied, CheckCircleIcon)}
              {displayField("Final Amount", `₹${spotPaymentInfo.finalAmount}`, CurrencyIcon)}
            </div>
  
            {/* Finance Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayField("Down Payment", `₹${financePaymentInfo.downPayment}`, CurrencyIcon)}
              {displayField("Remaining Amount", `₹${financePaymentInfo.remainingAmount}`, CurrencyIcon)}
              {displayField("Finance Provider", financePaymentInfo.financeProvider, CheckCircleIcon)}
              {displayField("Rate of Interest", `${financePaymentInfo.rateOfInterest}%`, CheckCircleIcon)}
              {displayField("Tenure", `${financePaymentInfo.tenure} months`, CalendarIcon)}
              {displayField("Loan Amount", `₹${financePaymentInfo.loanAmount}`, CurrencyIcon)}
              {displayField("Documents", financePaymentInfo.documents, CheckCircleIcon)}
            </div>
  
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default BikeSalesInfoPage;
  