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
      className="mg-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mg-toolbar">
        <div>
          <h2>{t("residentDashboard.usageComparison.title")}</h2>
          <p>{comparison?.cycleLabel || t("residentDashboard.usageComparison.currentCycle")}</p>
        </div>
      </div>

      {loading && <div className="mg-empty-state">{t("residentDashboard.usageComparison.loading")}</div>}

      {!loading && comparison && comparison.householdsCompared === 0 && (
        <div className="mg-empty-state">
          {t("residentDashboard.usageComparison.notEnoughData")}
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
                  formatter={(value) => [`${value} KL`, t("residentDashboard.consumptionTrend.consumption")]}
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
              ? t("residentDashboard.usageComparison.aboveAverage")
              : t("residentDashboard.usageComparison.atOrBelowAverage")}
          </p>
        </>
      )}
    </motion.div>
  );
}

export default UsageComparison;
