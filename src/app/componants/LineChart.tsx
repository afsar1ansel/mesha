"use client";
import { useEffect, useRef, useState } from "react";
import {
  Chart,
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import { getRelativePosition } from "chart.js/helpers";

// Register components required for the "line" chart
Chart.register(
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

export default function LineChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

   const [graphData, setGraphData] = useState();
   const [stateReport, setStateReport] = useState("week");
   const [label, setLabel] = useState<string[]>([]);
  const [reportData, setReportData] = useState<number[]>([]);



  function processChartData(
    apiData: Array<{ Date: string; no_of_unique_app_user_id: number }>
  ) {
    // Create a map to store date and total users
    const dateMap = new Map<string, number>();

    // Process each entry in the API data
    apiData.forEach((entry) => {
      // Extract only the date part in "YYYY-MM-DD" format
      const dateObj = new Date(entry.Date);
      const dateString = dateObj.toISOString().slice(0, 10); // "YYYY-MM-DD"

      // Get the current count for this date or 0 if not exists
      const currentCount = dateMap.get(dateString) || 0;

      // Add the new users to the count
      dateMap.set(dateString, currentCount + entry.no_of_unique_app_user_id);
    });

    // Convert the map to arrays for labels and data
    const labels = Array.from(dateMap.keys());
    const data = Array.from(dateMap.values());

    return { labels, data };
  }



  function fetchData(){
    let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    return fetch(
      `${baseURL}/dashboard/${stateReport}/${token}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setGraphData(data);
        const { labels, data: chartData } = processChartData(data);
        setLabel(labels);
        setReportData(chartData);
        console.log("Processed data:", { labels, chartData });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return [];
      });
  }

  useEffect(() => {
    fetchData();
  } , [stateReport]);


  useEffect(() => {
    if (!canvasRef.current) return;

    // Chart.js data and options
    const data = {
      // labels: ["1 day", "1 week", " 1 month", "3 months"],
      labels: label,
      datasets: [
        {
          label: "Number of Users",
          // data: [0, 10, 8, 15],
          data: reportData,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1, // Curved line tension
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        title: {
          display: true,
          text: "",
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    };

    // Get the canvas context
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Create the chart instance
    const chartInstance = new Chart(ctx, {
      type: "line",
      data,
    
    });

    // Cleanup chart instance on component unmount
    return () => {
      chartInstance.destroy();
    };
  }, [label, reportData ]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <canvas ref={canvasRef} width="400" height="300"></canvas>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          gap: "0px",
          marginTop: "12px",
          // border: "1px solid #ccc",
        }}
      >
        <button
          style={{
            padding: "10px 1.56vw",
            fontSize: "12px",
            border: "solid 1px #16A34A",
            backgroundColor: stateReport === "week" ? "#00B5624D" : "#fff",
          }}
          onClick={() => {
            setStateReport("week");
            // getchData();
          }}
        >
          this week
        </button>
        <button
          style={{
            padding: "10px 1.56vw",
            fontSize: "12px",
            border: "solid 1px #16A34A",
            backgroundColor: stateReport === "lastmonth" ? "#00B5624D" : "#fff",
          }}
          onClick={() => {
            setStateReport("lastmonth");
            // getchData();
          }}
        >
          Last Month
        </button>
        <button
          style={{
            padding: "10px 1.56vw",
            fontSize: "12px",
            border: "solid 1px #16A34A",
            backgroundColor: stateReport === "last3months" ? "#00B5624D" : "#fff",
          }}
          onClick={() => {
            setStateReport("last3months");
            // getchData();
          }}
        >
          Last 3 Months
        </button>
      </div>
    </div>
  ); 
}
