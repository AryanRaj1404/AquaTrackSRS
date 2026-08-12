import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  Droplets,
  CheckCircle2,
  Clock,
  Bell,
} from "lucide-react";

import residentDashboardService from "../../services/residentDashboardService";

export default function AnomalyAlerts() {
  const { t } = useTranslation();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await residentDashboardService.getAlerts();

        if (!ignore) {
          setAlerts(data);
        }
      } catch {
        if (!ignore)
          toast.error("Unable to load alerts.");
      } finally {
        if (!ignore)
          setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const getAlertConfig = (type) => {
    switch (type) {
      case "ANOMALY_LEAK":
        return {
          icon: AlertTriangle,
          bg: "bg-red-100",
          color: "text-red-600",
          badge: "Critical",
          badgeColor:
            "bg-red-100 text-red-700 border border-red-200",
        };

      default:
        return {
          icon: Droplets,
          bg: "bg-amber-100",
          color: "text-amber-600",
          badge: "High Usage",
          badgeColor:
            "bg-amber-100 text-amber-700 border border-amber-200",
        };
    }
  };

  const timeAgo = (date) => {
    const diff =
      Math.floor(
        (new Date() - new Date(date)) / 60000
      );

    if (diff < 60) return `${diff} min ago`;

    if (diff < 1440)
      return `${Math.floor(diff / 60)} hrs ago`;

    return `${Math.floor(diff / 1440)} days ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-100 p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Alert Center
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Household usage notifications
          </p>
        </div>

        <div className="rounded-xl bg-cyan-50 p-3">
          <Bell className="h-5 w-5 text-cyan-600" />
        </div>
      </div>

      {/* Loading */}

      {loading && (
        <div className="space-y-4 p-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      )}

      {/* Empty */}

      {!loading && alerts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <CheckCircle2 className="mb-4 h-14 w-14 text-green-500" />

          <h3 className="text-lg font-semibold text-slate-700">
            No Active Alerts
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Great! Your household usage looks normal.
          </p>
        </div>
      )}

      {/* Alerts */}

      {!loading && alerts.length > 0 && (
        <div className="space-y-4 p-6">
          {alerts.map((alert) => {
            const config = getAlertConfig(alert.alertType);

            const Icon = config.icon;

            return (
              <motion.div
                key={alert.id}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-slate-200 p-5 transition hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-xl p-3 ${config.bg}`}
                  >
                    <Icon
                      className={`h-6 w-6 ${config.color}`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {config.badge}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {alert.message}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${config.badgeColor}`}
                      >
                        {alert.acknowledged
                          ? "Acknowledged"
                          : "Active"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4" />

                        {alert.litersConsumed} L
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />

                        {timeAgo(alert.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}