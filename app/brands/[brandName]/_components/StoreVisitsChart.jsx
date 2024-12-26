"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const StoreVisitsChart = ({ locations }) => {
  const labels = locations.map((location) => location.locationName);
  const dataValues = locations.map((location) => location.storeVisits);

  const data = {
    labels,
    datasets: [
      {
        label: "Store Visits by Location",
        data: dataValues,
        backgroundColor: [
          "rgba(156, 163, 175, 1)",
          "rgba(75, 85, 99, 1)",
          "rgba(192, 192, 192, 0.2)",
          "rgba(211, 211, 211, 0.2)",
          "rgba(220, 220, 220, 0.2)",
        ],
        borderColor: [
          "rgba(0, 0, 0, 1)",
          "rgba(0, 0, 0, 1)",
          "rgba(0, 0, 0, 1)",
          "rgba(0, 0, 0, 1)",
          "rgba(0, 0, 0, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: true, // Allows custom height and width
    aspectRatio: 1.2,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 10, // Adjust legend font size
          },
        },
      },
    },
    cutout: "70%", // Adjusts the thickness of the doughnut
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <h3 className="text-lg font-bold">Store Visits by Location</h3>
      </CardHeader>
      <CardContent>
        <Doughnut data={data} options={options} />
      </CardContent>
    </Card>
  );
};

export default StoreVisitsChart;
