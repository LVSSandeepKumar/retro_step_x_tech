"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { enrichedParent } from "@/lib/relations";
import { useState } from "react";

export const OverviewTable = () => {
  const [selectedType, setSelectedType] = useState("All");

  const getOverviewData = () => {
    const overview = enrichedParent[0] || {
      sales: [],
      services: [],
      expenses: [],
      payments: [],
      inventory: [],
    };

    const data = {
      sales: {
        title: "Sales",
        data: overview.sales.map((s) => ({
          type: s.type,
          count: s.salesCount,
          value: `₹${s.salesValue}`,
        })),
      },
      services: {
        title: "Services",
        data: overview.services.map((s) => ({
          type: s.type,
          count: s.servicesCount,
          value: `₹${s.servicesValue}`,
          types: s.serviceTypes?.map((st) => ({
            name: st.type,
            count: st.serviceCount,
            value: `₹${st.serviceValue}`,
          })),
        })),
      },
      expenses: {
        title: "Expenses",
        data: overview.expenses.map((e) => ({
          type: e.type,
          value: `₹${e.expensesValue}`,
        })),
      },
      payments: {
        title: "Payments",
        data: overview.payments.map((p) => ({
          type: p.type,
          modes: p.paymentType.map((pt) => ({
            mode: pt.mode,
            value: `₹${pt.collections}`,
          })),
        })),
      },
      inventory: {
        title: "Inventory",
        data: overview.inventory.map((i) => ({
          type: i.type,
          count: i.stockCount,
          value: `₹${i.stockValue}`,
        })),
      },
    };

    // Add totals calculation
    const totals = {
      sales: {
        count: overview.sales.reduce((acc, curr) => acc + curr.salesCount, 0),
        value: overview.sales.reduce((acc, curr) => acc + curr.salesValue, 0),
      },
      services: {
        count: overview.services.reduce(
          (acc, curr) => acc + (curr.servicesCount || 0),
          0
        ),
        value: overview.services.reduce(
          (acc, curr) => acc + (curr.servicesValue || 0),
          0
        ),
      },
      expenses: {
        value: overview.expenses.reduce(
          (acc, curr) => acc + curr.expensesValue,
          0
        ),
      },
      payments: {
        value: overview.payments.reduce(
          (acc, curr) =>
            acc + curr.paymentType.reduce((sum, pt) => sum + pt.collections, 0),
          0
        ),
      },
      inventory: {
        count: overview.inventory.reduce(
          (acc, curr) => acc + curr.stockCount,
          0
        ),
        value: overview.inventory.reduce(
          (acc, curr) => acc + curr.stockValue,
          0
        ),
      },
    };

    return { data, totals };
  };

  const getFilteredOverviewData = () => {
    const { data, totals } = getOverviewData();

    if (selectedType === "All") {
      return { data, totals };
    }

    const filteredData = Object.keys(data).reduce((acc, key) => {
      acc[key] = {
        ...data[key],
        data: data[key].data.filter((item) => item.type === selectedType),
      };
      return acc;
    }, {});

    return {
      data: filteredData,
      totals: selectedType === "Total" ? totals : null,
    };
  };

  return (
    <div className="mt-8">
      <h1 className="text-xl font-bold mb-4">Overview</h1>

      {/* Existing Overview Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-12 font-medium border-r w-40">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Own">Own</SelectItem>
                    <SelectItem value="Sub">Sub</SelectItem>
                    <SelectItem value="Total">Total</SelectItem>
                  </SelectContent>
                </Select>
              </TableHead>
              <TableHead className="h-12 font-medium border-r">Sales</TableHead>
              <TableHead className="h-12 font-medium border-r">
                Services
              </TableHead>
              <TableHead className="h-12 font-medium border-r-2">
                Expenses
              </TableHead>
              <TableHead className="h-12 font-medium border-r-2">
                Payments
              </TableHead>
              <TableHead className="h-12 font-medium">Inventory</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(selectedType === "All" ? ["Own", "Sub"] : [selectedType]).map(
              (type, idx) => (
                <TableRow key={idx} className="hover:bg-muted/50">
                  <TableCell className="font-medium border-r">{type}</TableCell>
                  {/* Sales cell stays the same */}
                  <TableCell className="border-r">
                    {getFilteredOverviewData()
                      .data.sales.data.filter((s) => s.type === type)
                      .map((s, i) => (
                        <div key={i} className="space-y-1 divide-y">
                          <div className="pb-1">Count: {s.count}</div>
                          <div className="pt-1">Value: {s.value}</div>
                        </div>
                      ))}
                  </TableCell>
                  {/* Services cell */}
                  <TableCell className="border-r">
                    {getFilteredOverviewData()
                      .data.services.data.filter((s) => s.type === type)
                      .map((s, i) => (
                        <div key={i} className="space-y-1">
                          <div className="divide-y">
                            <div className="pb-1">Count: {s.count}</div>
                            <div className="pt-1">Value: {s.value}</div>
                          </div>
                          {s.types && (
                            <div className="mt-2 space-y-1 text-xs border-l-2 border-primary/20 pl-2">
                              {s.types.map((t, j) => (
                                <div key={j} className="space-y-0.5 divide-y">
                                  <div className="font-medium pb-1">
                                    {t.name}
                                  </div>
                                  <div className="pt-1 pb-1">
                                    Count: {t.count}
                                  </div>
                                  <div className="pt-1">Value: {t.value}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </TableCell>
                  {/* Expenses cell */}
                  <TableCell className="border-r-2">
                    {getFilteredOverviewData()
                      .data.expenses.data.filter((e) => e.type === type)
                      .map((e, i) => (
                        <div key={i} className="space-y-1">
                          Value: {e.value}
                        </div>
                      ))}
                  </TableCell>
                  {/* Payments cell */}
                  <TableCell className="border-r-2">
                    {getFilteredOverviewData()
                      .data.payments.data.filter((p) => p.type === type)
                      .map((p, i) => (
                        <div key={i} className="space-y-1 divide-y">
                          {p.modes.map((m, j) => (
                            <div key={j} className="pt-1 first:pt-0">
                              {m.mode}: {m.value}
                            </div>
                          ))}
                        </div>
                      ))}
                  </TableCell>
                  {/* Inventory cell */}
                  <TableCell>
                    {getFilteredOverviewData()
                      .data.inventory.data.filter((inv) => inv.type === type)
                      .map((inv, i) => (
                        <div key={i} className="space-y-1 divide-y">
                          <div className="pb-1">Count: {inv.count}</div>
                          <div className="pt-1">Value: {inv.value}</div>
                        </div>
                      ))}
                  </TableCell>
                </TableRow>
              )
            )}
            {/* Totals Row */}
            {(selectedType === "All" || selectedType === "Total") && (
              <TableRow className="bg-muted/10 font-medium">
                <TableCell className="border-r">Total</TableCell>
                {/* Sales totals stays the same */}
                <TableCell className="border-r">
                  <div className="divide-y">
                    <div className="pb-1">
                      Count: {getFilteredOverviewData().totals.sales.count}
                    </div>
                    <div className="pt-1">
                      Value: ₹{getFilteredOverviewData().totals.sales.value}
                    </div>
                  </div>
                </TableCell>
                {/* Services totals */}
                <TableCell className="border-r">
                  <div className="divide-y">
                    <div className="pb-1">
                      Count: {getFilteredOverviewData().totals.services.count}
                    </div>
                    <div className="pt-1">
                      Value: ₹{getFilteredOverviewData().totals.services.value}
                    </div>
                  </div>
                </TableCell>
                {/* Expenses totals */}
                <TableCell className="border-r-2">
                  <div>
                    Value: ₹{getFilteredOverviewData().totals.expenses.value}
                  </div>
                </TableCell>
                {/* Payments totals */}
                <TableCell className="border-r-2">
                  <div>
                    Value: ₹{getFilteredOverviewData().totals.payments.value}
                  </div>
                </TableCell>
                {/* Inventory totals */}
                <TableCell>
                  <div className="divide-y">
                    <div className="pb-1">
                      Count: {getFilteredOverviewData().totals.inventory.count}
                    </div>
                    <div className="pt-1">
                      Value: ₹{getFilteredOverviewData().totals.inventory.value}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
