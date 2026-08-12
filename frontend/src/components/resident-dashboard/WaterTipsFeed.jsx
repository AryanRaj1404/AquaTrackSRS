import { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Droplets, Sparkles } from "lucide-react";

const WATER_QUOTES = [
  {
    quote:
      "Thousands have lived without love, not one without water.",
    author: "W. H. Auden",
  },
  {
    quote:
      "Save water today, so every home has water tomorrow.",
    author: "Water Conservation",
  },
  {
    quote:
      "Every drop you save is a gift to the next generation.",
    author: "AquaTrack",
  },
  {
    quote:
      "Water is life's most precious resource. Use it wisely.",
    author: "Environmental Awareness",
  },
  {
    quote:
      "Small daily habits create rivers of change.",
    author: "AquaTrack",
  },
  {
    quote:
      "A leaking tap may seem small, but its impact is enormous.",
    author: "Water Conservation",
  },
  {
    quote:
      "The future of water begins with the choices we make today.",
    author: "Sustainability Initiative",
  },
];

export default function WaterTipsFeed({ highUsage = false }) {
  const randomQuote = useMemo(() => {
    return WATER_QUOTES[
      Math.floor(Math.random() * WATER_QUOTES.length)
    ];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 text-white shadow-lg"
    >
      <div className="relative p-8">

        {/* Decorative Circle */}

        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-white/5" />

        {/* Warning */}

        {highUsage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-300/40 bg-red-500/20 p-4 backdrop-blur-sm">
            <AlertTriangle className="h-6 w-6 text-yellow-300" />

            <div>
              <h3 className="font-semibold">
                Higher Water Usage Detected
              </h3>

              <p className="text-sm text-cyan-100">
                Your household is consuming more water than the
                apartment average. Consider reducing unnecessary usage.
              </p>
            </div>
          </div>
        )}

        {/* Quote */}

        <div className="relative z-10">

          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Droplets className="h-8 w-8" />
          </div>

          <Sparkles className="mb-4 h-5 w-5 text-cyan-100" />

          <h2 className="text-2xl font-bold leading-relaxed">
            "{randomQuote.quote}"
          </h2>

          <p className="mt-6 text-cyan-100">
            — {randomQuote.author}
          </p>

          <div className="mt-10 border-t border-white/20 pt-4">
            <p className="text-sm text-cyan-100">
              💙 Every litre saved today helps build a sustainable tomorrow.
            </p>
          </div>

        </div>

      </div>
    </motion.div>
  );
}