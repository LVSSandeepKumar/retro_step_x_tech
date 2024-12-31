"use client";
import { createContext, useContext, useState } from "react";

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [heading, setHeading] = useState("");

  return (
    <HeaderContext.Provider value={{ heading, setHeading }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => useContext(HeaderContext);
