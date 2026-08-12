import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        if (!ignore) toast.error(t("residentDashboard.usageComparison.couldNotLoad"));
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
        { name: t("residentDashboard.usageComparison.you"), kl: comparison.householdConsumptionKl },
        { name: t("residentDashboard.usageComparison.buildingAvg"), kl: comparison.buildingAverageKl },
      ]
    : [];

  const isHigh =
    comparison && comparison.householdConsumptionKl > comparison.buildingAverageKl;

  return (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-3xl bg-white p-6 shadow-sm"
  >
    {/* Header */}

    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
          Analytics
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          {t("residentDashboard.usageComparison.title")}
        </h2>

        <p className="text-sm text-slate-500">
          {comparison?.cycleLabel ??
            t("residentDashboard.usageComparison.currentCycle")}
        </p>
      </div>
    </div>

    {loading && (
      <div className="flex h-64 items-center justify-center text-slate-500">
        Loading...
      </div>
    )}

    {!loading &&
      comparison &&
      comparison.householdsCompared > 0 && (
        <>
          {/* Summary */}

          <div className="mt-6 grid grid-cols-3 gap-4">

            <div className="rounded-2xl bg-cyan-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                You
              </p>

              <h3 className="mt-2 text-2xl font-bold text-cyan-700">
                {comparison.householdConsumptionKl} KL
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-100 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Building Avg
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {comparison.buildingAverageKl} KL
              </h3>
            </div>

            <div
              className={`rounded-2xl p-4 ${
                isHigh
                  ? "bg-red-50"
                  : "bg-emerald-50"
              }`}
            >
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Difference
              </p>

              <h3
                className={`mt-2 text-2xl font-bold ${
                  isHigh
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {Math.abs(
                  comparison.householdConsumptionKl -
                    comparison.buildingAverageKl
                ).toFixed(2)}{" "}
                KL
              </h3>
            </div>

          </div>

          {/* Chart */}

          <div className="mt-8 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="4 4"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [`${value} KL`]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "none",
                  }}
                />

                <Bar
                  dataKey="kl"
                  radius={[10, 10, 0, 0]}
                >
                  <Cell
                    fill={
                      isHigh
                        ? "#ef4444"
                        : "#06b6d4"
                    }
                  />

                  <Cell fill="#94a3b8" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Footer */}

          <div
            className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${
              isHigh
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {isHigh
              ? "⚠️ You're consuming more water than the building average this billing cycle."
              : "✅ Great job! Your household is consuming less water than the building average."}
          </div>
        </>
      )}
  </motion.div>
);
}

export default UsageComparison;
