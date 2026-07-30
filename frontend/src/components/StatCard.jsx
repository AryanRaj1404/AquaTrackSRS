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
      className="group relative overflow-hidden rounded-[34px]
      border border-white/50
      bg-white/70
      backdrop-blur-2xl
      p-6
      shadow-[0_15px_45px_rgba(15,23,42,.08)]"
    >
      {/* Moving Glow */}

      <motion.div
        variants={{
          hover: {
            x: 80,
            y: -40,
            scale: 1.15,
          },
        }}
        transition={{
          duration: 0.8,
        }}
        className="absolute -right-24 -top-20 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl"
      />

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
                rotate: -8,
                scale: 1.08,
              },
            }}
            transition={{
              type: "spring",
              stiffness: 250,
            }}
            className="flex h-14 w-14 items-center justify-center rounded-3xl
            bg-gradient-to-br
            from-sky-500
            to-cyan-400
            text-white
            shadow-lg"
          >
            <Icon size={28} />
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
              className="text-slate-300 transition group-hover:text-sky-500"
            />
          </motion.div>

        </div>

        {/* Title */}

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
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
          className="mt-3"
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

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          <p className="mt-5 text-sm leading-6 text-slate-500">
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
        className="pointer-events-none absolute inset-0 rounded-[34px]
        ring-2
        ring-cyan-300/60"
      />
    </motion.article>
  );
}

export default StatCard;