import { Bell, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import{ useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

import EmptyState from "../EmptyState";
import ResponsiveTable from "../ResponsiveTable";

export default function AlertTable({
    loading,
    alerts,
    status,
    setStatus,
    onView,
}) {

    const { t } = useTranslation();

    const [statusOpen, setStatusOpen] = useState(false);
const statusRef = useRef(null);

const statusOptions = [
    {
        value: "ALL",
        label: t("alertTable.filters.all"),
    },
    {
        value: "CRITICAL",
        label: t("alertTable.filters.critical"),
    },
    {
        value: "PENDING",
        label: t("alertTable.filters.pending"),
    },
    {
        value: "ACKNOWLEDGED",
        label: t("alertTable.filters.acknowledged"),
    },
];

useEffect(() => {
    const handleClickOutside = (event) => {
        if (
            statusRef.current &&
            !statusRef.current.contains(event.target)
        ) {
            setStatusOpen(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener(
            "mousedown",
            handleClickOutside
        );
    };
}, []);

const selectedStatus = statusOptions.find(
    (option) => option.value === status
);

    if (loading) {

        return (

            <div className="mg-empty-state">

                <Loader2
                    size={36}
                    className="animate-spin"
                />

                <h3>
                    {t("alertTable.loadingTitle")}
                </h3>

                <p>
                    {t("alertTable.loadingDescription")}
                </p>

            </div>

        );

    }

    return (

        <>

            <div className="mg-toolbar">

                <div>

                    <h2>
                        {t("alertTable.title")}
                    </h2>

                    <p>
                        {t("alertTable.subtitle")}
                    </p>

                </div>

                <div
    ref={statusRef}
    className="relative w-[190px]"
>
    <button
        type="button"
        onClick={() => setStatusOpen((prev) => !prev)}
        className="
            flex
            w-full
            items-center
            justify-between
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-semibold
            text-slate-700
            shadow-sm
            transition-all
            hover:border-teal-300
            hover:shadow-md
            focus:outline-none
            focus:ring-4
            focus:ring-teal-100
        "
    >
        <span className="flex items-center gap-2.5">
            <span
                className={`
                    h-2.5
                    w-2.5
                    rounded-full
                    ${
                        status === "CRITICAL"
                            ? "bg-red-500"
                            : status === "PENDING"
                            ? "bg-amber-500"
                            : status === "ACKNOWLEDGED"
                            ? "bg-emerald-500"
                            : "bg-teal-500"
                    }
                `}
            />

            {selectedStatus?.label}
        </span>

        <ChevronDown
            size={16}
            className={`
                text-slate-400
                transition-transform
                ${statusOpen ? "rotate-180" : ""}
            `}
        />
    </button>

    {statusOpen && (
        <div
            className="
                absolute
                left-0
                right-0
                top-full
                z-50
                mt-2
                rounded-xl
                border
                border-slate-200
                bg-white
                p-1.5
                shadow-xl
            "
        >
            {statusOptions.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                        setStatus(option.value);
                        setStatusOpen(false);
                    }}
                    className={`
                        flex
                        w-full
                        items-center
                        gap-2.5
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        font-medium
                        transition-colors

                        ${
                            status === option.value
                                ? "bg-teal-50 text-teal-700"
                                : "text-slate-700 hover:bg-slate-50"
                        }
                    `}
                >
                    <span
                        className={`
                            h-2.5
                            w-2.5
                            rounded-full
                            ${
                                option.value === "CRITICAL"
                                    ? "bg-red-500"
                                    : option.value === "PENDING"
                                    ? "bg-amber-500"
                                    : option.value === "ACKNOWLEDGED"
                                    ? "bg-emerald-500"
                                    : "bg-teal-500"
                            }
                        `}
                    />

                    {option.label}
                </button>
            ))}
        </div>
    )}
</div>

            </div>

            {alerts.length > 0 ? (

                <div className="mg-table-wrapper">

                    <ResponsiveTable>

                        <table className="mg-table">

                            <thead>

                                <tr>

                                    <th>
                                        {t("alertTable.columns.alert")}
                                    </th>

                                    <th>
                                        {t("alertTable.columns.apartment")}
                                    </th>

                                    <th>
                                        {t("alertTable.columns.household")}
                                    </th>

                                    <th>
                                        {t("alertTable.columns.status")}
                                    </th>

                                    <th>
                                        {t("alertTable.columns.triggeredOn")}
                                    </th>

                                    <th>
                                        {t("alertTable.columns.action")}
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {alerts.map((alert) => (

                                    <tr
                                        key={alert.id}
                                        className="transition-colors hover:bg-slate-50"
                                    >

                                        <td>

                                            <span className="mg-table-primary">

                                                {alert.alertType === "ANOMALY_LEAK"
                                                    ? t("alertTable.possibleLeak")
                                                    : t("alertTable.highConsumption")}

                                            </span>

                                        </td>

                                        <td>
                                            {alert.apartmentName}
                                        </td>

                                        <td>
                                            {alert.householdName}
                                        </td>

                                        <td>

                                            {alert.acknowledged ? (

                                                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">

                                                    {t("alertTable.acknowledged")}

                                                </span>

                                            ) : (

                                                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

                                                    {t("alertTable.pending")}

                                                </span>

                                            )}

                                        </td>

                                        <td>

                                            {alert.triggeredOn}

                                        </td>

                                        <td>

                                            <button
                                                type="button"
                                                className="mg-secondary-button"
                                                onClick={() => onView(alert)}
                                            >

                                                {t("alertTable.view")}

                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </ResponsiveTable>

                </div>

            ) : (

                <EmptyState
                    icon={Bell}
                    title={t("alertTable.emptyTitle")}
                    description={t("alertTable.emptyDescription")}
                />

            )}

        </>

    );

}