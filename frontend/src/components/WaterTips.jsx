import { motion } from "framer-motion";
import { Droplet } from "lucide-react";

const DEFAULT_TIPS = [
  "Fix leaking taps promptly — a single drip can waste over 3,000 litres a year.",
  "Use a bucket instead of a hose when washing your vehicle.",
  "Install low-flow showerheads to cut usage without losing pressure.",
  "Reuse RO reject water for mopping or watering plants.",
  "Run washing machines only with a full load to save water per cycle.",
];

function WaterTips({ tips = DEFAULT_TIPS }) {
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

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tips.map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div
              className="mg-summary-icon"
              style={{ width: 30, height: 30, flexShrink: 0 }}
            >
              <Droplet size={14} />
            </div>
            <p style={{ margin: 0, fontSize: 11, color: "#526075", lineHeight: 1.5 }}>{tip}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default WaterTips;