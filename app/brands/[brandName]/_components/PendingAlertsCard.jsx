import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PickAName } from '@/lib/utils';

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PendingAlertsCard = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [data, setData] = useState([]);
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const pendingBudgets = [
      {
        id: 1,
        title: "Pending Budget Approval",
        requestedByDesignation: "Location Manager",
        requestedByName: PickAName(),
        requestedAmount: `₹${generateRandomNumber(10, 50)}L`,
        approvedByDesignation: "Brand Finance Manager",
        approvedByName: PickAName(),
        approvedAmount: `₹${generateRandomNumber(10, 50)}L`,
        voucherType: "Marketing",
        description: "Budget for marketing campaign is pending approval.",
        date: "December 27, 2024",
      },
      {
        id: 2,
        title: "Pending Promotion Approval",
        requestedByDesignation: "Sub Location Manager",
        requestedByName: PickAName(),
        requestedPosition: "Location Manager",
        approvedByDesignation: "Location Incharge",
        approvedByName: PickAName(),
        voucherType: "Promotion",
        description: `Request for promotion of ${PickAName()} from ${PickAName()}.`,
        date: "December 27, 2024",
      },
      {
        id: 3,
        title: "Pending Employee Admission Approval",
        requestedByDesignation: "Sub Location Manager",
        requestedByName: PickAName(),
        requestedPosition: "Location Manager",
        approvedByDesignation: "Location Incharge",
        approvedByName: PickAName(),
        voucherType: "Admission",
        description: `Request for admission of ${PickAName()} from ${PickAName()}.`,
        date: "December 27, 2024",
      },
      {
        id: 4,
        title: "Pending Budget Approval",
        requestedByDesignation: "Finance Manager",
        requestedByName: PickAName(),
        requestedAmount: `₹${generateRandomNumber(10, 50)}L`,
        approvedByDesignation: "Brand Finance Manager",
        approvedByName: PickAName(),
        approvedAmount: `₹${generateRandomNumber(10, 50)}L`,
        voucherType: "Current Bills",
        description: "Budget for current bills is pending approval.",
        date: "December 27, 2024",
      },
    ];

    setData(pendingBudgets);
  }, []);

  const handleReject = () => {
    setIsRejecting(true);
  };

  const handleSubmit = () => {
    // Handle the submit logic here
    setSelectedAlert(null);
    setIsRejecting(false);
    setReason("");
  };

  return (
    <div className="max-w-4xl">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Pending Budget Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <ul className="list-disc list-inside space-y-3">
              {data.map((alert) => (
                <li key={alert.id}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <p className="font-medium cursor-pointer">{alert.title}</p>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{alert.title}</DialogTitle>
                        <DialogDescription as="div">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Requested By Designation
                              </label>
                              <Input
                                value={alert.requestedByDesignation}
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Requested By Name
                              </label>
                              <Input
                                value={alert.requestedByName}
                                readOnly
                              />
                            </div>
                            {alert.requestedAmount && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Requested Amount
                                </label>
                                <Input
                                  value={alert.requestedAmount}
                                  readOnly
                                />
                              </div>
                            )}
                            {alert.requestedPosition && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Requested Position
                                </label>
                                <Input
                                  value={alert.requestedPosition}
                                  readOnly
                                />
                              </div>
                            )}
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Approved By Designation
                              </label>
                              <Input
                                value={alert.approvedByDesignation}
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Approved By Name
                              </label>
                              <Input
                                value={alert.approvedByName}
                                readOnly
                              />
                            </div>
                            {alert.approvedAmount && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Approved Amount
                                </label>
                                <Input
                                  value={alert.approvedAmount}
                                  readOnly
                                />
                              </div>
                            )}
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Voucher Type
                              </label>
                              <Input
                                value={alert.voucherType}
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Description
                              </label>
                              <Input
                                value={alert.description}
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Date
                              </label>
                              <Input
                                value={alert.date}
                                readOnly
                              />
                            </div>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button onClick={handleSubmit}>Approve</Button>
                        <Button variant="outline" onClick={handleReject}>
                          Reject
                        </Button>
                      </DialogFooter>
                      {isRejecting && (
                        <div className="mt-4">
                          <Textarea
                            placeholder="Reason for rejection"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          />
                          <Button className="mt-2" onClick={handleSubmit}>
                            Submit
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                  <p className="text-xs text-gray-400">{alert.date}</p>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingAlertsCard;