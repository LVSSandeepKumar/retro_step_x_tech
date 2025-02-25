import React from 'react';
import JobCardTable from '../app/brands/[brandName]/locations/[locationName]/job-card/add-job-card/page'; // Adjust the import as needed

const ParentComponent = () => {
  const handleSave = (jobCard) => {
    // Define the save functionality here
    console.log('Save button clicked', jobCard);
  };

  const jobCards = [
    // Example job card data
    { id: 1, jobCardNumber: 'JC001', regNo: 'ABC123', jobCardDate: '2023-10-01', branch: 'Branch1', model: 'Model1', chassisNo: 'CH001', customer: 'Customer1', customerName: 'John Doe', mobileNo: '1234567890', city: 'City1', serviceAdvisor: 'Advisor1', readyForBill: true, source: 'Source1', status: 'Completed', totalAmount: 1000 },
    // Add more job cards as needed
  ];

  return (
    <div>
      <JobCardTable jobCards={jobCards} onSave={handleSave} />
    </div>
  );
};

export default ParentComponent;
