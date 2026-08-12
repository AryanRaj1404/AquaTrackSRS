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

export default function ResidentDashboard() {
  const { t } = useTranslation();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [highUsage, setHighUsage] = useState(false);

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : hour < 21
      ? "Good Evening"
      : "Good Night";

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await residentDashboardService.getOverview();
        if (!ignore) setOverview(data);
      } catch {
        if (!ignore)
          toast.error(t("residentDashboard.couldNotLoadDashboard"));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [t]);

 return (
  <AdminPageShell
    title="Resident Dashboard"
    description="Track your household water usage, bills and activity."
  >
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-cyan-700 to-sky-600 p-5 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-100">
              Welcome Back
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              {greeting}
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-cyan-100 sm:text-base">
              Monitor your household water usage, billing progress and recent
              activity from one place.
            </p>
          </div>

          <button className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-cyan-700 transition hover:scale-105 sm:w-auto">
            Download Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStatsRow
        overview={overview}
        loading={loading}
      />

      {/* Billing Summary */}
      <BillingCycleSummary
        overview={overview}
        loading={loading}
      />

      {/* Consumption Trend */}
      <ConsumptionTrendChart />

      {/* Usage Comparison + Water Tips */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <UsageComparison
          onLoaded={setHighUsage}
        />

        <WaterTipsFeed
          highUsage={highUsage}
        />
      </div>

      {/* Invoice History */}
      <InvoiceHistory
        householdId={overview?.householdId}
      />

      {/* Alerts */}
      <div
        id="resident-alerts"
        className="rounded-3xl bg-white p-4 sm:p-6 shadow-sm"
      >
          <AnomalyAlerts householdId={overview?.householdId} />
      </div>
    </div>
  </AdminPageShell>
);
}