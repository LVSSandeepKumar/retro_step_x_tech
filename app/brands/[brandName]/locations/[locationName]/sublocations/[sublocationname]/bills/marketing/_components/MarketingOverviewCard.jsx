"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const cardData = [
      {
        platform: "LinkedIn",
        value: `${generateRandomNumber(100, 200)}K`,
        growth: "36%",
        previous: `${generateRandomNumber(50, 100)}K`,
      },
      {
        platform: "Facebook",
        value: `${generateRandomNumber(200, 300)}K`,
        growth: "44%",
        previous: `${generateRandomNumber(100, 200)}K`,
      },
      {
        platform: "Instagram",
        value: `${generateRandomNumber(50, 100)}K`,
        growth: "15%",
        previous: `${generateRandomNumber(20, 50)}K`,
      },
      {
        platform: "Youtube",
        value: `${generateRandomNumber(100, 200)}K`,
        growth: "29%",
        previous: `${generateRandomNumber(50, 100)}K`,
      },
    ];

    setData(cardData);
  }, []); // Add an empty dependency array to run the effect only once

  const chartData = {
    labels: [
      "12 Feb",
      "13 Feb",
      "14 Feb",
      "15 Feb",
      "16 Feb",
      "17 Feb",
      "18 Feb",
    ],
    datasets: [
      {
        label: "Impressions",
        data: [200, 300, 400, 600, 800, 1200, 1500],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-8 bg-gray-100 rounded-md">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Social Media Overview Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Total Social Media Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={chartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </CardContent>
        </Card>
        {data.map((data, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">
                {data.platform} Page Impressions
              </CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold">{data.value} </span>
                Impressions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-green-500 font-semibold">
                ▲ {data.growth} from {data.previous}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
