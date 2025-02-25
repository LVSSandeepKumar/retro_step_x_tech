const JobCardTable = ({ jobCards, onSave }) => {
    const tableHeaders = [
      "Job Card Number",
      "Reg No",
      "Job Card Date",
      "Branch",
      "Model",
      "Chassis No",
      "Customer",
      "Customer Name",
      "Mobile No",
      "City",
      "Service Advisor",
      "Ready for Bill",
      "Source",
      "Status",
      "Total Amount",
    ];
  
    // Wrap the custom TableRow with motion
    const MotionTableRow = motion(TableRow);
  
    return (
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-white shadow-md rounded-lg">
          <TableHeader>
            <TableRow className="bg-gray-200">
              {tableHeaders.map((header, index) => (
                <TableHead key={index} className="py-2 px-4 border-b font-bold">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobCards.map((jobCard, index) => (
              <MotionTableRow
                key={index}
                className="hover:bg-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onClick={() => onSave(jobCard)}
              >
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.jobCardNumber}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.regNo}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.jobCardDate}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.branch}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.model}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.chassisNo}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.customer}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.customerName}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.mobileNo}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.city}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.serviceAdvisor}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.readyForBill}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.source}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.status}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                  {jobCard.totalAmount}
                </TableCell>
              </MotionTableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  