import React from "react";

const Pagination = ({ totalPosts, postsPerPage, setCurrentPage, currentPage }) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Determine the current page group (each group contains 10 pages)
  const pageGroup = Math.floor((currentPage - 1) / 10);
  const startPage = pageGroup * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);

  // Create an array of pages for the current group
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Handler to navigate to the previous group
  const handlePrevGroup = () => {
    setCurrentPage(startPage - 1);
  };

  // Handler to navigate to the next group
  const handleNextGroup = () => {
    setCurrentPage(endPage + 1);
  };

  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      {startPage > 1 && (
        <button
          onClick={handlePrevGroup}
          className="w-12 h-10 text-lg font-bold rounded-md cursor-pointer transition-all duration-300 bg-white border border-gray-300 hover:bg-gray-100"
        >
          Prev
        </button>
      )}

      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(page)}
          className={
            page === currentPage
              ? "w-12 h-10 font-bold text-lg rounded-md cursor-pointer transition-all duration-300 border border-blue-500 bg-blue-100 text-blue-700"
              : "w-12 h-10 font-bold text-lg rounded-md cursor-pointer transition-all duration-300 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <button
          onClick={handleNextGroup}
          className="w-12 h-10 text-lg font-bold rounded-md cursor-pointer transition-all duration-300 bg-white border border-gray-300 hover:bg-gray-100"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
