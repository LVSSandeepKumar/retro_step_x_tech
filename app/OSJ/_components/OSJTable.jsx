import React, { useState } from 'react';
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

const OSJTable = ({ data, totals, isCountView, title }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || amount === 0) return '-';
    const formattedValue = Math.abs(amount).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
    return amount > 0 ? formattedValue : `-${formattedValue}`;
  };

  const formatCount = (count) => {
    if (count === undefined || count === null || count === 0) return '-';
    return count.toLocaleString('en-IN');
  };

  const sortData = (items, sortConfig) => {
    if (!sortConfig.key) return items;

    const sortedItems = [...items].sort((a, b) => {
      const aValue = isCountView ? 
        (sortConfig.key === 'osjProfit' ? a.osjProfitCount : 
         sortConfig.key === 'osjLoss' ? a.osjLossCount :
         sortConfig.key === 'expenseNotPunched' ? a.expenseCount :
         sortConfig.key === 'collectionNotFound' ? a.collectionCount : 
         a.totalCount) :
        a[sortConfig.key];
      const bValue = isCountView ? 
        (sortConfig.key === 'osjProfit' ? b.osjProfitCount : 
         sortConfig.key === 'osjLoss' ? b.osjLossCount :
         sortConfig.key === 'expenseNotPunched' ? b.expenseCount :
         sortConfig.key === 'collectionNotFound' ? b.collectionCount : 
         b.totalCount) :
        b[sortConfig.key];

      // New sorting logic
      if (sortConfig.direction === 'asc') {
        // For ascending order: negative values first, then positive values
        if (aValue < 0 && bValue >= 0) return -1;
        if (aValue >= 0 && bValue < 0) return 1;
        return aValue - bValue;
      }
      // For descending order: positive values first, then negative values
      if (aValue >= 0 && bValue < 0) return -1;
      if (aValue < 0 && bValue >= 0) return 1;
      return bValue - aValue;
    });

    return sortedItems;
  };

  const requestSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getTotalCount = (key) => {
    if (!data || !Array.isArray(data)) return 0;
    switch(key) {
      case 'osjProfit':
        return data.reduce((sum, row) => sum + (row.osjProfitCount || 0), 0);
      case 'osjLoss':
        return data.reduce((sum, row) => sum + (row.osjLossCount || 0), 0);
      case 'expenseNotPunched':
        return data.reduce((sum, row) => sum + (row.expenseCount || 0), 0);
      case 'collectionNotFound':
        return data.reduce((sum, row) => sum + (row.collectionCount || 0), 0);
      case 'total':
        return data.reduce((sum, row) => sum + (row.totalCount || 0), 0);
      default:
        return 0;
    }
  };

  const sortedData = sortData(data, sortConfig);

  const headers = [
    { key: 'location', label: 'Location', width: '16%', align: 'left' },
    { key: 'osjProfit', label: 'OSJ Profit', width: '16%', align: 'right' },
    { key: 'osjLoss', label: 'OSJ Loss', width: '16%', align: 'right' },
    { 
      key: 'expenseNotPunched', 
      label: ['Expense', 'Not Punched'],
      width: '16%',
      align: 'right'
    },
    { 
      key: 'collectionNotFound', 
      label: ['Collection', 'Not Found'],
      width: '16%',
      align: 'right'
    },
    { key: 'total', label: 'Total', width: '20%', align: 'right' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">
        {title || `OSJ Details (${isCountView ? 'Count' : 'Amount'})`}
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead 
                key={header.key}
                className={`${header.align === 'right' ? 'text-right' : 'text-left'} cursor-pointer w-[${header.width}]`}
                onClick={() => requestSort(header.key)}
                style={{ width: header.width }}
              >
                <div className={`flex ${header.align === 'right' ? 'justify-end' : 'justify-start'} gap-2`}>
                  <div className={`text-${header.align}`}>
                    {Array.isArray(header.label) ? (
                      header.label.map((line, i) => (
                        <div key={i} className="leading-tight">{line}</div>
                      ))
                    ) : (
                      header.label
                    )}
                  </div>
                  {header.key !== 'location' && <ArrowUpDown className="h-4 w-4 flex-shrink-0" />}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow key={row.originalLocation}>
              <TableCell className="font-medium">{row.location}</TableCell>
              <TableCell className="text-right text-green-600">
                {isCountView ? formatCount(row.osjProfitCount) : formatCurrency(row.osjProfit)}
              </TableCell>
              <TableCell className="text-right text-red-600">
                {isCountView ? formatCount(row.osjLossCount) : formatCurrency(row.osjLoss)}
              </TableCell>
              <TableCell className="text-right text-yellow-600">
                {isCountView ? 
                  formatCount(row.expenseCount) :
                  formatCurrency(row.expenseNotPunched)}
              </TableCell>
              <TableCell className="text-right text-indigo-600">
                {isCountView ?
                  formatCount(row.collectionCount) :
                  formatCurrency(row.collectionNotFound)}
              </TableCell>
              <TableCell className={`text-right font-semibold ${row.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {isCountView ? formatCount(row.totalCount) : formatCurrency(row.total)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="border-t-2">
            <TableCell className="font-bold">Total</TableCell>
            <TableCell className="text-right font-bold text-green-600">
              {isCountView ? 
                formatCount(getTotalCount('osjProfit')) :
                formatCurrency(data.reduce((sum, row) => sum + (row.osjProfit || 0), 0))}
            </TableCell>
            <TableCell className="text-right font-bold text-red-600">
              {isCountView ? 
                formatCount(getTotalCount('osjLoss')) :
                formatCurrency(data.reduce((sum, row) => sum + (row.osjLoss || 0), 0))}
            </TableCell>
            <TableCell className="text-right font-bold text-yellow-600">
              {isCountView ? 
                formatCount(getTotalCount('expenseNotPunched')) :
                formatCurrency(totals.expenseNotPunched)}
            </TableCell>
            <TableCell className="text-right font-bold text-indigo-600">
              {isCountView ?
                formatCount(getTotalCount('collectionNotFound')) :
                formatCurrency(totals.collectionNotFound)}
            </TableCell>
            <TableCell className={`text-right font-bold ${totals.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {isCountView ? 
                formatCount(getTotalCount('total')) :
                formatCurrency(totals.total)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default OSJTable;