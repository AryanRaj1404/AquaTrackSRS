import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CircleUser, Home, Gauge, ChevronRight } from "lucide-react";

/**
 * Quick-access card linking to the resident's profile, showing
 * their household and meter details from the overview payload.
 */
function ProfileShortcut({ overview, loading }) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  return (
    <motion.div
      className="mg-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mg-toolbar">
        <div>
          <h2>Household & Profile</h2>
          <p>Your account details at a glance</p>
        </div>
      </div>

      {loading && <div className="mg-empty-state">Loading...</div>}

      {!loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="mg-summary-icon" style={{ width: 32, height: 32 }}>
              <CircleUser size={16} />
            </div>
            <div>
              <span className="mg-table-secondary">Signed in as</span>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                {username || "Resident"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="mg-summary-icon" style={{ width: 32, height: 32 }}>
              <Home size={16} />
            </div>
            <div>
              <span className="mg-table-secondary">Household</span>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                {overview?.flatNumber
                  ? `${overview.flatNumber} — ${overview.apartmentName}`
                  : "Not linked to a household"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="mg-summary-icon" style={{ width: 32, height: 32 }}>
              <Gauge size={16} />
            </div>
            <div>
              <span className="mg-table-secondary">Meter</span>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                {overview?.meterNumber
                  ? `${overview.meterNumber} (${overview.meterType})`
                  : "No meter on record"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mg-secondary-button"
            onClick={() => navigate("/profile")}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            View Full Profile
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default ProfileShortcut;
