import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import AdminPageShell from "../components/AdminPageShell";
import residentDashboardService from "../services/residentDashboardService";

import QuickStatsRow from "../components/resident-dashboard/QuickStatsRow";
import BillingCycleSummary from "../components/resident-dashboard/BillingCycleSummary";
import ConsumptionTrendChart from "../components/resident-dashboard/ConsumptionTrendChart";
import UsageComparison from "../components/resident-dashboard/UsageComparison";
import InvoiceHistory from "../components/resident-dashboard/InvoiceHistory";
import AnomalyAlerts from "../components/resident-dashboard/AnomalyAlerts";
import WaterTipsFeed from "../components/resident-dashboard/WaterTipsFeed";
import ProfileShortcut from "../components/resident-dashboard/ProfileShortcut";
import UsageReportDownload from "../components/resident-dashboard/UsageReportDownload";
import "../styles/management.css";

function ResidentDashboard() {
  const { t } = useTranslation();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [highUsage, setHighUsage] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await residentDashboardService.getOverview();
        if (!ignore) setOverview(data);
      } catch {
        if (!ignore) toast.error(t("residentDashboard.couldNotLoadDashboard"));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AdminPageShell
      title={t("residentDashboard.myDashboard")}
      description={t("residentDashboard.trackSubtitle")}
    >
      {/* Quick stats */}
      <QuickStatsRow overview={overview} loading={loading} />

      {/* Billing cycle summary */}
      <div style={{ marginTop: 20 }}>
        <BillingCycleSummary overview={overview} loading={loading} />
      </div>

      {/* Consumption trend + usage comparison */}
      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 20,
        }}
        className="mg-responsive-grid"
      >
        <ConsumptionTrendChart />
        <UsageComparison onLoaded={setHighUsage} />
      </div>

      {/* Invoice history + alerts */}
      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 20,
        }}
        className="mg-responsive-grid"
      >
        <InvoiceHistory householdId={overview?.householdId} />
        <AnomalyAlerts householdId={overview?.householdId} />
      </div>

      {/* Tips, profile shortcut and usage report */}
      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 20,
        }}
        className="mg-responsive-grid-3"
      >
        <WaterTipsFeed highUsage={highUsage} />
        <ProfileShortcut overview={overview} loading={loading} />
        <UsageReportDownload householdId={overview?.householdId} />
      </div>
    </AdminPageShell>
  );
}

export default ResidentDashboard;