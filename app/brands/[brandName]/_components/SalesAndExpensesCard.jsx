import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { ArrowDown, ArrowUp } from "lucide-react";
import { brandsData } from "@/lib/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const SalesAndExpensesCard = () => {
  const brand = brandsData.find((brand) => brand.brandName === "Bajaj"); // Replace "Bajaj" with dynamic brand name if needed

  // Graph data for Sales
  const salesData = {
    labels: brand.salesDetails.quarterWise.map((q) => q.quarter),
    datasets: [
      {
        label: "Sales",
        data: brand.salesDetails.quarterWise.map((q) =>
          parseFloat(q.sales.replace(/[^0-9.-]+/g, ""))
        ),
        borderColor: "#34D399",
        backgroundColor: "rgba(52, 211, 153, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  // Graph data for Expenses
  const expensesData = {
    labels: brand.totalExpenses.quarterly.map((q) => q.quarter),
    datasets: [
      {
        label: "Expenses",
        data: brand.totalExpenses.quarterly.map((q) =>
          parseFloat(q.expenses.replace(/[^0-9.-]+/g, ""))
        ),
        borderColor: "#F87171",
        backgroundColor: "rgba(248, 113, 113, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  // Combined Graph data for Targets and Achieved
  const targetsAndAchievedData = {
    labels: brand.targetsAndAchieved.quarterWise.map((q) => q.quarter),
    datasets: [
      {
        label: "Targets",
        data: brand.targetsAndAchieved.quarterWise.map((q) =>
          parseFloat(q.target.replace(/[^0-9.-]+/g, ""))
        ),
        borderColor: "#60A5FA",
        backgroundColor: "rgba(96, 165, 250, 0.1)",
        tension: 0.4,
        fill: false,
        borderWidth: 2,
        pointRadius: 3, // Show small points
        pointBackgroundColor: "#60A5FA", // Blue points for Targets
      },
      {
        label: "Achieved",
        data: brand.targetsAndAchieved.quarterWise.map((q) =>
          parseFloat(q.achieved.replace(/[^0-9.-]+/g, ""))
        ),
        borderColor: "#FBBF24",
        backgroundColor: "rgba(251, 191, 36, 0.1)",
        tension: 0.4,
        fill: false,
        borderWidth: 2,
        pointRadius: 3, // Show small points
        pointBackgroundColor: "#FBBF24", // Yellow points for Achieved
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Show legend for "Targets" and "Achieved"
        position: "top",
        labels: {
          color: "#4B5563", // Tailwind gray-600
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        borderWidth: 0,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9CA3AF" },
      },
      y: {
        grid: { drawBorder: false, color: "rgba(229, 231, 235, 0.5)" },
        ticks: { color: "#9CA3AF" },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/*Sales Card */}
      <Card className="border p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold">{brand.salesDetails.totalSales}</span>
            <div className="flex items-center text-green-500">
              <span className="material-icons-outlined">
                <ArrowUp />
              </span>
              <span>{brand.salesDetails.growthRate}</span>
            </div>
          </div>
          <div className="h-40">
            <Line data={salesData} options={options} />
          </div>
        </CardContent>
      </Card>

      {/* Expenses Card */}
      <Card className="border p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold">{brand.operationalExpenses.annual}</span>
            <div className="flex items-center text-red-500">
              <span className="material-icons-outlined">
                <ArrowDown />
              </span>
              <span>8.3%</span>
            </div>
          </div>
          <div className="h-40">
            <Line data={expensesData} options={options} />
          </div>
        </CardContent>
      </Card>

      {/* Targets & Achieved Card */}
      <Card className="border p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Targets & Achieved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold">
              {brand.targetsAndAchieved.achieved} / {brand.targetsAndAchieved.annualTarget}
            </span>
            <div className="flex items-center text-red-500">
              <span className="material-icons-outlined">
                <ArrowDown />
              </span>
              <span>96%</span>
            </div>
          </div>
          <div className="h-40">
            <Line data={targetsAndAchievedData} options={options} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesAndExpensesCard;
