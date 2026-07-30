import { motion } from "framer-motion";
import { CalendarDays, Droplets, IndianRupee, Gauge } from "lucide-react";

/**
 * Summary card for the household's currently open billing cycle.
 * Expects the `overview` object returned by
 * residentDashboardService.getOverview().
 */
function BillingCycleSummary({ overview, loading }) {
  if (loading) {
    return (
      <motion.div
        className="mg-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mg-empty-state">Loading billing cycle...</div>
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
          <h2>Current Billing Cycle</h2>
          <p>
            {overview?.tariffPlanName
              ? `Tariff plan: ${overview.tariffPlanName}`
              : "In-progress usage for this cycle"}
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
          No billing cycle is currently open for your apartment.
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
              <span className="mg-table-secondary">Cycle period</span>
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
              <span className="mg-table-secondary">Consumed so far</span>
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
              <span className="mg-table-secondary">Estimated cost</span>
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
              <span className="mg-table-secondary">Days remaining</span>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                {overview.daysRemaining ?? "-"} day(s)
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default BillingCycleSummary;
