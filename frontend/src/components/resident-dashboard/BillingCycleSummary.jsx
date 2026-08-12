import { motion } from "framer-motion";
import {
  CalendarDays,
  Droplets,
  IndianRupee,
  Gauge,
} from "lucide-react";
import { useTranslation } from "react-i18next";

function BillingCycleSummary({ overview, loading }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="animate-pulse rounded-3xl bg-white p-6 shadow-sm">
        <div className="h-6 w-48 rounded bg-slate-200" />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  const hasCycle = !!overview?.currentCycleId;

  const progress =
    overview?.daysRemaining != null
      ? Math.max(0, Math.min(100, 100 - (overview.daysRemaining / 30) * 100))
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white p-6 shadow-sm"
    >
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
            Billing
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            {t("residentDashboard.billingCycle.title")}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {overview?.tariffPlanName ??
              t("residentDashboard.billingCycle.inProgress")}
          </p>
        </div>

        {hasCycle && (
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            {overview.cycleStatus}
          </span>
        )}
      </div>

      {!hasCycle && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          {t("residentDashboard.billingCycle.noCycleOpen")}
        </div>
      )}

      {hasCycle && (
        <>
          {/* Progress */}

          <div className="mt-8">
            <div className="mb-2 flex justify-between text-sm text-slate-500">
              <span>Billing Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-cyan-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <SummaryCard
              icon={<CalendarDays size={20} />}
              label={t("residentDashboard.billingCycle.cyclePeriod")}
              value={`${overview.cycleStartDate} → ${overview.cycleEndDate}`}
            />

            <SummaryCard
              icon={<Droplets size={20} />}
              label={t("residentDashboard.billingCycle.consumedSoFar")}
              value={`${overview.cycleConsumptionKl} KL`}
            />

            <SummaryCard
              icon={<IndianRupee size={20} />}
              label={t("residentDashboard.billingCycle.estimatedCost")}
              value={`₹ ${overview.estimatedCost?.toLocaleString("en-IN")}`}
            />

            <SummaryCard
              icon={<Gauge size={20} />}
              label={t("residentDashboard.billingCycle.daysRemaining")}
              value={`${overview.daysRemaining} ${t(
                "residentDashboard.billingCycle.days"
              )}`}
            />

          </div>
        </>
      )}
    </motion.div>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
        {icon}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <h3 className="mt-2 text-lg font-bold text-slate-900 break-words">
        {value}
      </h3>
    </div>
  );
}

export default BillingCycleSummary;