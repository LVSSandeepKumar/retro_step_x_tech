"use client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import axios from "axios";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Pagination from "../../../../../../components/ui/Pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

uuidv4();

/* ----------------------------------------
   TruncatedText Component
---------------------------------------- */
const TruncatedText = ({ text, className }) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  const handleClick = () => {
    setExpanded(true);
  };

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setExpanded(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded]);

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`cursor-pointer ${!expanded ? "truncate" : ""} ${className}`}
      title={text}
    >
      {text}
    </div>
  );
};

/* ----------------------------------------
   JobCardTable Component
---------------------------------------- */
const JobCardTable = ({ jobCards, currentPosts, onDelete, postsPerPage, setCurrentPage, currentPage }) => {
  const tableHeaders = [
    "Sl No",
    "Job Card No",
    "Customer",
    "Mobile No",
    "Chassis No",
    "Job Card Type",
    "Opened On",
    "OSJ",
    "Status",
    "Amount",
  ];

  const MotionTableRow = motion.create(TableRow);
  const pathname = usePathname();
  const brandName = pathname.split("/")[2];
  const locationName = pathname.split("/")[4];

  return (
    <div className="overflow-x-auto w-full">
      <Table className="shadow-lg w-full rounded-lg">
        <TableHeader>
          <TableRow className="bg-gray-200 w-full m-0 text-left">
            {tableHeaders.map((header, index) => (
              <TableHead key={index} className="py-2 border-b font-bold text-xs sm:text-sm pl-1">
                <TruncatedText text={header} className="w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPosts.map((jobCard, index) => (
            <MotionTableRow
              key={index}
              className="hover:bg-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <TableCell className="py-2 text-left border-b text-xs sm:text-sm pl-2">
                {(currentPage - 1) * postsPerPage + index + 1}
              </TableCell>
              <TableCell className="py-2 text-left border-b text-xs sm:text-sm pl-1">
                <Link href={`/brands/${brandName}/locations/${locationName}/job-card/${jobCard.code}`} passHref>
                  <TruncatedText text={jobCard.code || "N/A"} className="w-full" />
                </Link>
              </TableCell>
              <TableCell className="py-2 text-left border-b text-xs sm:text-sm pl-1">
                {jobCard.customer.name || "N/A"}
              </TableCell>
              <TableCell className="py-2 text-left border-b text-xs sm:text-sm pl-1">
                {jobCard.customer.phone || "N/A"}
              </TableCell>
              <TableCell className="py-2 text-left border-b text-xs sm:text-sm pl-1">
                {jobCard.vehicle.chassisNo || "N/A"}
              </TableCell>
              <TableCell className="py-2 text-left border-b text-xs sm:text-sm pl-1">
                {jobCard.jobCardType.name || "N/A"}
              </TableCell>
              <TableCell className="py-2 text-left border-b text-xs sm:text-sm pl-1">
                {formatDate(jobCard.createdAt) || "N/A"}
              </TableCell>
              <TableCell className="py-2 text-left border-b text-xs sm:text-sm pl-1">
                {jobCard.osj?.amount || "N/A"}
              </TableCell>
              <TableCell className="py-2 text-left border-b text-xs sm:text-sm pl-1">
                {jobCard.jobCardStatus || "N/A"}
              </TableCell>
              <TableCell className="py-2 text-left border-b text-xs sm:text-sm pl-1">
                {`₹${jobCard.amount}` || "N/A"}
              </TableCell>
            </MotionTableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        totalPosts={jobCards.length}
        postsPerPage={postsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

/* ----------------------------------------
   SummaryCard Component
---------------------------------------- */
const SummaryCard = ({ title, count, amount, color }) => {
  return (
    <div className="bg-white rounded-lg shadow sm:p-2 md:p-4 mb-2">
      <div className="flex justify-between items-center ">
        <div className={`flex flex-col gap-y-1 text-${color}`}>
          <h1 className="font-bold text-xl">{title}</h1>
        </div>
        <div
          className={`border-4 border-${color} rounded-full relative flex items-center justify-center sm:size-10 md:size-20 lg:size-30`}
        >
          <p className="absolute text-center text-lg font-bold">{count ? count : `₹${amount}`}</p>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------
   Date Filter Helper
---------------------------------------- */
const getDateRange = (filter) => {
  const now = new Date();
  switch (filter) {
    case "Today":
      return {
        from: new Date(now.setHours(0, 0, 0, 0)).toISOString(),
        to: new Date(now.setHours(23, 59, 59, 999)).toISOString(),
      };
    case "This Week":
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return {
        from: new Date(weekAgo.setHours(0, 0, 0, 0)).toISOString(),
        to: new Date(now.setHours(23, 59, 59, 999)).toISOString(),
      };
    case "This Month":
      const monthAgo = new Date(now);
      monthAgo.setDate(now.getDate() - 30);
      return {
        from: new Date(monthAgo.setHours(0, 0, 0, 0)).toISOString(),
        to: new Date(now.setHours(23, 59, 59, 999)).toISOString(),
      };
    case "This Year":
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      return {
        from: new Date(yearAgo.setHours(0, 0, 0, 0)).toISOString(),
        to: new Date(now.setHours(23, 59, 59, 999)).toISOString(),
      };
    default:
      return {
        from: "",
        to: "",
      };
  }
};

/* ----------------------------------------
   Main Page: JobCardPage Component
---------------------------------------- */
export default function JobCardPage() {
  const [jobCards, setJobCards] = useState([]);
  const [jobCardsLoading, setJobCardsLoading] = useState(true);
  const [jobCardsError, setJobCardsError] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(25);
  const [newJobCard, setNewJobCard] = useState({
    jobCardNumber: "",
    regNo: "",
    jobCardDate: "",
    branch: "",
    model: "",
    chassisNo: "",
    customer: "",
    customerName: "",
    mobileNo: "",
    city: "",
    serviceAdvisor: "",
    readyForBill: "",
    source: "",
    status: "",
    totalAmount: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [showInput, setShowInput] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const brandName = searchParams.get("brandName") || "defaultBrand";
  const locationName = searchParams.get("locationName");

  // Fetch all job cards or filtered job cards based on search or date filter
  useEffect(() => {
    async function fetchJobCards() {
      try {
        setJobCardsLoading(true);
        
        // Handle different API calls based on filter state
        let data;
        
        if (searchInput && searchInput.trim() !== "") {
          // Search by query
          const response = await axios.get(`http://localhost:5001/api/job-card?query=${searchInput}&pageSize=100000`);
          data = response.data.data.jobCards;
        } else if (dateFilter !== "All") {
          // Filter by date
          const { from, to } = getDateRange(dateFilter);
          const response = await axios.get(`http://localhost:5001/api/job-card?from=${from}&to=${to}&pageSize=100000`);
          data = response.data.data.jobCards;
        } else {
          // Get all job cards (paginated fetch)
          data = await getAllJobCards();
        }
        
        if (!data) {
          setJobCardsError("Error fetching job cards. Please try again later.");
        } else {
          setJobCards(data);
          // Reset to page 1 whenever filter changes
          setCurrentPage(1);
        }
      } catch (error) {
        setJobCardsError("Error fetching job cards. Please try again later.");
        console.error(error);
      } finally {
        setJobCardsLoading(false);
      }
    }
    
    fetchJobCards();
  }, [searchInput, dateFilter]);

  // Fetch summary counts from the /count endpoint
  useEffect(() => {
    async function fetchSummary() {
      try {
        setSummaryLoading(true);
        const response = await axios.get("http://localhost:5001/api/job-card/count");
        console.info(`Counts fetched: ${JSON.stringify(response.data.data)}`);
        if (!response.data.data) {
          setSummaryError("Error fetching summary counts. Please try again later.");
        } else {
          setSummaryData(response.data.data);
        }
      } catch (error) {
        setSummaryError("Error fetching summary counts. Please try again later.");
        console.error("Error fetching summary counts:", error);
      } finally {
        setSummaryLoading(false);
      }
    }
    fetchSummary();
  }, []);

  // Get all job cards with pagination from API
  async function getAllJobCards() {
    try {
      let page = 1;
      const pageSize = 25;
      let allJobCards = [];
      let hasMore = true;
      while (hasMore) {
        const response = await axios.get(`http://localhost:5001/api/job-card?page=${page}&pageSize=${pageSize}`);
        const fetchedJobCards = response.data.data.jobCards;
        console.log("Job card fetched => ", fetchedJobCards);
        if (fetchedJobCards && fetchedJobCards.length > 0) {
          allJobCards = allJobCards.concat(fetchedJobCards);
          page++;
        } else {
          hasMore = false;
        }
      }
      return allJobCards;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Calculate current page data for the table
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = jobCards.slice(firstPostIndex, lastPostIndex);

  const handleAddCardClick = () => {
    setShowInput(true);
  };

  const handleAddJobCardClick = () => {
    router.push(`/brands/${brandName}/locations/${locationName}/job-card/job-card-details`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJobCard((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function getAllJobCards() {
    try {
      let page = 1;
      const pageSize = 10;
      let allJobCards = [];
      let hasMore = true;
      while (hasMore) {
        const response = await axios.get(
          `http://localhost:5001/api/job-card?page=${page}&pageSize=${pageSize}`
        );
        const fetchedJobCards = response.data.data.jobCards;
        console.log("Job card fetched => ", fetchedJobCards);
        if (fetchedJobCards && fetchedJobCards.length > 0) {
          allJobCards = allJobCards.concat(fetchedJobCards);
          page++;
        } else {
          hasMore = false;
        }
      }
      return allJobCards;
    } catch (error) {
      console.error(error);
    }
  }

  const handleInputSave = async () => {
    const response = await fetch("/api/job-cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newJobCard),
    });
    if (response.ok) {
      const newCard = await response.json();
      setJobCards([...jobCards, newCard]);
      setShowInput(false);
    } else {
      console.error("Failed to save job card");
    }
  };

  const handleCancel = () => {
    setShowInput(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
  };

  const handleSearchSubmit = async () => {
    if (searchInput.trim() === "") {
      // If search is empty, reset to all job cards
      const data = await getAllJobCards();
      setJobCards(data);
      setCurrentPage(1);
    } else {
      try {
        const response = await axios.get(`http://localhost:5001/api/job-card?query=${searchInput}`);
        setJobCards(response.data.data.jobCards);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error searching job cards:", error);
      }
    }
  };

  const handleDelete = (index) => {
    setJobCards((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col sm:p-2 lg:p-6 bg-gray-50 min-h-screen overflow-x-hidden text-xs sm:text-sm md:text-base">
      {/* Top: Search and Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-4">
        <div className="flex items-center w-full gap-2 sm:gap-4 lg:gap-2">
          <div className="flex gap-4 items-center w-full max-w-4xl">
            <div className="flex items-center w-full">
              <Input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                className="border border-black p-1 rounded w-full"
                placeholder="Customer Name, Mobile No, Chassis No, Job Card No"
              />
            </div>
            <Button onClick={handleSearchSubmit} className="px-2 sm:px-4">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center px-2 2xl:mx-6">
          <Select
            value={dateFilter}
            onValueChange={(value) => {
              setDateFilter(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="This Week">This Week</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
              <SelectItem value="This Year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {summaryLoading ? (
          <div className="bg-white rounded-lg shadow 2xl:p-10 sm:p-2 flex items-center justify-center mb-2">
            <p className="text-blue-500 text-center">Loading summary...</p>
          </div>
        ) : summaryError ? (
          <div className="bg-white rounded-lg shadow 2xl:p-10 sm:p-2 flex items-center justify-center mb-2">
            <p className="text-red-500 text-center">{summaryError}</p>
          </div>
        ) : (
          <>
            {/* Total Cards */}
            {summaryData && summaryData.totalCount != null ? (
              <SummaryCard title="Total Job Cards" count={summaryData.totalCount} color="black" />
            ) : (
              <div className="bg-white rounded-lg shadow 2xl:p-10 sm:p-2 flex items-center justify-center mb-2">
                <p className="text-red-500 text-center">Error in Fetching Total Cards</p>
              </div>
            )}

            {/* Pending */}
            {summaryData && summaryData.pending != null ? (
              <SummaryCard title="Pending Job Cards" count={summaryData.pending} color="red-500" />
            ) : (
              <div className="bg-white rounded-lg shadow 2xl:p-10 sm:p-2 flex items-center justify-center mb-2">
                <p className="text-red-500 text-center">Error in Fetching Pending Count</p>
              </div>
            )}

            {/* Invoice */}
            {summaryData && summaryData.completed != null ? (
              <SummaryCard title="Invoiced Job Cards" count={summaryData.completed || "0"} color="green-500" />
            ) : (
              <div className="bg-white rounded-lg shadow 2xl:p-10 sm:p-2 flex items-center justify-center mb-2">
                <p className="text-red-500 text-center">Error fetching Invoice data</p>
              </div>
            )}

            {/* Total Value */}
            {summaryData && summaryData.totalAmount != null ? (
              <SummaryCard title="Total Value" amount={summaryData.totalAmount} color="black" />
            ) : (
              <div className="bg-white rounded-lg shadow 2xl:p-10 sm:p-2 flex items-center justify-center mb-2">
                <p className="text-red-500 text-center">Error fetching Total Value</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* MAIN Layout: Table Section */}
      <div className="mt-4 sm:p-2 2xl:p-6 border-gray-300 border-2 rounded-lg shadow-sm bg-white">
        {jobCardsLoading ? (
          <div className="p-4 text-center">Loading job cards...</div>
        ) : jobCardsError ? (
          <div className="p-4 text-red-500 text-center">{jobCardsError}</div>
        ) : jobCards.length === 0 ? (
          <div className="p-4 text-center">No job cards found.</div>
        ) : (
          <JobCardTable
            jobCards={jobCards}
            currentPosts={currentPosts}
            setCurrentPage={setCurrentPage}
            postsPerPage={postsPerPage}
            currentPage={currentPage}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal: Add New Customer/Vehicle */}
      {showInput && (
        <motion.div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0, transform: "scale(0.9)" }}
          animate={{ opacity: 1, transform: "scale(1)" }}
          transition={{ duration: 0.3, ease: "easeIn" }}
        >
          <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-4/5 max-w-4xl">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <h3 className="col-span-2 text-sm sm:text-lg font-semibold text-center">Add Customer Details</h3>
              <input
                type="text"
                name="name"
                value={newJobCard.name || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Name"
              />
              <input
                type="text"
                name="mobileNo"
                value={newJobCard.mobileNo || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Mobile No"
              />
              <input
                type="text"
                name="address"
                value={newJobCard.address || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Address"
              />
              <input
                type="email"
                name="email"
                value={newJobCard.email || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Email"
              />
              <h3 className="col-span-2 text-sm sm:text-lg font-semibold text-center mt-2">Add Vehicle Details</h3>
              <input
                type="text"
                name="brand"
                value={newJobCard.brand || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Brand"
              />
              <input
                type="text"
                name="modelNo"
                value={newJobCard.modelNo || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Model No"
              />
              <input
                type="text"
                name="yearOfManufacture"
                value={newJobCard.yearOfManufacture || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Year of Manufacture"
              />
              <input
                type="text"
                name="engineNo"
                value={newJobCard.engineNo || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Engine No"
              />
              <input
                type="text"
                name="chassisNo"
                value={newJobCard.chassisNo || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Chassis No"
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button onClick={handleCancel} className="bg-red-500 text-white px-2 py-1">
                Cancel
              </Button>
              <Button onClick={handleInputSave} className="bg-blue-500 text-white px-2 py-1">
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}