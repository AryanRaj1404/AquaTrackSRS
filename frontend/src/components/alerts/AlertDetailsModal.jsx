import {
    X,
    TriangleAlert,
    Droplets,
    CalendarDays,
    Building2,
    Home,
    Hash,
    Activity,
    CheckCircle2,
    Clock3,
} from "lucide-react";

export default function AlertDetailsModal({
    open,
    alert,
    onClose,
    onAcknowledge,
}) {
    if (!open || !alert) return null;

    const statusBadge = alert.acknowledged
        ? "bg-emerald-100 text-emerald-700"
        : "bg-red-100 text-red-700";

    const typeBadge =
        alert.alertType === "ANOMALY_LEAK"
            ? "bg-amber-100 text-amber-700"
            : "bg-sky-100 text-sky-700";

    return (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-6"
        onClick={onClose}
    >
        <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
        >
            {/* Header */}

            <div className="flex items-start justify-between border-b border-slate-200 p-7">

                <div className="flex gap-5">

                    <div
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${typeBadge}`}
                    >
                        <TriangleAlert size={34} />
                    </div>

                    <div>

                        <h2 className="text-2xl font-bold text-slate-900">
                            {alert.alertType === "ANOMALY_LEAK"
                                ? "Possible Water Leak"
                                : "High Consumption"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Alert ID #{alert.id}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3">

                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadge}`}
                            >
                                {alert.acknowledged
                                    ? "✓ Acknowledged"
                                    : "● Pending"}
                            </span>

                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${typeBadge}`}
                            >
                                {alert.alertType === "ANOMALY_LEAK"
                                    ? "Leak Alert"
                                    : "High Consumption"}
                            </span>

                        </div>

                    </div>

                </div>

                <button
                    onClick={onClose}
                    className="rounded-xl p-2 transition hover:bg-slate-100"
                >
                    <X size={20} />
                </button>

            </div>

            {/* Info Cards */}

            <div className="grid grid-cols-2 gap-5 p-7">

                <InfoCard
                    icon={Building2}
                    title="Apartment"
                    value={alert.apartmentName}
                />

                <InfoCard
                    icon={Home}
                    title="Household"
                    value={alert.householdName}
                />

                <InfoCard
                    icon={Droplets}
                    title="Water Consumption"
                    value={`${alert.litersConsumed.toLocaleString()} L`}
                    highlight
                />

                <InfoCard
                    icon={CalendarDays}
                    title="Triggered On"
                    value={alert.triggeredOn}
                />

                <InfoCard
                    icon={Clock3}
                    title="Created At"
                    value={new Date(alert.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                    )}
                    subValue={new Date(alert.createdAt).toLocaleTimeString(
                        "en-IN",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        }
                    )}
                />

                <InfoCard
                    icon={Hash}
                    title="Alert ID"
                    value={`#${alert.id}`}
                />

            </div>

            {/* Description */}

            <div className="px-7 pb-7">

                <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-5 shadow-sm">

                    <div className="mb-4 flex items-center gap-2">

                        <Activity
                            size={18}
                            className="text-teal-600"
                        />

                        <h3 className="font-semibold text-slate-900">
                            Alert Description
                        </h3>

                    </div>

                    <p className="leading-7 text-slate-600">
                        {alert.message}
                    </p>

                </div>

            </div>

            {/* Footer */}

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-6">

                <button
                    onClick={onClose}
                    className="mg-cancel-button inline-flex items-center gap-2"
                >
                    <X size={16} />
                    Close
                </button>

                {alert.acknowledged ? (

                    <button
                        disabled
                        className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white opacity-75"
                    >
                        <CheckCircle2 size={18} />
                        Already Acknowledged
                    </button>

                ) : (

                    <button
                        className="mg-primary-button"
                        onClick={() => onAcknowledge(alert)}
                    >
                        <CheckCircle2 size={18} />
                        Acknowledge Alert
                    </button>

                )}

            </div>

        </div>

    </div>
);
function InfoCard({
    icon: Icon,
    title,
    value,
    subValue,
    highlight = false,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

            <div className="mb-3 flex items-center gap-2 text-teal-700">

                <Icon size={18} />

                <span className="text-sm font-semibold">
                    {title}
                </span>

            </div>

            <p
                className={
                    highlight
                        ? "text-3xl font-bold text-teal-700"
                        : "text-xl font-semibold text-slate-900"
                }
            >
                {value}
            </p>

            {subValue && (
                <p className="mt-2 text-sm text-slate-500">
                    {subValue}
                </p>
            )}

        </div>
    );
}
}
        