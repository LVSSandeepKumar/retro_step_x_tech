"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MarketingOverviewCard from "./_components/MarketingOverviewCard";
import { useParams } from "next/navigation";
import { PickAName } from "@/lib/utils";

const MarketingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "budget",
    direction: "descending",
  });
  const [data, setData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [currentTab, setCurrentTab] = useState("running");
  const { billName } = useParams();

  useEffect(() => {
    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const mockCampaigns = [
      {
        campaignName: "Monsoon Bike Care Awareness",
        delivery: "Social Media Platforms (Instagram, Facebook, Twitter)",
        strategy:
          "Educate users on monsoon bike care with engaging posts and reels",
        budget: `₹${generateRandomNumber(1, 5)},00,000`,
        results: `${generateRandomNumber(
          10,
          30
        )}% increase in service bookings`,
        reach: `${generateRandomNumber(10, 20)},00,000 people`,
        status: "running",
      },
      {
        campaignName: "Festive Car Offers 2024",
        delivery: "TV Ads, Radio, and Social Media",
        strategy:
          "Highlight Diwali discounts on cars with creative jingles and visuals",
        budget: `₹${generateRandomNumber(5, 10)},00,000`,
        results: `${generateRandomNumber(10, 30)}% growth in showroom visits`,
        reach: `${generateRandomNumber(20, 30)},00,000 people`,
        status: "completed",
      },
      {
        campaignName: "Test Drive Sundays",
        delivery: "Email and SMS Campaigns",
        strategy:
          "Promote free test drive events every Sunday in all major cities",
        budget: `₹${generateRandomNumber(10, 20)},50,000`,
        results: `${generateRandomNumber(5000, 15000)} test drives booked`,
        reach: `${generateRandomNumber(50, 100)},000 people`,
        status: "running",
      },
      {
        campaignName: "Mileage Challenge",
        delivery: "YouTube and Influencer Marketing",
        strategy:
          "Collaborate with influencers to demonstrate vehicle mileage benefits",
        budget: `₹${generateRandomNumber(20, 30)}0,000`,
        results: `${generateRandomNumber(5000, 15000)} leads generated`,
        reach: `${generateRandomNumber(100, 200)},000 people`,
        status: "rejected",
        reason: "Low engagement rate",
      },
      {
        campaignName: "Rural Outreach Program",
        delivery: "On-ground Activations and FM Radio",
        strategy:
          "Setup demo kiosks in rural areas to showcase affordable commercial vehicles",
        budget: `₹${generateRandomNumber(30, 40)},00,000`,
        results: `${generateRandomNumber(1000, 5000)} sales generated`,
        reach: `${generateRandomNumber(200, 300)},000 people`,
        status: "completed",
      },
      {
        campaignName: "EV Awareness Drive",
        delivery: "Webinars and Educational Blogs",
        strategy:
          "Focus on benefits of electric vehicles with testimonials from early adopters",
        budget: `₹${generateRandomNumber(1, 5)},00,000`,
        results: `${generateRandomNumber(1000, 5000)} inquiries for EV models`,
        reach: `${generateRandomNumber(100, 300)},000 people`,
        status: "running",
      },
      {
        campaignName: "Women on Wheels",
        delivery: "Instagram Reels and Offline Events",
        strategy:
          "Showcase women-centric driving workshops and safety features of vehicles",
        budget: `₹${generateRandomNumber(1, 5)},00,000`,
        results: `${generateRandomNumber(500, 2000)} new vehicle purchases`,
        reach: `${generateRandomNumber(500, 1000)},000 people`,
        status: "completed",
      },
      {
        campaignName: "Highway Heroes Campaign",
        delivery: "Billboards and YouTube",
        strategy:
          "Celebrate commercial vehicle drivers with ads featuring real stories",
        budget: `₹${generateRandomNumber(5, 10)},00,000`,
        results: `${generateRandomNumber(
          1000,
          5000
        )} sales of commercial vehicles`,
        reach: `${generateRandomNumber(1000, 2000)},000 people`,
        status: "rejected",
        reason: "Low response rate",
      },
      {
        campaignName: "Refer & Earn Program",
        delivery: "SMS, WhatsApp, and Email",
        strategy:
          "Encourage customers to refer friends for exclusive cashback and discounts",
        budget: `₹${generateRandomNumber(1, 5)},00,000`,
        results: `${generateRandomNumber(500, 2000)} referrals redeemed`,
        reach: `${generateRandomNumber(100, 500)},000 people`,
        status: "running",
      },
      {
        campaignName: "Vintage Car Showcase",
        delivery: "Social Media Livestreams and Offline Events",
        strategy:
          "Attract enthusiasts by showcasing vintage cars and promoting new models",
        budget: `₹${generateRandomNumber(5, 10)},00,000`,
        results: `${generateRandomNumber(1000, 5000)} showroom visits`,
        reach: `${generateRandomNumber(500, 1000)},000 people`,
        status: "completed",
      },
    ];

    setData(mockCampaigns);
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.strategy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (sortConfig.direction === "ascending") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleCampaignClick = (campaign) => {
    setCurrentCampaign(campaign);
    setIsDialogOpen(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setIsCreateDialogOpen(false);
    // Add the new campaign data here
  };

  const filteredByStatus = sortedData.filter(
    (item) => item.status === currentTab
  );

  return (
    <div className="p-4 md:p-6 lg:px-4 lg:py-6">
      <h1 className="text-2xl font-semibold mb-4">Marketing Campaigns</h1>
      <Tabs defaultValue="running" onValueChange={setCurrentTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="mb-4">
            <TabsTrigger value="running">Running</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                Create Campaign <Plus className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Campaign</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new campaign.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleCreateSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Campaign Name
                  </label>
                  <Input
                    type="text"
                    name="campaignName"
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Delivery
                  </label>
                  <Input
                    type="text"
                    name="delivery"
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Strategy
                  </label>
                  <Input
                    type="text"
                    name="strategy"
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Budget
                  </label>
                  <Input
                    type="text"
                    name="budget"
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Results
                  </label>
                  <Input
                    type="text"
                    name="results"
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reach
                  </label>
                  <Input
                    type="text"
                    name="reach"
                    className="mt-1 block w-full"
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <TabsContent value="running">
          <div className="flex items-center justify-between mb-4">
            <div className="relative max-w-8xl">
              <Input
                type="text"
                placeholder="Search by Campaign Name, Strategy"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Campaign Name</TableCell>
                <TableCell>Delivery</TableCell>
                <TableCell>Strategy</TableCell>
                <TableCell onClick={() => requestSort("budget")}>
                  <span className="ml-2 flex items-center gap-2">
                    Budget
                    <ArrowDownUp className="size-4" />
                  </span>
                </TableCell>
                <TableCell>Results</TableCell>
                <TableCell onClick={() => requestSort("reach")}>
                  <span className="ml-2 flex items-center gap-2">
                    Reach
                    <ArrowDownUp className="size-4" />
                  </span>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredByStatus.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() => handleCampaignClick(item)}
                    >
                      {item.campaignName}
                    </Button>
                  </TableCell>
                  <TableCell>{item.delivery}</TableCell>
                  <TableCell>{item.strategy}</TableCell>
                  <TableCell>{item.budget}</TableCell>
                  <TableCell>{item.results}</TableCell>
                  <TableCell>{item.reach}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="completed">
          <div className="flex items-center justify-between mb-4">
            <div className="relative max-w-6xl">
              <Input
                type="text"
                placeholder="Search by Campaign Name, Strategy"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Campaign Name</TableCell>
                <TableCell>Delivery</TableCell>
                <TableCell>Strategy</TableCell>
                <TableCell onClick={() => requestSort("budget")}>
                  <span className="ml-2 flex items-center gap-2">
                    Budget
                    <ArrowDownUp className="size-4" />
                  </span>
                </TableCell>
                {currentTab !== "rejected" ? (
                  <TableCell>Results</TableCell>
                ) : (
                  <TableCell>Reason</TableCell>
                )}
                <TableCell onClick={() => requestSort("reach")}>
                  <span className="ml-2 flex items-center gap-2">
                    Reach
                    <ArrowDownUp className="size-4" />
                  </span>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredByStatus.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() => handleCampaignClick(item)}
                    >
                      {item.campaignName}
                    </Button>
                  </TableCell>
                  <TableCell>{item.delivery}</TableCell>
                  <TableCell>{item.strategy}</TableCell>
                  <TableCell>₹ {item.budget}</TableCell>
                  <TableCell>{item.results}</TableCell>
                  <TableCell>{item.reach}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="rejected">
          <div className="flex items-center justify-between mb-4">
            <div className="relative max-w-6xl">
              <Input
                type="text"
                placeholder="Search by Campaign Name, Strategy"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Campaign Name</TableCell>
                <TableCell>Delivery</TableCell>
                <TableCell>Strategy</TableCell>
                <TableCell onClick={() => requestSort("budget")}>
                  <span className="ml-2 flex items-center gap-2">
                    Budget
                    <ArrowDownUp className="size-4" />
                  </span>
                </TableCell>
                <TableCell>Reason</TableCell>
                <TableCell onClick={() => requestSort("reach")}>
                  <span className="ml-2 flex items-center gap-2">
                    Reach
                    <ArrowDownUp className="size-4" />
                  </span>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredByStatus.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() => handleCampaignClick(item)}
                    >
                      {item.campaignName}
                    </Button>
                  </TableCell>
                  <TableCell>{item.delivery}</TableCell>
                  <TableCell>{item.strategy}</TableCell>
                  <TableCell>₹ {item.budget}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>{item.reach}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {currentCampaign && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>{currentCampaign.campaignName} Overview</DialogTitle>
              <DialogDescription>
                Detailed overview of the campaign.
              </DialogDescription>
            </DialogHeader>
            <MarketingOverviewCard />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MarketingPage;
