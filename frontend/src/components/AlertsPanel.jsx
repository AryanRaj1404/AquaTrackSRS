import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Droplet, CheckCircle2 } from "lucide-react";
import { getHouseholdAlerts, acknowledgeAlert } from "../services/alertService";
import toast from "react-hot-toast";

function AlertsPanel({ householdId }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    if (!householdId) {
      setLoading(false);
      return;
    }
    try {
      const data = await getHouseholdAlerts(householdId);
      setAlerts(data);
    } catch {
      toast.error("Could not load alerts");
    } finally {
      setLoading(false);
    }
  }, [householdId]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!householdId) {
        setLoading(false);
        return;
      }
      try {
        const data = await getHouseholdAlerts(householdId);
        if (!ignore) setAlerts(data);
      } catch {
        if (!ignore) toast.error("Could not load alerts");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [householdId]);

  const handleAcknowledge = async (alertId) => {
    try {
      await acknowledgeAlert(householdId, alertId);
      toast.success("Alert acknowledged");
      fetchAlerts();
    } catch {
      toast.error("Failed to acknowledge");
    }
  };

  return (
    <motion.div
      className="mg-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mg-toolbar">
        <div>
          <h2>Recent Alerts</h2>
          <p>Threshold breaches and possible leaks</p>
        </div>
      </div>

      {loading && <div className="mg-empty-state">Loading alerts...</div>}

      {!loading && alerts.length === 0 && (
        <div className="mg-empty-state">
          <CheckCircle2 size={28} style={{ marginBottom: 8, color: "#15803d" }} />
          <p>No active alerts</p>
        </div>
      )}

      {!loading &&
        alerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "14px 0",
              borderBottom: "1px solid #edf1f4",
            }}
          >
            <div
              className="mg-summary-icon"
              style={{
                width: 38,
                height: 38,
                background:
                  alert.alertType === "ANOMALY_LEAK" ? "#fee2e2" : "#ffedd5",
                color: alert.alertType === "ANOMALY_LEAK" ? "#dc2626" : "#b45309",
              }}
            >
              {alert.alertType === "ANOMALY_LEAK" ? (
                <Droplet size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#25354c" }}>
                {alert.alertType === "ANOMALY_LEAK" ? "Possible Leak" : "Threshold Breach"}
              </p>
              <span className="mg-table-secondary">{alert.message}</span>
              <div style={{ marginTop: 6 }}>
                <span
                  className={
                    alert.acknowledged ? "mg-status mg-status-active" : "mg-status mg-status-pending"
                  }
                >
                  {alert.acknowledged ? "Acknowledged" : "Pending"}
                </span>
              </div>
            </div>

            {!alert.acknowledged && (
              <button
                className="mg-action-button"
                onClick={() => handleAcknowledge(alert.id)}
              >
                Acknowledge
              </button>
            )}
          </div>
        ))}
    </motion.div>
  );
}

export default AlertsPanel;