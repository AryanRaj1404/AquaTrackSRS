import { motion } from "framer-motion";
import { CalendarDays, Droplets, IndianRupee, Gauge } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Summary card for the household's currently open billing cycle.
 * Expects the `overview` object returned by
 * residentDashboardService.getOverview().
 */
function BillingCycleSummary({ overview, loading }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <motion.div
        className="mg-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mg-empty-state">{t("residentDashboard.billingCycle.loading")}</div>
      </motion.div>
    );
  }

  const hasCycle = !!overview?.currentCycleId;

  return (
    <motion.div
      className="mg-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mg-toolbar">
        <div>
          <h2>{t("residentDashboard.billingCycle.title")}</h2>
          <p>
            {overview?.tariffPlanName
              ? t("residentDashboard.billingCycle.tariffPlan", { plan: overview.tariffPlanName })
              : t("residentDashboard.billingCycle.inProgress")}
          </p>
        </div>

        {hasCycle && (
          <span className="mg-status mg-status-active">
            {overview.cycleStatus}
          </span>
        )}
      </div>

      {!hasCycle && (
        <div className="mg-empty-state">
          {t("residentDashboard.billingCycle.noCycleOpen")}
        </div>
      )}

      {hasCycle && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="mg-summary-icon" style={{ width: 34, height: 34 }}>
              <CalendarDays size={16} />
            </div>
            <div>
              <span className="mg-table-secondary">{t("residentDashboard.billingCycle.cyclePeriod")}</span>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                {overview.cycleStartDate} &rarr; {overview.cycleEndDate}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="mg-summary-icon" style={{ width: 34, height: 34 }}>
              <Droplets size={16} />
            </div>
            <div>
              <span className="mg-table-secondary">{t("residentDashboard.billingCycle.consumedSoFar")}</span>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                {overview.cycleConsumptionKl} KL
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="mg-summary-icon" style={{ width: 34, height: 34 }}>
              <IndianRupee size={16} />
            </div>
            <div>
              <span className="mg-table-secondary">{t("residentDashboard.billingCycle.estimatedCost")}</span>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                &#8377; {overview.estimatedCost?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="mg-summary-icon" style={{ width: 34, height: 34 }}>
              <Gauge size={16} />
            </div>
            <div>
              <span className="mg-table-secondary">{t("residentDashboard.billingCycle.daysRemaining")}</span>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                {overview.daysRemaining ?? "-"} {t("residentDashboard.billingCycle.days")}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default BillingCycleSummary;
