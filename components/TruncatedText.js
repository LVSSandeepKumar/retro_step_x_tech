import React, { useState, useRef, useEffect } from "react";

const TruncatedText = ({ text, maxLength = 10, width = "180px" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);

  const handleClick = () => {
    setIsExpanded(true);
  };

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  if (!text) return null;
  if (text.length <= maxLength) return <span>{text}</span>;
  
  return (
    <span
      ref={ref}
      onClick={handleClick}
      style={{
        cursor: "pointer",
        display: "inline-block",
        width,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      title={isExpanded ? "" : "Click to expand"}
    >
      {isExpanded ? text : text.slice(0, maxLength) + "..."}
    </span>
  );
};

export default TruncatedText;
