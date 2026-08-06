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
      className="mg-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mg-toolbar">
        <div>
          <h2>{t("residentDashboard.consumptionTrend.title")}</h2>
          <p>{t("residentDashboard.consumptionTrend.subtitle")}</p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className={
              range === "daily" ? "mg-primary-button" : "mg-secondary-button"
            }
            onClick={() => setRange("daily")}
          >
            {t("residentDashboard.consumptionTrend.daily")}
          </button>
          <button
            type="button"
            className={
              range === "monthly"
                ? "mg-primary-button"
                : "mg-secondary-button"
            }
            onClick={() => setRange("monthly")}
          >
            {t("residentDashboard.consumptionTrend.monthly")}
          </button>
        </div>
      </div>

      {loading && <div className="mg-empty-state">{t("residentDashboard.consumptionTrend.loading")}</div>}

      {!loading && data.length === 0 && (
        <div className="mg-empty-state">{t("residentDashboard.consumptionTrend.noData")}</div>
      )}

      {!loading && data.length > 0 && (
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6edf3" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#8792a2" }}
                interval={range === "daily" ? 3 : 0}
              />
              <YAxis tick={{ fontSize: 10, fill: "#8792a2" }} />
              <Tooltip
                formatter={(value) => [`${value} KL`, t("residentDashboard.consumptionTrend.consumption")]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Line
                type="monotone"
                dataKey="kl"
                stroke="#0781a5"
                strokeWidth={2.5}
                dot={{ r: 3, stroke: "#075b78", strokeWidth: 1.5, fill: "#fff" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}

export default ConsumptionTrendChart;
