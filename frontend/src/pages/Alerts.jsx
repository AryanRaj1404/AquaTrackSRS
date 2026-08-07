import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {useWorkspace} from "../context/WorkspaceContext";

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

    const { t } = useTranslation();

    const { workspaceId } = useWorkspace();

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
            t("alerts.toasts.acknowledging")
        );

        try {

            await acknowledgeAlert(alert.id);

            toast.success(
                t("alerts.toasts.acknowledged"),
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
                t("alerts.toasts.acknowledgeFailed"),
                {
                    id: loadingToast,
                }
            );

        }

    }

    useEffect(() => {

        loadAlerts();

    }, [page, status, workspaceId]);

    return (

        <AdminPageShell

    title={t("alerts.pageTitle")}

    description={t("alerts.pageSubtitle")}

    action={

        <button
            className="mg-primary-button"
            onClick={loadAlerts}
        >

            <RefreshCw size={18} />

            {t("alerts.refreshAlerts")}

        </button>

    }

>

    <section className="mg-summary-grid">

        <StatCard
            icon={TriangleAlert}
            title={t("alerts.summary.critical")}
            value={summary.critical}
            description={t("alerts.summary.criticalDescription")}
            animatedValue
        />

        <StatCard
            icon={Clock3}
            title={t("alerts.summary.pending")}
            value={summary.pending}
            description={t("alerts.summary.pendingDescription")}
            animatedValue
        />

        <StatCard
            icon={CheckCircle2}
            title={t("alerts.summary.acknowledged")}
            value={summary.acknowledged}
            description={t("alerts.summary.acknowledgedDescription")}
            animatedValue
        />

        <StatCard
            icon={Bell}
            title={t("alerts.summary.total")}
            value={summary.total}
            description={t("alerts.summary.totalDescription")}
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

                label={t("alerts.paginationLabel")}

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