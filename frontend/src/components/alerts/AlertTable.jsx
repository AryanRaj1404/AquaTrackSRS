import { Bell, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

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

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm"
                >

                    <option value="ALL">
                        {t("alertTable.filters.all")}
                    </option>

                    <option value="CRITICAL">
                        {t("alertTable.filters.critical")}
                    </option>

                    <option value="PENDING">
                        {t("alertTable.filters.pending")}
                    </option>

                    <option value="ACKNOWLEDGED">
                        {t("alertTable.filters.acknowledged")}
                    </option>

                </select>

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