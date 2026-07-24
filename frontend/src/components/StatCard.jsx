import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import WaterFill from "./WaterFill";

function StatCard({
  icon: Icon,
  title,
  value,
  description,
  delay = 0,
  animatedValue = false,
}) {
  return (
    <motion.article
      className="mg-summary-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      transition={{
        duration: 0.35,
        delay,
        type: "spring",
        stiffness: 260,
      }}
    >
      <WaterFill level={40} />

      <div className="mg-summary-icon">
        <Icon size={22} />
      </div>

      <div>
        <p>{title}</p>

        <h2>
          {animatedValue && typeof value === "number" ? (
            <AnimatedNumber value={value} />
          ) : (
            value
          )}
        </h2>

        <span className="mg-table-secondary">
          {description}
        </span>
      </div>
    </motion.article>
  );
}

export default StatCard;