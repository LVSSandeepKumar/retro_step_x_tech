"use client";

import React, { useState, useEffect } from "react";
import LocationOSJAnalysis from "./_components/LocationOSJAnalysis";
import OSJTable from "./_components/OSJTable";
import { locations } from "@/lib/constants";
import OSJDistributionChart from "./_components/OSJDistributionChart";
import OSJLossesPieChart from "./_components/OSJLossesPieChart";
import OSJMonthlyAnalysis from "./_components/OSJMonthlyAnalysis";

// Initial state with empty/zero values
const INITIAL_OSJ_DATA =
  locations
    .find((loc) => loc.type === "own")
    ?.cities.map((location) => ({
      location: location.replace(/-.*$/, ""), // Display name
      originalLocation: location, // Keep original for unique key
      osjProfit: 0,
      osjLoss: 0,
      osjProfitCount: 0,
      osjLossCount: 0,
      expenseNotPunched: 0,
      expenseCount: 0,
      collectionNotFound: 0,
      collectionCount: 0,
      total: 0,
      totalCount: 0,
    })) || [];

const INITIAL_TOTALS = {
  profits: 0,
  losses: 0,
  expenseNotPunched: 0,
  collectionNotFound: 0,
  total: 0,
  profitCount: 0,
  lossCount: 0,
  expenseCount: 0,
  collectionCount: 0,
  totalCount: 0,
};

const generateOSJData = (period) => {
  const multipliers = {
    YESTERDAY: 1,
    WEEKLY: 7,
    MONTHLY: 30,
    YTD: 365,
  };

  const baseAmount = 10000 * (multipliers[period] || 1);
  const baseCount = 5 * (multipliers[period] || 1);
  const ownLocations = locations.find((loc) => loc.type === "own")?.cities || [];

  return ownLocations.map((location) => {
    const isProfit = Math.random() < 0.8;
    const osjValue = Math.random() * baseAmount * (isProfit ? 1 : 0.5);
    
    // Calculate amounts first
    const osjProfit = isProfit ? Math.round(osjValue) : 0;
    const osjLoss = isProfit ? 0 : Math.round(-osjValue);
    const expenseNotPunched = Math.random() < 0.3 ? Math.round(Math.random() * (baseAmount * 0.5)) : 0;
    const collectionNotFound = Math.random() < 0.3 ? Math.round(-(Math.random() * (baseAmount * 0.3))) : 0;

    // Calculate counts based on amounts
    const osjProfitCount = osjProfit > 0 ? Math.max(1, Math.round(Math.random() * baseCount)) : 0;
    const osjLossCount = osjLoss < 0 ? Math.max(1, Math.round(Math.random() * baseCount)) : 0;
    const expenseCount = expenseNotPunched > 0 ? Math.max(1, Math.round(Math.random() * (baseCount * 0.3))) : 0;
    const collectionCount = collectionNotFound < 0 ? Math.max(1, Math.round(Math.random() * (baseCount * 0.2))) : 0;

    return {
      location: location.replace(/-.*$/, ""),
      originalLocation: location,
      osjProfit,
      osjLoss,
      osjProfitCount,
      osjLossCount,
      expenseNotPunched,
      expenseCount,
      collectionNotFound,
      collectionCount,
      total: osjProfit + osjLoss + expenseNotPunched + collectionNotFound,
      totalCount: osjProfitCount + osjLossCount + expenseCount + collectionCount,
    };
  });
};

const OSJPage = () => {
  const [period, setPeriod] = useState("YESTERDAY");
  const [osjData, setOsjData] = useState(INITIAL_OSJ_DATA);

  // Updated totals calculation
  const totals = osjData?.length
    ? osjData.reduce(
        (acc, row) => ({
          profits: acc.profits + row.osjProfit,
          losses: acc.losses + row.osjLoss,
          expenseNotPunched: acc.expenseNotPunched + row.expenseNotPunched,
          collectionNotFound: acc.collectionNotFound + row.collectionNotFound,
          total: acc.total + row.total,
          profitCount: acc.profitCount + row.osjProfitCount,
          lossCount: acc.lossCount + row.osjLossCount,
          expenseCount: acc.expenseCount + row.expenseCount,
          collectionCount: acc.collectionCount + row.collectionCount,
          totalCount: acc.totalCount + row.totalCount,
        }),
        INITIAL_TOTALS
      )
    : INITIAL_TOTALS;

  useEffect(() => {
    const newData = generateOSJData(period);
    setOsjData(newData);
  }, [period]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">OSJ Analysis</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OSJDistributionChart totals={totals} />
        <OSJLossesPieChart data={osjData} />
      </div>

      <LocationOSJAnalysis
        period={period}
        data={osjData}
        onPeriodChange={setPeriod}
      />
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
        <OSJTable
          data={osjData}
          totals={totals}
          isCountView={false}
          title="OSJ Details (Amount)"
        />
        <OSJTable
          data={osjData}
          totals={totals}
          isCountView={true}
          title="OSJ Details (Count)"
        />
      </div>

      <div>
        <OSJMonthlyAnalysis data={osjData} />
      </div>
    </div>
  );
};

export default OSJPage;
