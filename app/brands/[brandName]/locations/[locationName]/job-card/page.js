"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import JobCardDetails from "./job-card-details/page";
import Pagination from "../../../../../../components/ui/Pagination";
import {
  FaInfoCircle,
  FaCar,
  FaUser,
  FaMapMarkerAlt,
  FaUserTie,
  FaWrench,
  FaCogs,
  FaList,
  FaHourglassHalf,
  FaMoneyBill,
} from "react-icons/fa";

uuidv4();

/* ----------------------------------------
   TruncatedText Component
   - Shows ellipsis when text overflows.
   - Expands on click and collapses when clicking outside.
----------------------------------------- */
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
   Reusable Table Components
----------------------------------------- */
const Table = ({ children, className }) => (
  <table className={`table-auto ${className}`}>{children}</table>
);
const TableHeader = ({ children }) => <thead>{children}</thead>;
const TableBody = ({ children }) => <tbody>{children}</tbody>;
const TableHead = ({ children, className }) => (
  <th className={className}>{children}</th>
);
const TableRow = ({ children, className, ...props }) => (
  <tr className={className} {...props}>
    {children}
  </tr>
);
const TableCell = ({ children, className }) => (
  <td className={className}>{children}</td>
);

/* ----------------------------------------
   JobCardTable Component
----------------------------------------- */
const JobCardTable = ({
  jobCards,
  currentPosts,
  onDelete,
  postsPerPage,
  setCurrentPage,
  currentPage,
}) => {
  const tableHeaders = [
    "Sr No",
    "Job Card No",
    // "Last Serviced",
    "Last KM",
    "Job Card Type",
    "Total Amount",
    "Actions",
  ];

  const MotionTableRow = motion.create(TableRow);
  const pathname = usePathname();
  const brandName = pathname.split("/")[2];
  const locationName = pathname.split("/")[4];

  return (
    <div className="overflow-x-auto w-full">
      <Table className="bg-gray-100 shadow-lg w-full rounded-lg">
        <TableHeader>
          <TableRow className="bg-gray-200 w-full">
            {tableHeaders.map((header, index) => (
              <TableHead
                key={index}
                className="py-2 px-2 sm:px-4 border-b font-bold text-xs sm:text-sm"
              >
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
              <TableCell className="py-2 text-center px-2 sm:px-4 border-b text-xs sm:text-sm">
                {index + 1}
              </TableCell>
              <TableCell className="py-2 text-center px-2 sm:px-4 border-b text-xs sm:text-sm">
                <Link
                  href={`/brands/${brandName}/locations/${locationName}/job-card/${jobCard.code}`}
                  passHref
                >
                  {/* Use TruncatedText for overflow */}
                  <TruncatedText
                    text={jobCard.code || "N/A"}
                    className="w-full"
                  />
                </Link>
              </TableCell>
              {/* <TableCell className="py-2 text-center px-2 sm:px-4 border-b text-xs sm:text-sm">
                {jobCard.servicedDate || "N/A"}
              </TableCell> */}
              <TableCell className="py-2 text-center px-2 sm:px-4 border-b text-xs sm:text-sm">
                {jobCard.generalDetails?.kmReading || "N/A"}
              </TableCell>
              <TableCell className="py-2 text-center px-2 sm:px-4 border-b text-xs sm:text-sm">
                {jobCard.jobCardType.name || "N/A"}
              </TableCell>
              <TableCell className="py-2 text-center px-2 sm:px-4 border-b text-xs sm:text-sm">
                {jobCard.totalAmount || "N/A"}
              </TableCell>
              <TableCell className="py-2 px-2 sm:px-4 border-b flex gap-1 sm:gap-2">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(index)}
                >
                  <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
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
----------------------------------------- */
const SummaryCard = ({ title, count, amount, icon: IconComponent }) => {
  return (
    <div className="bg-white rounded-lg shadow 2xl:p-10 sm:p-2 flex flex-row items-center justify-around mb-2">
      {IconComponent && <IconComponent className="text-blue-500" size={38} />}
      <div className="ml-2 2xl:flex">
        <p className="text-xs sm:text-sm text-gray-500">{title}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800">{count}</p>
        {amount !== undefined && (
          <p className="text-xs sm:text-sm text-gray-600">₹ {amount}</p>
        )}
      </div>
    </div>
  );
};

/* ----------------------------------------
   Date Filter Helper
----------------------------------------- */
const filterJobCardsByDate = (jobCards, filter) => {
  if (filter === "All") return jobCards;
  const now = new Date();
  if (filter === "Today") {
    return jobCards.filter((card) => {
      if (!card.servicedDate) return false;
      const cardDate = new Date(card.servicedDate);
      return cardDate.toDateString() === now.toDateString();
    });
  }
  if (filter === "Yesterday") {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return jobCards.filter((card) => {
      if (!card.servicedDate) return false;
      const cardDate = new Date(card.servicedDate);
      return cardDate.toDateString() === yesterday.toDateString();
    });
  }
  if (filter === "This Week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return jobCards.filter((card) => {
      if (!card.servicedDate) return false;
      const cardDate = new Date(card.servicedDate);
      return cardDate >= weekAgo && cardDate <= now;
    });
  }
  return jobCards;
};

/* ----------------------------------------
   Main Page: JobCardPage Component
----------------------------------------- */
export default function JobCardPage() {
  const [jobCards, setJobCards] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandName = searchParams.get("brandName") || "defaultBrand";
  const locationName = searchParams.get("locationName");

  useEffect(() => {
    async function fetchJobCards() {
      const data = await getAllJobCards();
      setJobCards(data);
      setSearchResults(data);
    }
    fetchJobCards();
  }, []);

  const filteredJobCards = filterJobCardsByDate(jobCards, dateFilter);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = filteredJobCards.slice(firstPostIndex, lastPostIndex);

  const totalJobCardsCount = jobCards.length;
  const totalJobCardsAmount = jobCards.reduce(
    (sum, card) => sum + Number(card.totalAmount || 0),
    0
  );
  const pendingCount = jobCards.filter(
    (card) => card.jobCardStatus === "Pending"
  ).length;
  const invoiceCards = jobCards.filter((card) => Number(card.totalAmount) > 0);
  const invoiceCount = invoiceCards.length;
  const totalInvoiceValue = invoiceCards.reduce(
    (sum, card) => sum + Number(card.totalAmount || 0),
    0
  );

  const handleAddCardClick = () => {
    setShowInput(true);
  };

  const handleAddJobCardClick = () => {
    router.push(
      `/brands/${brandName}/locations/${locationName}/job-card/job-card-details`
    );
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
          `http://192.168.0.6:5001/api/job-card?page=${page}&pageSize=${pageSize}`
        );
        console.log("Job card details data:- ",response.data.data.jobCards)
        const fetchedJobCards = response.data.data.jobCards;
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
      setSearchResults([...jobCards, newCard]);
      setShowInput(false);
    } else {
      console.error("Failed to save job card");
    }
  };

  const handleCancel = () => {
    setShowInput(false);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = async () => {
    const response = await fetch(`/api/job-cards?search=${searchInput}`);
    const data = await response.json();
    setSearchResults(data);
  };

  const handleDelete = (index) => {
    setSearchResults((prev) => prev.filter((_, i) => i !== index));
  };

  const displayedJobCards = searchResults.length ? searchResults : jobCards;

  return (
    <div className="flex flex-col sm:p-2  bg-gray-50 min-h-screen overflow-x-hidden  text-xs sm:text-sm md:text-base">
      {/* Top: Search and Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-4">
        <div className="flex items-center justify-between w-full gap-2 sm:gap-4 lg:gap-2">
          <div className="flex gap-2">
            <Button onClick={handleAddCardClick} className="p-1 sm:p-2">
              <Plus className="mr-1" /> Customer
            </Button>
            <Button onClick={handleAddJobCardClick} className="p-1 sm:p-2">
              <Plus className="mr-1" /> Job Card
            </Button>
          </div>
        </div>

          <div className="flex items-center">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              className="border border-black p-1 rounded "
              placeholder="Mobile No/Bike No"
            />
          </div>
            <Button onClick={handleSearchSubmit} className="px-2 sm:px-4">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>


      </div>
      <div className="flex justify-end items-center px-2 2xl:mx-6 mb-4 ">
        <label className="mr-2 font-medium  justify-end text-gray-700">
          Filter by Date:
        </label>
        <select
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-400 p-1 sm:p-2 rounded"
        >
          <option value="All">All</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="This Week">This Week</option>
        </select>
      </div>

      {/* Date Filter Dropdown */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 px-2 sm:px-4">
        <SummaryCard
          title="Total Cards"
          count={totalJobCardsCount}
          amount={totalJobCardsAmount}
          icon={FaList}
        />
        <SummaryCard
          title="Pending"
          count={pendingCount}
          icon={FaHourglassHalf}
        />
        <SummaryCard
          title="Invoice"
          count={invoiceCount}
          amount={totalInvoiceValue}
          icon={FaMoneyBill}
        />
      </div>

      {/* MAIN Layout: Single Column (Full Width) */}
      <div className="mt-4  sm:p-2 2xl:p-6 border-gray-300 border-2 rounded-lg shadow-sm bg-white">
        <JobCardTable
          jobCards={displayedJobCards}
          currentPosts={currentPosts}
          setCurrentPage={setCurrentPage}
          postsPerPage={postsPerPage}
          currentPage={currentPage}
          onDelete={handleDelete}
        />
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
              <h3 className="col-span-2 text-sm sm:text-lg font-semibold text-center">
                Add Customer Details
              </h3>
              <input
                type="text"
                name="name"
                value={newJobCard.name}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Name"
              />
              <input
                type="text"
                name="mobileNo"
                value={newJobCard.mobileNo}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Mobile No"
              />
              <input
                type="text"
                name="address"
                value={newJobCard.address}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Address"
              />
              <input
                type="email"
                name="email"
                value={newJobCard.email}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Email"
              />
              <h3 className="col-span-2 text-sm sm:text-lg font-semibold text-center mt-2">
                Add Vehicle Details
              </h3>
              <input
                type="text"
                name="brand"
                value={newJobCard.brand}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Brand"
              />
              <input
                type="text"
                name="modelNo"
                value={newJobCard.modelNo}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Model No"
              />
              <input
                type="text"
                name="yearOfManufacture"
                value={newJobCard.yearOfManufacture}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Year of Manufacture"
              />
              <input
                type="text"
                name="engineNo"
                value={newJobCard.engineNo}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Engine No"
              />
              <input
                type="text"
                name="chassisNo"
                value={newJobCard.chassisNo}
                onChange={handleInputChange}
                className="border border-gray-300 p-1 sm:p-2 rounded"
                placeholder="Chassis No"
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button
                onClick={handleCancel}
                className="bg-red-500 text-white px-2 py-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInputSave}
                className="bg-blue-500 text-white px-2 py-1"
              >
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
