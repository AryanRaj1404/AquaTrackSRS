import { useEffect, useState } from "react";
import dashboardService from "../services/dashboardService";
import SkeletonCard from "../components/SkeletonCard";
import WaterTips from "../components/WaterTips";
import Charts from "../components/dashboard/ConsumptionSection";
import AlertPanel from "../components/dashboard/AlertPanel";
import DashboardHero from "../components/dashboard/DashboardHero";

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

import AdminPageShell from "../components/AdminPageShell";
import StatCard from "../components/StatCard";

function Dashboard() {

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
            title="Dashboard Overview"
            description="Loading dashboard..."
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
            Business Overview
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-900">
            Revenue & Performance
        </h2>

    </div>

    <div className="grid gap-6 xl:grid-cols-12">

        {/* Revenue Hero */}

        <div className="xl:col-span-6 rounded-[34px] border border-white/50 bg-white/80 backdrop-blur-xl p-8 shadow-xl">

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
                TOTAL REVENUE
            </p>

            <h1 className="mt-5 text-5xl font-black text-slate-900">
                ₹ {Number(dashboard?.totalRevenue ?? 0).toLocaleString("en-IN")}
            </h1>

            <div className="mt-10 grid grid-cols-3 gap-6">

                <div>
                    <p className="text-sm text-slate-500">Generated</p>
                    <h3 className="mt-2 text-3xl font-bold">
                        {dashboard?.generatedInvoices ?? 0}
                    </h3>
                </div>

                <div>
                    <p className="text-sm text-slate-500">Paid</p>
                    <h3 className="mt-2 text-3xl font-bold">
                        {dashboard?.paidInvoices ?? 0}
                    </h3>
                </div>

                <div>
                    <p className="text-sm text-slate-500">Pending</p>
                    <h3 className="mt-2 text-3xl font-bold">
                        {dashboard?.pendingInvoices ?? 0}
                    </h3>
                </div>

            </div>

        </div>

        <div className="xl:col-span-3">
            <StatCard
                icon={Wallet}
                title="Collection"
                value={`${Number(dashboard?.collectionRate ?? 0).toFixed(1)}%`}
                description="Payment collection"
            />
        </div>

        <div className="xl:col-span-3">
            <StatCard
                icon={Droplets}
                title="Water Loss"
                value={`${Number(dashboard?.waterLossPercentage ?? 0).toFixed(1)}%`}
                description="Available for future consumption"
            />
        </div>

    </div>

</section>

{/* ================= PLATFORM ================= */}

<section className="mt-12">

    <div className="mb-7">

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            Platform
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-900">
            Apartments & Users
        </h2>

    </div>

    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
            icon={Building2}
            title="Apartments"
            value={dashboard?.totalApartments ?? 0}
            animatedValue
            description="Registered apartments"
        />

        <StatCard
            icon={Users}
            title="Households"
            value={dashboard?.totalHouseholds ?? 0}
            animatedValue
            description="Registered households"
        />

        <StatCard
            icon={Users}
            title="Users"
            value={dashboard?.totalUsers ?? 0}
            animatedValue
            description="Registered users"
        />

        <StatCard
            icon={Droplets}
            title="Bulk Water"
            value={`${Number(dashboard?.totalBulkWaterPurchasedKl ?? 0).toFixed(2)} KL`}
            description="Purchased water"
        />

    </div>

</section>

{/* ================= WATER ================= */}

<section className="mt-12">

    <div className="mb-7">

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            Water Management
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-900">
            Consumption
        </h2>

    </div>

    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">

        <StatCard
            icon={Droplets}
            title="Water Consumed"
            value={`${Number(dashboard?.totalWaterConsumedKl ?? 0).toFixed(2)} KL`}
            description="Household consumption"
        />

        <StatCard
            icon={Droplets}
            title="Remaining Water"
            value={`${Number(dashboard?.waterLossKl ?? 0).toFixed(2)} KL`}
            description={`${Number(dashboard?.waterLossPercentage ?? 0).toFixed(2)}% loss`}
        />

    </div>

</section>

{/* ================= BILLING ================= */}

<section className="mt-12">

    <div className="mb-7">

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            Billing
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-900">
            Invoice Status
        </h2>

    </div>

    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
            icon={Receipt}
            title="Generated"
            value={dashboard?.generatedInvoices ?? 0}
            description="Generated invoices"
        />

        <StatCard
            icon={BadgeCheck}
            title="Paid"
            value={dashboard?.paidInvoices ?? 0}
            description="Paid invoices"
        />

        <StatCard
            icon={Clock3}
            title="Pending"
            value={dashboard?.pendingInvoices ?? 0}
            description="Pending invoices"
        />

        <StatCard
            icon={TriangleAlert}
            title="Overdue"
            value={dashboard?.overdueInvoices ?? 0}
            description="Overdue invoices"
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