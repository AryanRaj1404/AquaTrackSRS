import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertTriangle, Bell, Droplets } from "lucide-react";

import residentDashboardService from "../services/residentDashboardService";
import { getRecentAlerts, getAlertSummary } from "../services/alertService";

const POLL_INTERVAL_MS = 30000;

function formatRelativeTime(isoString) {

    if (!isoString) {
        return "";
    }

    const then = new Date(isoString).getTime();
    const now = Date.now();
    const diffSeconds = Math.max(0, Math.floor((now - then) / 1000));

    if (diffSeconds < 60) {
        return "Just now";
    }

    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
        return `${diffHours}h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);

    if (diffDays < 7) {
        return `${diffDays}d ago`;
    }

    return new Date(isoString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
}

function NotificationBell() {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const isAdmin = role === "ADMIN";
    const alertsPath = isAdmin ? "/alerts" : "/my-alerts";

    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef(null);
    const seenIdsRef = useRef(null);

    const goToAlerts = () => {
        setOpen(false);
        navigate(alertsPath);
    };

    const showToastForAlert = (item) => {

        const isLeak = item.alertType === "ANOMALY_LEAK";

        toast.custom(
            (toastInstance) => (
                <button
                    type="button"
                    onClick={() => {
                        toast.dismiss(toastInstance.id);
                        goToAlerts();
                    }}
                    className={`
                        flex
                        w-[320px]
                        max-w-[90vw]
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        text-left
                        shadow-xl
                        transition
                        hover:border-teal-400
                        ${toastInstance.visible ? "animate-enter" : "animate-leave"}
                    `}
                >
                    <div
                        className={`
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

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                            New alert
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                            {item.message ||
                                (isLeak
                                    ? "Possible leak detected."
                                    : "Usage threshold exceeded.")}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-teal-700">
                            Tap to view alerts →
                        </p>
                    </div>
                </button>
            ),
            { duration: 6000 }
        );
    };

    const fetchAdminData = async () => {

        const [recent, summary] = await Promise.all([
            getRecentAlerts(),
            getAlertSummary(),
        ]);

        return {
            items: Array.isArray(recent) ? recent : [],
            unread: summary?.pending || 0,
        };
    };

    const fetchResidentData = async () => {

        const [all, unreadData] = await Promise.all([
            residentDashboardService.getNotifications(),
            residentDashboardService.getUnreadNotificationCount(),
        ]);

        const items = Array.isArray(all) ? all : [];

        return {
            items: items.filter((item) => !item.read).slice(0, 5),
            allItems: items,
            unread: unreadData?.count || 0,
        };
    };

    const poll = async (isFirstRun) => {

        try {

            const { items, unread } = isAdmin
                ? await fetchAdminData()
                : await fetchResidentData();

            setUnreadCount(unread);

            if (isFirstRun) {

                seenIdsRef.current = new Set(items.map((item) => item.id));

            } else if (seenIdsRef.current) {

                const newOnes = items.filter(
                    (item) => !seenIdsRef.current.has(item.id)
                );

                newOnes.forEach((item) => {
                    seenIdsRef.current.add(item.id);
                    showToastForAlert(item);
                });
            }

        } catch {
            // Silently ignore — badge/toasts just won't update this cycle.
        }
    };

    useEffect(() => {

        poll(true);

        const interval = setInterval(() => poll(false), POLL_INTERVAL_MS);

        return () => clearInterval(interval);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    const handleToggle = async () => {

        const next = !open;
        setOpen(next);

        if (!next) {
            return;
        }

        setLoading(true);

        try {

            const { items, allItems } = isAdmin
                ? await fetchAdminData()
                : await fetchResidentData();

            setNotifications(isAdmin ? items : (allItems || []).slice(0, 5));

        } catch {

            toast.error("Couldn't load notifications.");

        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="relative" ref={containerRef}>

            <button
                type="button"
                className="
                    relative
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    transition
                    hover:border-teal-500
                    hover:text-teal-700
                "
                onClick={handleToggle}
                aria-label={t("adminShell.notifications")}
            >
                <Bell size={20} />

                {unreadCount > 0 && (
                    <span
                        className="
                            absolute
                            right-1.5
                            top-1.5
                            flex
                            h-4
                            min-w-[16px]
                            items-center
                            justify-center
                            rounded-full
                            bg-red-500
                            px-1
                            text-[10px]
                            font-bold
                            text-white
                        "
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className="
                        absolute
                        right-0
                        z-50
                        mt-2
                        w-[340px]
                        max-w-[90vw]
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-xl
                    "
                >
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">

                        <p className="text-sm font-semibold text-slate-800">
                            {t("adminShell.notifications")}
                        </p>

                        {unreadCount > 0 && (
                            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700">
                                {unreadCount} unread
                            </span>
                        )}
                    </div>

                    <div className="max-h-[360px] overflow-y-auto">

                        {loading && (
                            <p className="px-4 py-6 text-center text-sm text-slate-400">
                                Loading...
                            </p>
                        )}

                        {!loading && notifications.length === 0 && (
                            <p className="px-4 py-6 text-center text-sm text-slate-400">
                                {t("adminShell.noNotifications")}
                            </p>
                        )}

                        {!loading &&
                            notifications.map((item) => {

                                const isLeak = item.alertType === "ANOMALY_LEAK";
                                const isRead = isAdmin
                                    ? item.acknowledged
                                    : item.read;

                                return (

                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={goToAlerts}
                                        className={`
                                            flex
                                            w-full
                                            items-start
                                            gap-3
                                            border-b
                                            border-slate-50
                                            px-4
                                            py-3
                                            text-left
                                            transition
                                            hover:bg-slate-50
                                            ${isRead ? "bg-white" : "bg-teal-50/50"}
                                        `}
                                    >
                                        <div
                                            className={`
                                                mt-0.5
                                                flex
                                                h-8
                                                w-8
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
                                                <AlertTriangle size={16} />
                                            ) : (
                                                <Droplets size={16} />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">

                                            {isAdmin && item.apartmentName && (
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-600">
                                                    {item.apartmentName}
                                                </p>
                                            )}

                                            <p className="text-sm leading-5 text-slate-800">
                                                {item.message ||
                                                    (isLeak
                                                        ? "Possible leak detected."
                                                        : "Usage threshold exceeded.")}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {formatRelativeTime(item.createdAt)}
                                            </p>
                                        </div>

                                        {!isRead && (
                                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-600" />
                                        )}
                                    </button>
                                );
                            })}
                    </div>

                    <div className="border-t border-slate-100 px-4 py-2.5">
                        <button
                            type="button"
                            className="w-full text-center text-xs font-medium text-teal-700 hover:text-teal-900"
                            onClick={goToAlerts}
                        >
                            View all alerts
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
