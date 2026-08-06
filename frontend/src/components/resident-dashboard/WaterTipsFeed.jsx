import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Droplet, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Auto-rotating feed of water-saving tips. Pass `highUsage` to
 * surface a targeted tip first (e.g. when above the building average).
 */
function WaterTipsFeed({ highUsage = false }) {
  const { t } = useTranslation();
  const TIPS = t("residentDashboard.waterTips.list", { returnObjects: true });
  const HIGH_USAGE_TIP = t("residentDashboard.waterTips.highUsageTip");

  const tips = highUsage ? [HIGH_USAGE_TIP, ...TIPS] : TIPS;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % tips.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const goPrev = () =>
    setIndex((prev) => (prev - 1 + tips.length) % tips.length);
  const goNext = () => setIndex((prev) => (prev + 1) % tips.length);

  return (
    <motion.div
      className="mg-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mg-toolbar">
        <div>
          <h2>{t("residentDashboard.waterTips.title")}</h2>
          <p>{t("residentDashboard.waterTips.subtitle")}</p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          minHeight: 64,
        }}
      >
        <button
          type="button"
          className="mg-action-button"
          onClick={goPrev}
          aria-label={t("residentDashboard.waterTips.previousTip")}
        >
          <ChevronLeft size={14} />
        </button>

        <div style={{ flex: 1, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div className="mg-summary-icon" style={{ width: 30, height: 30, flexShrink: 0 }}>
            <Droplet size={14} />
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              style={{ margin: 0, fontSize: 12, color: "#526075", lineHeight: 1.5 }}
            >
              {tips[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <button
          type="button"
          className="mg-action-button"
          onClick={goNext}
          aria-label={t("residentDashboard.waterTips.nextTip")}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export default WaterTipsFeed;
