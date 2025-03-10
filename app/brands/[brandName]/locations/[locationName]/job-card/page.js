// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";
// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Plus, Edit, Trash } from "lucide-react";
// import { v4 as uuidv4 } from "uuid";
// import JobCardDetails from "./job-card-details/page";
// import Pagination from "../../../../../../components/ui/Pagination";
// uuidv4();

// const Table = ({ children, className }) => (
//   <table className={`table-auto ${className}`}>{children}</table>
// );

// const TableHeader = ({ children }) => <thead>{children}</thead>;

// const TableBody = ({ children }) => <tbody>{children}</tbody>;

// const TableHead = ({ children, className }) => (
//   <th className={className}>{children}</th>
// );

// const TableRow = ({ children, className, ...props }) => (
//   <tr className={className} {...props}>
//     {children}
//   </tr>
// );

// const TableCell = ({ children, className }) => (
//   <td className={className}>{children}</td>
// );

// const JobCardTable = ({ jobCards, currentPosts,onDelete,postsPerPage,setCurrentPage,currentPage }) => {
//   const tableHeaders = [
//     "Sr No",
//     "Job Card No",
//     "Last Serviced",
//     "Last KM",
//     "Job Card Type",
//     "Total Amount",
//     "Actions",
//   ];

//   const MotionTableRow = motion.create(TableRow);

//   const pathname = usePathname();
//   const brandName = pathname.split("/")[2];
//   const locationName = pathname.split("/")[4];

//   return (
//     <div className="overflow-x-auto w-full">
//       <Table className="bg-gray-100 shadow-lg w-full rounded-lg">
//         <TableHeader>
//           <TableRow className="bg-gray-200 w-full">
//             {tableHeaders.map((header, index) => (
//               <TableHead key={index} className="py-2 px-4 border-b font-bold">
//                 {header}
//               </TableHead>
//             ))}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {currentPosts.map((jobCard, index) => (
//             <MotionTableRow
//               key={index}
//               className="hover:bg-gray-100"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <TableCell className="py-2 text-center px-4 border-b">
//                 {index + 1}
//               </TableCell>
//               <TableCell className="py-2 text-center px-4 border-b">
//                 <Link
//                   href={`/brands/${brandName}/locations/${locationName}/job-card/${jobCard.code}`}
//                   passHref
//                 >
//                   {jobCard.code || "N/A"}
//                 </Link>
//               </TableCell>
//               <TableCell className="py-2 text-center px-4 border-b">
//                 {jobCard.servicedDate || "N/A"}
//               </TableCell>
//               <TableCell className="py-2 text-center px-4 border-b">
//                 {jobCard.generalDetails?.kmReading || "N/A"}
//               </TableCell>
//               <TableCell className="py-2 text-center px-4 border-b">
//                 {jobCard.jobCardType.name || "N/A"}
//               </TableCell>
//               <TableCell className="py-2 text-center  px-4 border-b">
//                 {jobCard.totalAmount || "N/A"}
//               </TableCell>
//               <TableCell className="py-2 px-4 border-b flex gap-2">
//                 <Button variant="outline" size="icon">
//                   <Edit className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => onDelete(index)}
//                 >
//                   <Trash className="h-4 w-4" />
//                 </Button>
//               </TableCell>
//             </MotionTableRow>
//           ))}
//         </TableBody>
//       </Table>
//       <Pagination totalPosts={jobCards.length} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
//     </div>
//   );
// };

// const JobCardPage = () => {
//   const [jobCards, setJobCards] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [showInput, setShowInput] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1)
//   const [postsPerPage, setPostsPerPage] = useState(25);

//   const [newJobCard, setNewJobCard] = useState({
//     jobCardNumber: "",
//     regNo: "",
//     jobCardDate: "",
//     branch: "",
//     model: "",
//     chassisNo: "",
//     customer: "",
//     customerName: "",
//     mobileNo: "",
//     city: "",
//     serviceAdvisor: "",
//     readyForBill: "",
//     source: "",
//     status: "",
//     totalAmount: "",
//   });
//   const [searchInput, setSearchInput] = useState("");
//   const router = useRouter();

//   const lastPostIndex = currentPage * postsPerPage
//   const firstPostIndex = lastPostIndex - postsPerPage
//   const currentPosts = jobCards.slice(firstPostIndex, lastPostIndex)

