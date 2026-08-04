import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";

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
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover="hover"
      transition={{
        duration: 0.45,
        delay,
        type: "spring",
        stiffness: 140,
      }}
      className="group relative overflow-hidden rounded-[28px]
      border border-slate-200/60
      bg-white/70
      backdrop-blur-2xl
      p-6
      shadow-[0_8px_24px_rgba(15,23,42,.06)]"
    >
      {/* Moving Glow */}

      

      {/* Reflection */}

      <motion.div
        variants={{
          hover: {
            x: 40,
          },
        }}
        transition={{
          duration: 0.7,
        }}
        className="absolute -left-28 top-0 h-full w-20 rotate-12 bg-white/25 blur-xl"
      />

      <div className="relative z-10 flex h-full flex-col">

        {/* Top */}

        <div className="flex items-start justify-between">

          <motion.div
            variants={{
              hover: {
                rotate: -3,
                scale: 1.04,
              },
            }}
            transition={{
              type: "spring",
              stiffness: 250,
            }}
            className="flex h-12 w-12 items-center justify-center rounded-3xl
            bg-gradient-to-br
            from-teal-700
            to-cyan-600
            text-white
            shadow-[0_8px_16px_rgba(8,68,91,0.15)]"
          >
            <Icon size={22} />
          </motion.div>

          <motion.div
            variants={{
              hover: {
                x: 4,
                y: -4,
              },
            }}
          >
            <ArrowUpRight
              size={20}
              className="text-slate-300 transition group-hover:text-[#08445B]"
            />
          </motion.div>

        </div>

        {/* Title */}

        <p className="mt-3 text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
          {title}
        </p>

        {/* Value */}

        <motion.div
          variants={{
            hover: {
              scale: 1.04,
            },
          }}
          transition={{
            type: "spring",
            stiffness: 300,
          }}
          className="mt-4"
        >
          <h2 className="text-4xl font-black tracking-tight text-slate-900">

            {animatedValue && typeof value === "number" ? (
              <AnimatedNumber value={value} />
            ) : (
              value
            )}

          </h2>
        </motion.div>

        <div className="mt-auto pt-5">

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0A4D68]/15 to-transparent" />

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {description}
          </p>

        </div>

      </div>

      {/* Hover Border */}

      <motion.div
        variants={{
          hover: {
            opacity: 1,
          },
        }}
        initial={{
          opacity: 0,
        }}
        className="pointer-events-none absolute inset-0 rounded-[28px]
        ring-2
        ring-[#0A4D68]/30"
      />
    </motion.article>
  );
}

export default StatCard;