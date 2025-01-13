"use client";
"use client";
import { useEffect, useRef } from "react";
import {
  Chart,
  LinearScale,
  CategoryScale,
  BarElement, // Use BarElement for bar charts
  Title,
  Tooltip,
  Legend,
  BarController, // Use BarController for bar chart
} from "chart.js";
import { getRelativePosition } from "chart.js/helpers";

// Register necessary components for "bar" chart
Chart.register(
  LinearScale, // For scaling on y and x axes
  CategoryScale, // For category-based x axis (like labels)
  BarElement, // For bars in the chart
  Title, // For chart title
  Tooltip, // For tooltips
  Legend, // For the legend
  BarController // This is crucial for using "bar" chart type
);

export default function BarChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Chart.js data and options
    const data = {
      labels: ["02", "02", "03", "04"],
      datasets: [
        {
            label: "",
          data: [65, 59, 80, 81,],
          backgroundColor: [
            "rgba(0, 181, 98, 0.2)",
            "rgba(0, 181, 98, 0.4)",
            "rgba(0, 181, 98, 0.5)",
            "rgba(0, 181, 98, 0.8)",
          ], // Bar color
        //   borderColor: "rgb(75, 192, 192)",
          borderWidth: 1,
        },
      ],
    };

    const options = {
        //to remove the legend
      plugins: {
        legend: {
          display: false, // This disables the legend entirely
        },
      },


      onClick: (e: MouseEvent) => {
        const chart = chartInstance.current;
        if (!chart) return;

        const canvasPosition = getRelativePosition(e, chart);

        // Substitute the appropriate scale IDs
        const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
        const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);

        console.log(`X: ${dataX}, Y: ${dataY}`);
      },
    };

    // Get the canvas context
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Create the chart instance
    const chartInstance = new Chart(ctx, {
      type: "bar", // Change the type to "bar" to create a bar chart
      data: data,
      options: options,
    });

    // Cleanup chart instance on component unmount
    return () => {
      chartInstance.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} width="100px" height="100px"></canvas>;
}
