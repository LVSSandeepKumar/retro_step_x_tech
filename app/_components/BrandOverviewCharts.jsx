import React, { useState } from "react";
import { Line } from 'react-chartjs-2';
import { enrichedParent } from "@/lib/relations";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const BrandOverviewCharts = () => {
    const brands = enrichedParent[0]?.brands || [];
    const [selectedBrand, setSelectedBrand] = useState(brands[0]?.brandName || "");
    const [timeFrame, setTimeFrame] = useState("monthly");
    const [metricType, setMetricType] = useState("sales");

    const getChartData = () => {
        const brand = brands.find(b => b.brandName === selectedBrand);
        if (!brand) return null;

        const ownData = brand[metricType]?.find(s => s.type === "Own");
        const subData = brand[metricType]?.find(s => s.type === "Sub");

        const getTimeData = (data) => {
            if (!data) return [];
            return timeFrame === "monthly" 
                ? data.monthly.map(m => m.value)
                : data.quarterly.map(q => q.value);
        };

        const labels = timeFrame === "monthly"
            ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            : ["Q1", "Q2", "Q3", "Q4"];

        return {
            labels,
            datasets: [
                {
                    label: `Own ${metricType}`,
                    data: getTimeData(ownData),
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1,
                },
                ...(subData ? [{
                    label: `Sub ${metricType}`,
                    data: getTimeData(subData),
                    borderColor: "rgb(255, 99, 132)",
                    tension: 0.1,
                }] : [])
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: `${selectedBrand} ${metricType.charAt(0).toUpperCase() + metricType.slice(1)} Performance`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: `${metricType.charAt(0).toUpperCase() + metricType.slice(1)} Value (₹)`,
                },
            },
        },
    };

    return (
        <div className="mb-8 space-y-4 mt-4">
            <h1 className="text-2xl font-bold text-gray-950">Overall Brand Performance (Value)</h1>
            <div className="flex gap-4 items-center">
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent>
                        {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.brandName}>
                                {brand.brandName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={timeFrame} onValueChange={setTimeFrame}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={metricType} onValueChange={setMetricType}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select Metric" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="expenses">Expenses</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="h-[400px] w-full">
                {getChartData() && (
                    <Line data={getChartData()} options={chartOptions} />
                )}
            </div>
        </div>
    );
};

export default BrandOverviewCharts;
