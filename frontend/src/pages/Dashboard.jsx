import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dashboardService from "../services/dashboardService";
import SkeletonCard from "../components/SkeletonCard";
import WaterTips from "../components/WaterTips";
import Charts from "../components/dashboard/ConsumptionSection";
import AlertPanel from "../components/dashboard/AlertPanel";
import DashboardHero from "../components/dashboard/DashboardHero";
import AdminPageShell from "../components/AdminPageShell";
import StatCard from "../components/StatCard";

import {
  BadgeCheck,
  Building2,
  Clock3,
  Droplets,
  Receipt,
  TriangleAlert,
  Users,
  Wallet,
} from "lucide-react";

function Dashboard() {
  const { t } = useTranslation();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {

    const fetchDashboard = async () => {
        try {
          const dashboardData =
              await dashboardService.getDashboard();
          setDashboard(dashboardData);
        } catch (error) {
            console.error(error);
        }
    };
    fetchDashboard();
  }, []);

  if (!dashboard) {
    return (
        <AdminPageShell
            title={t("dashboard.overview")}
            description={t("dashboard.loadingDashboard")}
        >
            <section className="mg-summary-grid">
                {Array.from({ length: 12 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </section>
        </AdminPageShell>
    );
}

  return (
    <AdminPageShell
      title=""
      description=""
      action={
        null
      }
    >
      <DashboardHero dashboard={dashboard} />
      {/* ================= BUSINESS OVERVIEW ================= */}

<section className="mt-12">

    <div className="mb-7">

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            {t("dashboard.businessOverview")}
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-900">
            {t("dashboard.revenuePerformance")}
        </h2>

    </div>

    <div className="grid gap-6 xl:grid-cols-12">

        {/* Revenue Hero */}

        <div className="xl:col-span-6 rounded-[34px] border border-white/50 bg-white/80 backdrop-blur-xl p-8 shadow-xl">

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
                {t("dashboard.totalRevenue")}
            </p>

            <h1 className="mt-5 text-5xl font-black text-slate-900">
                ₹ {Number(dashboard?.totalRevenue ?? 0).toLocaleString("en-IN")}
            </h1>

            <div className="mt-10 grid grid-cols-3 gap-6">

                <div>
                    <p className="text-sm text-slate-500">{t("dashboard.generated")}</p>
                    <h3 className="mt-2 text-3xl font-bold">
                        {dashboard?.generatedInvoices ?? 0}
                    </h3>
                </div>

                <div>
                    <p className="text-sm text-slate-500">{t("dashboard.paid")}</p>
                    <h3 className="mt-2 text-3xl font-bold">
                        {dashboard?.paidInvoices ?? 0}
                    </h3>
                </div>

                <div>
                    <p className="text-sm text-slate-500">{t("dashboard.pending")}</p>
                    <h3 className="mt-2 text-3xl font-bold">
                        {dashboard?.pendingInvoices ?? 0}
                    </h3>
                </div>

            </div>

        </div>

        <div className="xl:col-span-3">
            <StatCard
                icon={Wallet}
                title={t("dashboard.collection")}
                value={`${Number(dashboard?.collectionRate ?? 0).toFixed(1)}%`}
                description={t("dashboard.paymentCollection")}
            />
        </div>

        <div className="xl:col-span-3">
            <StatCard
                icon={Droplets}
                title={t("dashboard.waterLoss")}
                value={`${Number(dashboard?.waterLossPercentage ?? 0).toFixed(1)}%`}
                description={t("dashboard.availableForFuture")}
            />
        </div>

    </div>

</section>

{/* ================= PLATFORM ================= */}

<section className="mt-12">

    <div className="mb-7">

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            {t("dashboard.platform")}
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-900">
            {t("dashboard.apartmentsAndUsers")}
        </h2>

    </div>

    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
            icon={Building2}
            title={t("dashboard.apartments")}
            value={dashboard?.totalApartments ?? 0}
            animatedValue
            description={t("dashboard.registeredApartments")}
        />

        <StatCard
            icon={Users}
            title={t("dashboard.households")}
            value={dashboard?.totalHouseholds ?? 0}
            animatedValue
            description={t("dashboard.registeredHouseholds")}
        />

        <StatCard
            icon={Users}
            title={t("dashboard.users")}
            value={dashboard?.totalUsers ?? 0}
            animatedValue
            description={t("dashboard.registeredUsers")}
        />

        <StatCard
            icon={Droplets}
            title={t("dashboard.bulkWater")}
            value={`${Number(dashboard?.totalBulkWaterPurchasedKl ?? 0).toFixed(2)} KL`}
            description={t("dashboard.purchasedWater")}
        />

    </div>

</section>

{/* ================= WATER ================= */}

<section className="mt-12">

    <div className="mb-7">

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            {t("dashboard.waterManagement")}
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-900">
            {t("dashboard.consumption")}
        </h2>

    </div>

    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">

        <StatCard
            icon={Droplets}
            title={t("dashboard.waterConsumed")}
            value={`${Number(dashboard?.totalWaterConsumedKl ?? 0).toFixed(2)} KL`}
            description={t("dashboard.householdConsumption")}
        />

        <StatCard
            icon={Droplets}
            title={t("dashboard.remainingWater")}
            value={`${Number(dashboard?.waterLossKl ?? 0).toFixed(2)} KL`}
            description={`${Number(dashboard?.waterLossPercentage ?? 0).toFixed(2)}${t("dashboard.lossSuffix")}`}
        />

    </div>

</section>

{/* ================= BILLING ================= */}

<section className="mt-12">

    <div className="mb-7">

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            {t("dashboard.billing")}
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-900">
            {t("dashboard.invoiceStatus")}
        </h2>

    </div>

    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
            icon={Receipt}
            title={t("dashboard.generated")}
            value={dashboard?.generatedInvoices ?? 0}
            description={t("dashboard.generatedInvoices")}
        />

        <StatCard
            icon={BadgeCheck}
            title={t("dashboard.paid")}
            value={dashboard?.paidInvoices ?? 0}
            description={t("dashboard.paidInvoices")}
        />

        <StatCard
            icon={Clock3}
            title={t("dashboard.pending")}
            value={dashboard?.pendingInvoices ?? 0}
            description={t("dashboard.pendingInvoices")}
        />

        <StatCard
            icon={TriangleAlert}
            title={t("dashboard.overdue")}
            value={dashboard?.overdueInvoices ?? 0}
            description={t("dashboard.overdueInvoices")}
        />

    </div>

</section>

{/* ================= INSIGHTS ================= */}

<section className="mt-10">

    <Charts />

</section>

<section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">

  <AlertPanel />

    <WaterTips />

</section>
    </AdminPageShell>
  );
}

export default Dashboard;
