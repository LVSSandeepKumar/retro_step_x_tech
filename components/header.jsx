import React from "react";

const Header = ({ heading }) => {
  return (
    <header className="bg-gray-800 text-white p-4 mb-4 flex items-center justify-center rounded-sm">
      <h1 className="text-xl font-bold text-center">{heading}</h1>
    </header>
  );
};

export default Header;
