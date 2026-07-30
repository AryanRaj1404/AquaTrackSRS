import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, ChevronLeft, ChevronRight } from "lucide-react";

const TIPS = [
  "Fix leaking taps promptly — a single drip can waste over 3,000 litres a year.",
  "Use a bucket instead of a hose when washing your vehicle.",
  "Install low-flow showerheads to cut usage without losing pressure.",
  "Reuse RO reject water for mopping or watering plants.",
  "Run washing machines only with a full load to save water per cycle.",
  "Turn off the tap while brushing your teeth or shaving.",
  "Check your meter reading before and after a 2-hour period with no water use — a change means a hidden leak.",
  "Water plants early morning or late evening to reduce evaporation loss.",
  "Collect and reuse water used for rinsing fruits and vegetables.",
  "Set a shorter shower timer — every minute saved cuts roughly 9 litres.",
];

// Tip shown first if the household is running above the building average
const HIGH_USAGE_TIP =
  "Your usage is above the building average this cycle — a quick leak check around taps and toilets could help bring it down.";

/**
 * Auto-rotating feed of water-saving tips. Pass `highUsage` to
 * surface a targeted tip first (e.g. when above the building average).
 */
function WaterTipsFeed({ highUsage = false }) {
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
          <h2>Water Saving Tips</h2>
          <p>Small habits, big savings</p>
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
          aria-label="Previous tip"
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
          aria-label="Next tip"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export default WaterTipsFeed;