//   const searchParams = useSearchParams();
//   const brandName = searchParams.get("brandName") || "defaultBrand";
//   const locationName = searchParams.get("locationName");

//   useEffect(() => {
//     const fetchJobCards = async () => {
//       const data = await getAllJobCards();
//       setJobCards(data);
//       // Optionally, initialize searchResults with all job cards:
//       setSearchResults(data);
//       // console.log(data);
//     };

//     fetchJobCards();
//   }, []);

//   const handleAddCardClick = () => {
//     setShowInput(true);
//   };

//   const handleAddJobCardClick = () => {
//     router.push(
//       `/brands/${brandName}/locations/${locationName}/job-card/job-card-details`
//     );
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewJobCard((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const getAllJobCards = async () => {
//     try {
//       let page = 1;
//       const pageSize = 25;
//       let allJobCards = [];
//       let hasMore = true;

//       while (hasMore) {
//         const response = await axios.get(
//           `http://3.7.2.124:5000/api/job-card?page=${page}&pageSize=${pageSize}`
//         );
//         const fetchedJobCards = response.data.data;
//         if (fetchedJobCards && fetchedJobCards.length > 0) {
//           allJobCards = allJobCards.concat(fetchedJobCards);
//           page++;
//         } else {
//           hasMore = false;
//         }
//       }
//       console.log(allJobCards);
//       return allJobCards;
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleInputSave = async () => {
//     const response = await fetch("/api/job-cards", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(newJobCard),
//     });

//     if (response.ok) {
//       const newCard = await response.json();
//       setJobCards([...jobCards, newCard]);
//       setSearchResults([...jobCards, newCard]);
//       setShowInput(false);
//     } else {
//       console.error("Failed to save job card");
//     }
//   };

//   const handleCancel = () => {
//     setShowInput(false);
//   };

//   const handleSearchChange = (e) => {
//     setSearchInput(e.target.value);
//   };

//   const handleSearchSubmit = async () => {
//     const response = await fetch(`/api/job-cards?search=${searchInput}`);
//     const data = await response.json();
//     setSearchResults(data);
//   };

//   const handleDelete = (index) => {
//     // Adjust deletion from searchResults if needed.
//     setSearchResults((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Determine which job cards to display: if searchResults is empty, fallback to jobCards.
//   const displayedJobCards = searchResults.length ? searchResults : jobCards;

//   return (
//     <div className="flex flex-col p-8 bg-gray-50 min-h-screen overflow-x-hidden">
//       <div className="flex items-center gap-4 mb-4">
//         <Button onClick={() => router.back()} className="bg-black text-white">
//           <ArrowLeft className="" />
//         </Button>
//         <div className="flex items-center justify-between w-full border-black ml-10 gap-4">
//           <div>
//             <input
//               type="text"
//               value={searchInput}
//               onChange={handleSearchChange}
//               className="border-[1px] mr-4 border-black p-2 rounded"
//               placeholder="Mobile No/Bike No"
//             />
//             <Button
//               onClick={handleSearchSubmit}
//               className = "px-6"
//             >
//               Search

//             </Button>
//           </div>
//           <div>
//             <Button
//               onClick={handleAddCardClick}
//               className="p-4 m-2"
//             >
//               <Plus className="mr-2" /> Add Customer
//             </Button>
//             <Button
//               onClick={handleAddJobCardClick}
//               className="p-4 "
//             >
//               <Plus className="mr-2" /> Create Job Card
//             </Button>
//           </div>
//         </div>
//       </div>
//       <div className="content w-full overflow-x-auto">
//         <JobCardTable jobCards={displayedJobCards} currentPosts={currentPosts} setCurrentPage={setCurrentPage} postsPerPage={postsPerPage} currentPage={currentPage} onDelete={handleDelete} />
//       </div>
//       {showInput && (
//         <motion.div
//           className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
//           initial={{ opacity: 0, transform: "scale(0.9)" }}
//           animate={{ opacity: 1, transform: "scale(1)" }}
//           transition={{ duration: 0.3, ease: "easeIn" }}
//         >
//           <div className="bg-white p-8 rounded-lg shadow-lg w-4/5 max-w-4xl">
//             <div className="grid grid-cols-2 gap-5">
//               <h3 className="col-span-2 text-xl font-semibold mt-4 text-center">
//                 Add Customer Details
//               </h3>
//               <input
//                 type="text"
//                 name="name"
//                 value={newJobCard.name}
//                 onChange={handleInputChange}
//                 className="border p-2 rounded"
//                 placeholder="Name"
//               />
//               <input
//                 type="text"
//                 name="mobileNo"
//                 value={newJobCard.mobileNo}
//                 onChange={handleInputChange}
//                 className="border p-2 rounded"
//                 placeholder="Mobile No"
//               />
//               <input
//                 type="text"
//                 name="address"
//                 value={newJobCard.address}
//                 onChange={handleInputChange}
//                 className="border p-2 rounded"
//                 placeholder="Address"
//               />
//               <input
//                 type="email"
//                 name="email"
//                 value={newJobCard.email}
//                 onChange={handleInputChange}
//                 className="border p-2 rounded"
//                 placeholder="Email"
//               />
//               <h3 className="col-span-2 text-xl font-semibold mt-4 text-center">
//                 Add Vehicle Details
//               </h3>
//               <input
//                 type="text"
//                 name="brand"
//                 value={newJobCard.brand}
//                 onChange={handleInputChange}
//                 className="border p-2 rounded"
//                 placeholder="Brand"
//               />
//               <input
//                 type="text"
//                 name="modelNo"
//                 value={newJobCard.modelNo}
//                 onChange={handleInputChange}
//                 className="border p-2 rounded"
//                 placeholder="Model No"
//               />
//               <input
//                 type="text"
//                 name="yearOfManufacture"
//                 value={newJobCard.yearOfManufacture}
//                 onChange={handleInputChange}
//                 className="border p-2 rounded"
//                 placeholder="Year of Manufacture"
//               />
//               <input
//                 type="text"
//                 name="engineNo"
//                 value={newJobCard.engineNo}
//                 onChange={handleInputChange}
//                 className="border p-2 rounded"
//                 placeholder="Engine No"
//               />
//               <input
//                 type="text"
//                 name="chassisNo"
//                 value={newJobCard.chassisNo}
//                 onChange={handleInputChange}
//                 className="border p-2 rounded"
//                 placeholder="Chassis No"
//               />
//             </div>
//             <div className="flex justify-end mt-4">
//               <Button
//                 onClick={handleCancel}
//                 className="bg-red-500 text-white mr-2"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleInputSave}
//                 className="bg-blue-500 text-white"
//               >
//                 Save
//               </Button>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default JobCardPage;

"use client";
import React, { useEffect, useState } from "react";
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
    "Last Serviced",
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
              <TableHead key={index} className="py-2 px-4 border-b font-bold">
                {header}
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
              <TableCell className="py-2 text-center px-4 border-b">
                {index + 1}
              </TableCell>
              <TableCell className="py-2 text-center px-4 border-b">
                <Link
                  href={`/brands/${brandName}/locations/${locationName}/job-card/${jobCard.code}`}
                  passHref
                >
                  {jobCard.code || "N/A"}
                </Link>
              </TableCell>
              <TableCell className="py-2 text-center px-4 border-b">
                {jobCard.servicedDate || "N/A"}
              </TableCell>
              <TableCell className="py-2 text-center px-4 border-b">
                {jobCard.generalDetails?.kmReading || "N/A"}
              </TableCell>
              <TableCell className="py-2 text-center px-4 border-b">
                {jobCard.jobCardType.name || "N/A"}
              </TableCell>
              <TableCell className="py-2 text-center  px-4 border-b">
                {jobCard.totalAmount || "N/A"}
              </TableCell>
              <TableCell className="py-2 px-4 border-b flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(index)}
                >
                  <Trash className="h-4 w-4" />
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

// New reusable SummaryCard component
const SummaryCard = ({ title, count, amount, icon: IconComponent }) => {
  return (
    <div className= " bg-white rounded-lg shadow p-4 flex flex-row justify-around items-center mb-4 ">
      {IconComponent && <IconComponent className="text-blue-500" size={36} />}
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{count}</p>
      {amount !== undefined && (
        <p className="text-sm text-gray-600">₹ {amount}</p>
      )}
    </div>
  );
};

// Helper function to filter job cards based on a date filter
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

const JobCardPage = () => {
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
  // New state for the date filter
  const [dateFilter, setDateFilter] = useState("All");
  const router = useRouter();

  // Compute filtered job cards based on date filter.
  const filteredJobCards = filterJobCardsByDate(jobCards, dateFilter);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = filteredJobCards.slice(firstPostIndex, lastPostIndex);

  const searchParams = useSearchParams();
  const brandName = searchParams.get("brandName") || "defaultBrand";
  const locationName = searchParams.get("locationName");

  useEffect(() => {
    const fetchJobCards = async () => {
      const data = await getAllJobCards();
      setJobCards(data);
      setSearchResults(data);
    };

    fetchJobCards();
  }, []);

  // Compute summary values:
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

  const getAllJobCards = async () => {
    try {
      let page = 1;
      const pageSize = 10;
      let allJobCards = [];
      let hasMore = true;

      while (hasMore) {
        const response = await axios.get(
          `http://3.7.2.124:5000/api/job-card?page=${page}&pageSize=${pageSize}`
        );
        const fetchedJobCards = response.data.data;
        console.log(fetchedJobCards);
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
  };

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

  // Determine which job cards to display.
  const displayedJobCards = searchResults.length ? searchResults : jobCards;

  return (
    <div className="flex flex-col p-4 bg-gray-50 min-h-screen overflow-x-hidden">
      <div className="flex items-center gap-2 ">
        <div className="flex items-center justify-between w-full border-black gap-2">
          <div>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              className="border border-black p-[6px] rounded mr-2"
              placeholder="Mobile No/Bike No"
            />

            <Button onClick={handleSearchSubmit} className=" ">
              <Search className="h-5 w-5" />
            </Button>
          </div>
          <div>
            <Button onClick={handleAddCardClick} className="pl-1 m-2">
              <Plus className="mr-1" /> Customer
            </Button>
            <Button onClick={handleAddJobCardClick} className="pl-1">
              <Plus className="mr-1" /> Job Card
            </Button>
          </div>
        </div>
      </div>

      {/* Date Filter Dropdown */}
      <div className="flex justify-end p-4 mb-4">
        <label className="mr-2 font-medium text-gray-700">
          Filter by Date:
        </label>
        <select
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setCurrentPage(1); // Reset pagination when filter changes
          }}
          className="border border-gray-400 p-2 rounded"
        >
          <option value="All">All</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="This Week">This Week</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
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

      {/* Job Card Table */}
      <div className="content w-full overflow-x-auto">
        <JobCardTable
          jobCards={displayedJobCards}
          currentPosts={currentPosts}
          setCurrentPage={setCurrentPage}
          postsPerPage={postsPerPage}
          currentPage={currentPage}
          onDelete={handleDelete}
        />
      </div>

      {showInput && (
        <motion.div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0, transform: "scale(0.9)" }}
          animate={{ opacity: 1, transform: "scale(1)" }}
          transition={{ duration: 0.3, ease: "easeIn" }}
        >
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/5 max-w-4xl">
            <div className="grid grid-cols-2 gap-5">
              <h3 className="col-span-2 text-xl font-semibold  text-center">
                Add Customer Details
              </h3>
              <input
                type="text"
                name="name"
                value={newJobCard.name}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Name"
              />
              <input
                type="text"
                name="mobileNo"
                value={newJobCard.mobileNo}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Mobile No"
              />
              <input
                type="text"
                name="address"
                value={newJobCard.address}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Address"
              />
              <input
                type="email"
                name="email"
                value={newJobCard.email}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Email"
              />
              <h3 className="col-span-2 text-xl font-semibold mt-4 text-center">
                Add Vehicle Details
              </h3>
              <input
                type="text"
                name="brand"
                value={newJobCard.brand}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Brand"
              />
              <input
                type="text"
                name="modelNo"
                value={newJobCard.modelNo}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Model No"
              />
              <input
                type="text"
                name="yearOfManufacture"
                value={newJobCard.yearOfManufacture}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Year of Manufacture"
              />
              <input
                type="text"
                name="engineNo"
                value={newJobCard.engineNo}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Engine No"
              />
              <input
                type="text"
                name="chassisNo"
                value={newJobCard.chassisNo}
                onChange={handleInputChange}
                className="border p-2 rounded"
                placeholder="Chassis No"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleCancel}
                className="bg-red-500 text-white mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInputSave}
                className="bg-blue-500 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default JobCardPage;
