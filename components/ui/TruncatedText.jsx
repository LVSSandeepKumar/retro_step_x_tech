import React, { useState } from "react";

const TruncatedText = ({ text, width, limit = 20, className = "" }) => {
  const [expanded, setExpanded] = useState(false);
  // Ensure that text is a string before using slice
  const str = typeof text === "string" ? text : String(text || "");

  if (expanded || str.length <= limit) {
    return (
      <span
        className={`${className} cursor-pointer`}
        onClick={() => setExpanded(false)}
        title={str}
      >
        {str}
      </span>
    );
  }

  const truncated = str.slice(0, limit) + "...";
  return (
    <span
      className={`${className} cursor-pointer`}
      onClick={() => setExpanded(true)}
      title={str}
      style={{
        width,
        display: "inline-block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {truncated}
    </span>
  );
};

export default TruncatedText;
