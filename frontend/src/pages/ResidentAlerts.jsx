import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    AlertTriangle,
    Bell,
    Check,
    CheckCircle2,
    Clock3,
    Droplets,
    RefreshCw,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import StatCard from "../components/StatCard";
import residentDashboardService from "../services/residentDashboardService";

function formatDateTime(isoString) {

    if (!isoString) {
        return "-";
    }

    return new Date(isoString).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function ResidentAlerts() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadNotifications() {

        setLoading(true);

        try {

            const data = await residentDashboardService.getNotifications();
            setNotifications(Array.isArray(data) ? data : []);

        } catch {

            toast.error("Unable to load your alerts.");

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadNotifications();
    }, []);

    const unreadCount = notifications.filter((item) => !item.read).length;

    const leakCount = notifications.filter(
        (item) => item.alertType === "ANOMALY_LEAK"
    ).length;

    async function handleMarkRead(alertId) {

        setNotifications((previous) =>
            previous.map((item) =>
                item.id === alertId ? { ...item, read: true } : item
            )
        );

        try {
            await residentDashboardService.markNotificationRead(alertId);
        } catch {

            toast.error("Couldn't update that alert.");
            loadNotifications();
        }
    }

    async function handleMarkAllRead() {

        if (unreadCount === 0) {
            return;
        }

        setNotifications((previous) =>
            previous.map((item) => ({ ...item, read: true }))
        );

        try {

            await residentDashboardService.markAllNotificationsRead();
            toast.success("All alerts marked as read.");

        } catch {

            toast.error("Couldn't mark all as read.");
            loadNotifications();
        }
    }

    return (

        <AdminPageShell
            title="My Alerts"
            description="Usage alerts for your household — threshold breaches and possible leaks."
            action={
                <div className="flex flex-wrap gap-3">
                    {unreadCount > 0 && (
                        <button
                            className="mg-cancel-button"
                            onClick={handleMarkAllRead}
                        >
                            <Check size={18} />
                            Mark all as read
                        </button>
                    )}

                    <button
                        className="mg-primary-button"
                        onClick={loadNotifications}
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>
            }
        >

            <section className="mg-summary-grid">

                <StatCard
                    icon={Bell}
                    title="Total"
                    value={notifications.length}
                    description="All-time alerts"
                    animatedValue
                />

                <StatCard
                    icon={Clock3}
                    title="Unread"
                    value={unreadCount}
                    description="Need your attention"
                    animatedValue
                />

                <StatCard
                    icon={AlertTriangle}
                    title="Possible Leaks"
                    value={leakCount}
                    description="Anomaly detections"
                    animatedValue
                />

            </section>

            <section className="mg-panel">

                {loading && (
                    <p className="px-6 py-10 text-center text-sm text-slate-400">
                        Loading your alerts...
                    </p>
                )}

                {!loading && notifications.length === 0 && (
                    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                        <CheckCircle2 size={36} className="text-teal-600" />
                        <p className="text-sm font-medium text-slate-600">
                            No alerts yet — your usage looks normal.
                        </p>
                    </div>
                )}

                {!loading && notifications.length > 0 && (
                    <div className="divide-y divide-slate-100">

                        {notifications.map((item) => {

                            const isLeak = item.alertType === "ANOMALY_LEAK";

                            return (

                                <div
                                    key={item.id}
                                    className={`
                                        flex
                                        flex-col
                                        gap-3
                                        px-5
                                        py-4
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                        ${item.read ? "" : "bg-teal-50/40"}
                                    `}
                                >
                                    <div className="flex items-start gap-3">

                                        <div
                                            className={`
                                                mt-0.5
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                ${
                                                    isLeak
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-amber-100 text-amber-600"
                                                }
                                            `}
                                        >
                                            {isLeak ? (
                                                <AlertTriangle size={18} />
                                            ) : (
                                                <Droplets size={18} />
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-slate-800">
                                                {item.message ||
                                                    (isLeak
                                                        ? "Possible leak detected."
                                                        : "Usage threshold exceeded.")}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {formatDateTime(item.createdAt)}
                                                {item.litersConsumed != null &&
                                                    ` · ${item.litersConsumed}L consumed`}
                                                {item.thresholdValue != null &&
                                                    ` (threshold ${item.thresholdValue}L)`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 sm:pl-4">

                                        <span
                                            className={`
                                                rounded-full
                                                px-3
                                                py-1
                                                text-xs
                                                font-semibold
                                                ${
                                                    item.read
                                                        ? "bg-slate-100 text-slate-500"
                                                        : "bg-teal-100 text-teal-700"
                                                }
                                            `}
                                        >
                                            {item.read ? "Read" : "Unread"}
                                        </span>

                                        {!item.read && (
                                            <button
                                                type="button"
                                                className="mg-cancel-button"
                                                onClick={() =>
                                                    handleMarkRead(item.id)
                                                }
                                            >
                                                Mark read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

        </AdminPageShell>
    );
}
