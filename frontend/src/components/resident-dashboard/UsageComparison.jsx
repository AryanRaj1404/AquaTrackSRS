import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import residentDashboardService from "../../services/residentDashboardService";

/**
 * Compares the household's consumption for the current billing
 * cycle against the apartment/building average.
 *
 * Calls onLoaded(isHighUsage) once data is ready, so the parent
 * page can pass that flag into WaterTipsFeed.
 */
function UsageComparison({ onLoaded }) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await residentDashboardService.getComparison();
        if (!ignore) {
          setComparison(data);
          onLoaded?.(
            data.householdConsumptionKl > data.buildingAverageKl
          );
        }
      } catch {
        if (!ignore) toast.error("Could not load usage comparison");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = comparison
    ? [
        { name: "You", kl: comparison.householdConsumptionKl },
        { name: "Building Avg", kl: comparison.buildingAverageKl },
      ]
    : [];

  const isHigh =
    comparison && comparison.householdConsumptionKl > comparison.buildingAverageKl;

  return (
    <motion.div
      className="mg-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mg-toolbar">
        <div>
          <h2>You vs. Building Average</h2>
          <p>{comparison?.cycleLabel || "Current billing cycle"}</p>
        </div>
      </div>

      {loading && <div className="mg-empty-state">Loading comparison...</div>}

      {!loading && comparison && comparison.householdsCompared === 0 && (
        <div className="mg-empty-state">
          Not enough data yet to compare against the building.
        </div>
      )}

      {!loading && comparison && comparison.householdsCompared > 0 && (
        <>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6edf3" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8792a2" }} />
                <YAxis tick={{ fontSize: 10, fill: "#8792a2" }} />
                <Tooltip
                  formatter={(value) => [`${value} KL`, "Consumption"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="kl" radius={[6, 6, 0, 0]}>
                  <Cell fill={isHigh ? "#dc2626" : "#0781a5"} />
                  <Cell fill="#8792a2" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: 11,
              color: isHigh ? "#dc2626" : "#15803d",
              fontWeight: 600,
            }}
          >
            {isHigh
              ? "You're using more water than the building average this cycle."
              : "You're at or below the building average this cycle. Nice work!"}
          </p>
        </>
      )}
    </motion.div>
  );
}

export default UsageComparison;
