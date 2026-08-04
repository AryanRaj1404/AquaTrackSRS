import { Bell, Loader2 } from "lucide-react";
import EmptyState from "../EmptyState";
import ResponsiveTable from "../ResponsiveTable";

export default function AlertTable({
    loading,
    alerts,
    status,
    setStatus,
    onView,
}) {

    if (loading) {
        return (
            <div className="mg-empty-state">
                <Loader2
                    size={36}
                    className="animate-spin"
                />

                <h3>Loading alerts</h3>

                <p>
                    Please wait while alerts are being fetched.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="mg-toolbar">

                <div>

                    <h2>Alert Records</h2>

                    <p>
                        Monitor all generated alerts across apartments.
                    </p>

                </div>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm bg-white"
                >
                    <option value="ALL">All Alerts</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACKNOWLEDGED">Acknowledged</option>
                </select>

            </div>

            {alerts.length > 0 ? (

                <div className="mg-table-wrapper">

                    <ResponsiveTable>

                    <table className="mg-table">

                        <thead>

                            <tr>

                                <th>Alert</th>

                                <th>Apartment</th>

                                <th>Household</th>

                                <th>Status</th>

                                <th>Triggered On</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {alerts.map((alert) => (

                                <tr
                                    key={alert.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >

                                    <td>

                                        <span className="mg-table-primary">

                                            {alert.alertType === "ANOMALY_LEAK"
                                                ? "Possible Water Leak"
                                                : "High Consumption"}

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
                                                Acknowledged
                                            </span>

                                        ) : (

                                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                Pending
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
                                            View
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
                    title="No alerts found"
                    description="Everything looks healthy."
                />

            )}

        </>
    );
}