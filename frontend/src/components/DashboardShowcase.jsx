import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Live water consumption monitoring",
  "Automated billing & invoice generation",
  "Real-time leak & anomaly detection",
  "Powerful analytics for apartment managers",
];

export default function DashboardShowcase() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-32" id="dashboard">

      {/* Background Glow */}

      <div className="absolute left-1/2 top-32 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-200/40 blur-[140px]" />

      <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-20 px-6 lg:flex-row lg:px-20">

        {/* Dashboard */}

        <div className="flex-1">

          <div
            className="
              overflow-hidden
              rounded-[32px]
              border
              border-white/70
              bg-white
              shadow-[0_30px_80px_rgba(15,23,42,.08)]
            "
          >

            <img
              src="/dashboard-preview.png"
              alt="AquaTrack Dashboard"
              className="w-full"
            />

          </div>

        </div>

        {/* Content */}

        <div className="max-w-xl flex-1">

          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-teal-700">
            Dashboard
          </span>

          <h2 className="mt-5 text-5xl font-black leading-tight text-slate-900">

            Everything you need,

            <br />

            all in one place.

          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-600">

            AquaTrack gives administrators complete visibility into
            water consumption, apartment management and billing through
            one intuitive dashboard designed for modern communities.

          </p>

          <div className="mt-10 space-y-5">

            {features.map((item) => (

              <div
                key={item}
                className="flex items-center gap-4"
              >

                <CheckCircle2
                  size={22}
                  className="text-teal-700"
                />

                <span className="text-slate-700">
                  {item}
                </span>

              </div>

            ))}

          </div>

          <Link
            to="/login"
            className="
              mt-12
              inline-flex
              items-center
              gap-3
              rounded-full
              bg-gradient-to-r
              from-teal-700
              to-cyan-600
              px-7
              py-3.5
              font-semibold
              text-white
              transition
              hover:scale-105
            "
          >

            Explore Dashboard

            <ArrowRight size={18} />

          </Link>

        </div>

      </div>

    </section>
  );
}