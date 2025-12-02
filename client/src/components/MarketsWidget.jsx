import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MarketsWidget({ market }) {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("5d"); // "5d" | "1m" | "1y" | "all"

  const getEndpoint = (tf, symbol) => {
    switch (tf) {
      case "5d":
      case "1m":
        return `http://localhost:3001/api/stock/daily/${symbol}`;
      case "1y":
        return `http://localhost:3001/api/stock/weekly/${symbol}`;
      case "all":
        return `http://localhost:3001/api/stock/monthly/${symbol}`;
      default:
        return `http://localhost:3001/api/stock/daily/${symbol}`;
    }
  };

  useEffect(() => {
    async function fetchStock() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(getEndpoint(timeframe, market.symbol));
        if (!res.ok) throw new Error("Failed to fetch stock data");

        const data = await res.json();
        setStockData(data);
      } catch (err) {
        setError(err.message);
        setStockData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchStock();
  }, [market.symbol, timeframe]);

  // Prepare chart data
  let chartData = { labels: [], datasets: [] };
  if (stockData) {
    let series = {};
    if (timeframe === "5d" || timeframe === "1m") series = stockData["Time Series (Daily)"];
    else if (timeframe === "1y") series = stockData["Weekly Time Series"];
    else if (timeframe === "all") series = stockData["Monthly Time Series"];

    if (series) {
      let dates = Object.keys(series).sort(); // chronological
      if (timeframe === "5d") dates = dates.slice(-5);
      else if (timeframe === "1m") dates = dates.slice(-20);
      else if (timeframe === "1y") dates = dates.slice(-52);
      else if (timeframe === "all") dates = dates.slice(-60);

      const volumes = dates.map((d) => Number(series[d]["5. volume"]));

      chartData = {
        labels: dates,
        datasets: [
          {
            label: "Volume",
            data: volumes,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: true,
            tension: 0.3,
            pointRadius: 5,
          },
        ],
      };
    }
  }

  return (
    <div className="flex flex-col items-center border-2 p-4 rounded-lg bg-blue-100 w-144">
      <h2 className="text-xl font-bold mb-2">{market.name}</h2>

      {/* Timeframe selector */}
      <div className="flex gap-2 mb-4">
        {[
          { label: "5 Days", value: "5d" },
          { label: "1 Month", value: "1m" },
          { label: "1 Year", value: "1y" },
          { label: "All", value: "all" },
        ].map((option) => (
          <label key={option.value} className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name={`timeframe-${market.symbol}`} // unique per widget!
              value={option.value}
              checked={timeframe === option.value}
              onChange={() => setTimeframe(option.value)}
              className="form-radio"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {chartData.labels.length > 0 && (
        <div className="w-full mt-4 bg-white p-2 rounded-lg shadow h-64">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: true } },
              scales: {
                y: {
                  ticks: {
                    callback: (value) => value.toLocaleString(),
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
