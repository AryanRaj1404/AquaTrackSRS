import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CircleUser, Home, Gauge, ChevronRight } from "lucide-react";

/**
 * Quick-access card linking to the resident's profile, showing
 * their household and meter details from the overview payload.
 */
function ProfileShortcut({ overview, loading }) {
  const { t } = useTranslation();
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
          <h2>{t("residentDashboard.profileShortcut.title")}</h2>
          <p>{t("residentDashboard.profileShortcut.subtitle")}</p>
        </div>
      </div>

      {loading && <div className="mg-empty-state">{t("residentDashboard.profileShortcut.loading")}</div>}

      {!loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="mg-summary-icon" style={{ width: 32, height: 32 }}>
              <CircleUser size={16} />
            </div>
            <div>
              <span className="mg-table-secondary">{t("residentDashboard.profileShortcut.signedInAs")}</span>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                {username || t("residentDashboard.profileShortcut.resident")}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="mg-summary-icon" style={{ width: 32, height: 32 }}>
              <Home size={16} />
            </div>
            <div>
              <span className="mg-table-secondary">{t("residentDashboard.profileShortcut.household")}</span>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                {overview?.flatNumber
                  ? `${overview.flatNumber} — ${overview.apartmentName}`
                  : t("residentDashboard.profileShortcut.notLinked")}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="mg-summary-icon" style={{ width: 32, height: 32 }}>
              <Gauge size={16} />
            </div>
            <div>
              <span className="mg-table-secondary">{t("residentDashboard.profileShortcut.meter")}</span>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                {overview?.meterNumber
                  ? `${overview.meterNumber} (${overview.meterType})`
                  : t("residentDashboard.profileShortcut.noMeter")}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mg-secondary-button"
            onClick={() => navigate("/profile")}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            {t("residentDashboard.profileShortcut.viewFullProfile")}
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default ProfileShortcut;
