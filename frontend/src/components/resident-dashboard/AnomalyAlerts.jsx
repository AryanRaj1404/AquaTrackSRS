import AlertsPanel from "../AlertsPanel";

/**
 * Thin resident-dashboard wrapper around the shared AlertsPanel,
 * kept as its own file so it can be swapped/extended independently
 * of the admin-side usage.
 */
function AnomalyAlerts({ householdId }) {
  return <AlertsPanel householdId={householdId} />;
}

export default AnomalyAlerts;
