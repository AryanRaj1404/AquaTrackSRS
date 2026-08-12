import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import residentDashboardService from "../../services/residentDashboardService";

/**
 * Line chart of the resident's own consumption, with a
 * Daily (last 30 days) / Monthly (last 12 months) toggle.
 */
function ConsumptionTrendChart() {
  const { t } = useTranslation();
  const [range, setRange] = useState("daily");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      try {
        const raw =
          range === "daily"
            ? await residentDashboardService.getDailyTrend()
            : await residentDashboardService.getMonthlyTrend();

        if (!ignore) {
          setData(
            raw.map((point) => ({
              label: point.label,
              kl: point.consumptionKl,
            }))
          );
        }
      } catch {
        if (!ignore) toast.error(t("residentDashboard.consumptionTrend.couldNotLoad"));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [range]);

  return (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-3xl bg-white p-6 shadow-sm"
  >
    {/* Header */}
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
          Analytics
        </p>

        <h2 className="mt-1 text-3xl font-bold">
          Consumption Trend
        </h2>

        <p className="mt-1 text-slate-500">
          Monitor your household water consumption over time.
        </p>
      </div>

      <div className="flex rounded-xl bg-slate-100 p-1">
        <button
          onClick={() => setRange("daily")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            range === "daily"
              ? "bg-cyan-600 text-white"
              : "text-slate-600"
          }`}
        >
          Daily
        </button>

        <button
          onClick={() => setRange("monthly")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            range === "monthly"
              ? "bg-cyan-600 text-white"
              : "text-slate-600"
          }`}
        >
          Monthly
        </button>
      </div>
    </div>

    {loading ? (
      <div className="flex h-80 items-center justify-center text-slate-500">
        Loading...
      </div>
    ) : data.length === 0 ? (
      <div className="flex h-80 items-center justify-center text-slate-500">
        No consumption data available.
      </div>
    ) : (
      <div className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#E2E8F0"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              interval={range === "daily" ? 3 : 0}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 14,
                border: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,.15)",
              }}
            />

            <Line
              type="monotone"
              dataKey="kl"
              stroke="#0891b2"
              strokeWidth={4}
              dot={{
                r: 4,
                fill: "#fff",
                stroke: "#0891b2",
                strokeWidth: 3,
              }}
              activeDot={{
                r: 7,
                fill: "#0891b2",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </motion.div>
);
}

export default ConsumptionTrendChart;
