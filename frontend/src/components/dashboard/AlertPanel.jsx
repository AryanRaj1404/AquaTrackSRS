import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import GlassPanel from "../ui/GlassPanel";
import { useWorkspace } from "../../context/WorkspaceContext";

import {
  AlertTriangle,
  CircleCheck,
  Clock3,
  Droplets,
  Mail,
  ArrowRight,
} from "lucide-react";

import {
  getRecentAlerts,
  acknowledgeAlert,
} from "../../services/alertService";

import toast from "react-hot-toast";

export default function AlertPanel() {

  const { t } = useTranslation();

  const navigate = useNavigate();

  const { workspaceId } = useWorkspace();

  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {

    try {

      setLoading(true);

      const data = await getRecentAlerts();

      setAlerts(data);

    } catch {

      toast.error(
        t("alertPanel.toasts.loadError")
      );

    } finally {

      setLoading(false);

    }

  }, [workspaceId, t]);

  useEffect(() => {

    fetchAlerts();

  }, [fetchAlerts]);

  const getRelativeTime = (date) => {

    const minutes = Math.floor(
      (Date.now() - new Date(date)) / 60000
    );

    if (minutes < 1)
      return t("alertPanel.justNow");

    if (minutes < 60)
      return t("alertPanel.minAgo", {
        count: minutes,
      });

    const hours = Math.floor(minutes / 60);

    if (hours < 24)
      return hours > 1
        ? t("alertPanel.hoursAgo", {
            count: hours,
          })
        : t("alertPanel.hourAgo", {
            count: hours,
          });

    const days = Math.floor(hours / 24);

    return days > 1
      ? t("alertPanel.daysAgo", {
          count: days,
        })
      : t("alertPanel.dayAgo", {
          count: days,
        });

  };

  const getAlertMeta = (alert) => {

    switch (alert.alertType) {

      case "ANOMALY_LEAK":

        return {

          title: t("alertPanel.possibleLeak"),

          severity: "High",

          severityLabel:
            t("alertPanel.severity.high"),

          icon: AlertTriangle,

          iconBg:
            "bg-red-50 text-red-500",

          badge:
            "bg-red-100 text-red-700",

        };

      case "THRESHOLD_BREACH":

        return {

          title:
            t("alertPanel.highConsumption"),

          severity: "Medium",

          severityLabel:
            t("alertPanel.severity.medium"),

          icon: Droplets,

          iconBg:
            "bg-amber-50 text-amber-500",

          badge:
            "bg-amber-100 text-amber-700",

        };

      default:

        return {

          title:
            t("alertPanel.notification"),

          severity: "Info",

          severityLabel:
            t("alertPanel.severity.info"),

          icon: Mail,

          iconBg:
            "bg-sky-50 text-sky-500",

          badge:
            "bg-sky-100 text-sky-700",

        };

    }

  };

  const handleAcknowledge = async (id) => {

    try {

      await acknowledgeAlert(id);

      toast.success(
        t("alertPanel.toasts.acknowledgedSuccess")
      );

      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id
            ? {
                ...alert,
                acknowledged: true,
              }
            : alert
        )
      );

    } catch {

      toast.error(
        t("alertPanel.toasts.acknowledgeFailed")
      );

    }

  };

  return (

    <GlassPanel>

      {/* Header */}

      {/* Header */}

<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

  <div className="space-y-1">

    <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-red-500">

      {t("alertPanel.systemAlerts")}

    </p>

    <h2 className="text-2xl font-bold text-slate-900">

      {t("alertPanel.recentAlerts")}

    </h2>

  </div>

  <button
    onClick={() => navigate("/alerts")}
    className="
      group
      inline-flex
      items-center
      gap-1
      rounded-lg
      px-3
      py-2
      text-sm
      font-semibold
      text-teal-700
      transition-all
      hover:bg-teal-50
    "
  >

    {t("alertPanel.viewAll")}

    <ArrowRight
      size={15}
      className="transition-transform group-hover:translate-x-1"
    />

  </button>

</div>

{loading && (

  <div className="py-16 text-center text-slate-500">

    {t("alertPanel.loadingAlerts")}

  </div>

)}

{!loading && alerts.length === 0 && (

  <div className="py-16 text-center text-slate-500">

    {t("alertPanel.noAlerts")}

  </div>

)}

<div className="mt-2 max-h-[420px] overflow-y-auto sm:pr-2">

{!loading &&
alerts.slice(0,5).map((alert)=>{

const meta=getAlertMeta(alert);
const Icon=meta.icon;

return(

<div
key={alert.id}
className="
mx-1
border-b
border-slate-100
px-2
py-4
last:border-none
transition
hover:bg-slate-50
rounded-xl
"
>

<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

{/* LEFT */}

<div className="flex flex-1 gap-3 min-w-0">

<div
className={`
flex
h-10
w-10
shrink-0
items-center
justify-center
rounded-xl
${meta.iconBg}
`}
>

<Icon className="h-4 w-4"/>

</div>

<div className="min-w-0 flex-1">

{/* Top Row */}

<div className="flex flex-wrap items-center gap-2">

<h3 className="font-semibold text-[15px] text-slate-900">

{meta.title}

</h3>

<span
className={`
rounded-full
px-2
py-0.5
text-[10px]
font-semibold
${meta.badge}
`}
>

{meta.severityLabel}

</span>

{!alert.acknowledged && (

<span className="flex items-center gap-1 text-[10px] font-medium text-orange-600">

<Clock3 className="h-3 w-3"/>

{t("alertPanel.acknowledgePending")}

</span>

)}

</div>

{/* Apartment */}

<p className="mt-1 break-words text-xs text-slate-500">

{alert.apartmentName}

{" • "}

{t("alertPanel.flatLabel",{
name:alert.householdName,
})}

</p>

{/* Message */}

<p
className="
mt-2
line-clamp-2
break-words
text-[13px]
leading-5
text-slate-600
sm:pr-4
"
>

{alert.message}

</p>

{/* Time */}

<p className="mt-2 text-[11px] text-slate-400">

{getRelativeTime(alert.createdAt)}

</p>

</div>

</div>

{/* RIGHT */}

<div className="flex w-full justify-end md:w-auto md:shrink-0 md:items-center md:pl-3">

{alert.acknowledged ? (

<div
className="
w-full
sm:w-auto
rounded-lg
bg-gradient-to-r
from-teal-700
to-teal-600
px-4
py-2
text-xs
font-semibold
text-white
transition-all
hover:shadow-md
hover:brightness-110
active:scale-95
"
>

<CircleCheck className="h-4 w-4"/>

{t("alertPanel.acknowledged")}

</div>

):(

<button
onClick={()=>handleAcknowledge(alert.id)}
className="
rounded-lg
bg-gradient-to-r
from-teal-700
to-teal-600
px-4
py-2
text-xs
font-semibold
text-white
transition-all
hover:shadow-md
hover:brightness-110
active:scale-95
"
>

{t("alertPanel.acknowledgeButton")}

</button>

)}

</div>

</div>

</div>

);

})}

</div>

</GlassPanel>

);

}
