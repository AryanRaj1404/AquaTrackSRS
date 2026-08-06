import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    RefreshCw,
    TriangleAlert,
    Clock3,
    CheckCircle2,
    Bell,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import StatCard from "../components/StatCard";
import Pagination from "../components/Pagination";
import AlertTable from "../components/alerts/AlertTable";
import AlertDetailsModal from "../components/alerts/AlertDetailsModal";

import {
    getAllAlerts,
    getAlertSummary,
    acknowledgeAlert,
} from "../services/alertService";

export default function Alerts() {

    const PAGE_SIZE = 10;

    const [alerts, setAlerts] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        last: true,
    });

    const [summary, setSummary] = useState({
        critical: 0,
        pending: 0,
        acknowledged: 0,
        total: 0,
    });

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);

    const [status, setStatus] = useState("ALL");

    const [selectedAlert, setSelectedAlert] = useState(null);

    const [showDetails, setShowDetails] = useState(false);

    async function loadAlerts() {

        setLoading(true);

        try {

            const [summaryData, pageData] = await Promise.all([
                getAlertSummary(),
                getAllAlerts(page, PAGE_SIZE, status),
            ]);

            setSummary({
                critical: summaryData.critical ?? 0,
                pending: summaryData.pending ?? 0,
                acknowledged: summaryData.acknowledged ?? 0,
                total: summaryData.total ?? 0,
            });

            setAlerts(pageData);

        }

        finally {

            setLoading(false);

        }

    }

    async function handleAcknowledge(alert) {

        const loadingToast = toast.loading(
            "Acknowledging alert..."
        );

        try {

            await acknowledgeAlert(alert.id);

            toast.success(
                "Alert acknowledged.",
                {
                    id: loadingToast,
                }
            );

            setShowDetails(false);

            setSelectedAlert(null);

            await loadAlerts();

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Unable to acknowledge alert.",
                {
                    id: loadingToast,
                }
            );

        }

    }

    useEffect(() => {

        loadAlerts();

    }, [page, status]);

    return (

        <AdminPageShell

            title="Alert Management"

            description="Monitor, investigate and acknowledge alerts generated across all apartments."

            action={

                <button
                    className="mg-primary-button"
                    onClick={loadAlerts}
                >

                    <RefreshCw size={18} />

                    Refresh Alerts

                </button>

            }

        >

            <section className="mg-summary-grid">

                <StatCard
                    icon={TriangleAlert}
                    title="Critical"
                    value={summary.critical}
                    description="Leak alerts"
                    animatedValue
                />

                <StatCard
                    icon={Clock3}
                    title="Pending"
                    value={summary.pending}
                    description="Need review"
                    animatedValue
                />

                <StatCard
                    icon={CheckCircle2}
                    title="Acknowledged"
                    value={summary.acknowledged}
                    description="Reviewed"
                    animatedValue
                />

                <StatCard
                    icon={Bell}
                    title="Total"
                    value={summary.total}
                    description="Generated alerts"
                    animatedValue
                />

            </section>

            <section className="mg-panel">

                <AlertTable
                    loading={loading}
                    alerts={alerts.content}
                    status={status}
                    setStatus={(value) => {
                        setPage(0);
                        setStatus(value);
                    }}
                    onView={(alert) => {
                        setSelectedAlert(alert);
                        setShowDetails(true);
                    }}
                />

                {!loading && alerts.content.length > 0 && (

                    <Pagination

                        page={page}

                        pageData={alerts}

                        pageSize={PAGE_SIZE}

                        currentCount={alerts.content.length}

                        label="alerts"

                        onPrevious={() => setPage(page - 1)}

                        onNext={() => setPage(page + 1)}

                        onPageChange={setPage}

                    />

                )}

            </section>
            <AlertDetailsModal
                open={showDetails}
                alert={selectedAlert}
                onClose={() => {
                    setShowDetails(false);
                    setSelectedAlert(null);
                }}
                onAcknowledge={handleAcknowledge}
            />

        </AdminPageShell>

    );

}