import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dashboardService from "../services/dashboardService";
import toast from "react-hot-toast";

function Charts({ title = "Monthly Consumption" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const raw = await dashboardService.getMonthlyConsumption();
        if (!ignore) {
          setData(
            raw.map((d) => ({ label: d.month, value: d.consumptionKl }))
          );
        }
      } catch {
        if (!ignore) toast.error("Could not load consumption trend");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const width = 600;
  const height = 220;
  const padding = 30;

  const values = data.map((d) => d.value);
  const max = values.length ? Math.max(...values) : 1;
  const min = values.length ? Math.min(...values) : 0;
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <motion.div
      className="mg-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mg-toolbar">
        <div>
          <h2>{title}</h2>
          <p>Household water consumption over time (KL)</p>
        </div>
      </div>

      {loading && <div className="mg-empty-state">Loading trend...</div>}

      {!loading && data.length === 0 && (
        <div className="mg-empty-state">No usage data available</div>
      )}

      {!loading && data.length > 0 && (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke="#0781a5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((d, i) => {
            const [x, y] = points[i].split(",").map(Number);
            return (
              <circle key={i} cx={x} cy={y} r="4" fill="#075b78" stroke="white" strokeWidth="1.5" />
            );
          })}
          {data.map((d, i) => {
            const [x] = points[i].split(",").map(Number);
            return (
              <text key={i} x={x} y={height - 8} fontSize="9" fill="#8792a2" textAnchor="middle">
                {d.label}
              </text>
            );
          })}
        </svg>
      )}
    </motion.div>
  );
}

export default Charts;