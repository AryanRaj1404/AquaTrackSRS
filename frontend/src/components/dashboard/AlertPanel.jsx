import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import GlassPanel from "../ui/GlassPanel";

import {
  AlertTriangle,
  CircleCheck,
  Clock3,
  Droplets,
  Mail,
} from "lucide-react";

import { getRecentAlerts, acknowledgeAlert } from "../../services/alertService";
import toast from "react-hot-toast";

export default function AlertPanel() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRecentAlerts();
      setAlerts(data);
    } catch {
      toast.error(t("alertPanel.toasts.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const getRelativeTime = (date) => {
    const minutes = Math.floor(
      (Date.now() - new Date(date)) / 60000
    );

    if (minutes < 1) return t("alertPanel.justNow");
    if (minutes < 60) return t("alertPanel.minAgo", { count: minutes });

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return hours > 1 ? t("alertPanel.hoursAgo", { count: hours }) : t("alertPanel.hourAgo", { count: hours });

    const days = Math.floor(hours / 24);

    return days > 1 ? t("alertPanel.daysAgo", { count: days }) : t("alertPanel.dayAgo", { count: days });
  };

  const getAlertMeta = (alert) => {
    switch (alert.alertType) {
      case "ANOMALY_LEAK":
        return {
          title: t("alertPanel.possibleLeak"),
          severity: "High",
          severityLabel: t("alertPanel.severity.high"),
          icon: AlertTriangle,
          color: "text-red-500 bg-red-100",
        };

      case "THRESHOLD_BREACH":
        return {
          title: t("alertPanel.highConsumption"),
          severity: "Medium",
          severityLabel: t("alertPanel.severity.medium"),
          icon: Droplets,
          color: "text-amber-500 bg-amber-100",
        };

      default:
        return {
          title: t("alertPanel.notification"),
          severity: "Info",
          severityLabel: t("alertPanel.severity.info"),
          icon: Mail,
          color: "text-blue-500 bg-blue-100",
        };
    }
  };

  const severityStyles = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Info: "bg-blue-100 text-blue-700",
  };

  const handleAcknowledge = async (alertId) => {
    try {
      await acknowledgeAlert(alertId);

      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId
            ? { ...alert, acknowledged: true }
            : alert
        )
      );

      toast.success(t("alertPanel.toasts.acknowledgedSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("alertPanel.toasts.acknowledgeFailed"));
    }
  };

  return (
    <GlassPanel className="p-8 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {t("alertPanel.systemAlerts")}
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            {t("alertPanel.recentAlerts")}
          </h2>
        </div>

        <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
          {alerts.filter(a => !a.acknowledged).length} {t("alertPanel.active")}
        </div>
      </div>

      {loading && (
        <div className="py-12 text-center text-slate-500">
          {t("alertPanel.loadingAlerts")}
        </div>
      )}

      {!loading && alerts.length === 0 && (
        <div className="py-12 text-center text-slate-500">
          {t("alertPanel.noAlerts")}
        </div>
      )}

      <div className="mt-5 max-h-[430px] space-y-2 overflow-y-auto pr-1">
        {!loading &&
          alerts.slice(0,5).map((alert) => {
            const meta = getAlertMeta(alert);
            const Icon = meta.icon;

            return (
              <div
                key={alert.id}
                className="rounded-xl border border-slate-100 bg-white/80 p-3 transition hover:border-sky-200 hover:shadow-md"
              >
                <div className="flex gap-3">

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${meta.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between">

                      <h3 className="truncate text-sm font-semibold text-slate-900">
                        {meta.title}
                      </h3>

                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {getRelativeTime(alert.createdAt)}
                      </span>

                    </div>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {alert.apartmentName} • {t("alertPanel.flatLabel", { name: alert.householdName })}
                    </p>

                    <p className="mt-1 truncate text-sm text-slate-600">
                      {alert.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between">

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          severityStyles[meta.severity]
                        }`}
                      >
                        {meta.severityLabel}
                      </span>

                      {alert.acknowledged ? (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CircleCheck className="h-3.5 w-3.5" />
                          {t("alertPanel.acknowledged")}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">

                          <span className="flex items-center gap-1 text-xs text-orange-600">
                              <Clock3 className="h-3.5 w-3.5"/>
                              {t("alertPanel.acknowledgePending")}
                          </span>

                          <button
                              onClick={() => handleAcknowledge(alert.id)}
                              className="rounded-md bg-sky-600 px-2 py-1 text-[10px] font-semibold text-white transition hover:bg-sky-700"
                          >
                              {t("alertPanel.acknowledgeButton")}
                          </button>

                        </div>
                      )}

                    </div>

                  </div>

                </div>
              </div>
            );
          })}
      </div>
    </GlassPanel>
  );
}
