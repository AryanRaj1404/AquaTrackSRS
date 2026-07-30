import { motion } from "framer-motion";
import { Droplets, Sparkles, ArrowRight } from "lucide-react";

const DEFAULT_TIPS = [
  {
    title: "Fix Leaking Taps",
    description:
      "A single dripping tap can waste over 3,000 litres of water every year.",
    saving: "Save up to 3,000 L/year",
  },
  {
    title: "Use a Bucket",
    description:
      "Use a bucket instead of a hose when washing your vehicle.",
    saving: "Reduce unnecessary water usage",
  },
  {
    title: "Reuse RO Water",
    description:
      "Reuse RO reject water for mopping, gardening or cleaning.",
    saving: "Reuse instead of wasting",
  },
];

function WaterTips({ tips = DEFAULT_TIPS }) {
  const tip = tips[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[30px] border border-white/50 bg-white/80 p-8 backdrop-blur-xl shadow-xl"
    >
      {/* Background Glow */}

      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-200/25 blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-center gap-3">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg">

            <Droplets size={26} />

          </div>

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-600">
              Today's Tip
            </p>

            <h2 className="text-2xl font-bold text-slate-900">
              Water Conservation
            </h2>

          </div>

        </div>

        <div className="mt-8 rounded-3xl bg-slate-50/70 p-6">

          <h3 className="text-xl font-bold text-slate-900">
            {tip.title}
          </h3>

          <p className="mt-3 leading-7 text-slate-600">
            {tip.description}
          </p>

        </div>

        <div className="mt-6 rounded-2xl bg-gradient-to-r from-sky-50 to-cyan-50 p-5">

          <div className="flex items-center gap-3">

              <Sparkles
                  size={18}
                  className="text-sky-500"
              />

              <span className="font-semibold text-slate-700">
                  {tip.saving}
              </span>

          </div>

          <button
              className="mt-5 w-full rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
              Learn More
          </button>

      </div>

      </div>

    </motion.div>
  );
}

export default WaterTips;