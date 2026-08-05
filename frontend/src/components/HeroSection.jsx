import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24 lg:px-20" id="home">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-10 h-96 w-96 rounded-full bg-cyan-200/40 blur-[120px]" />
        <div className="absolute right-0 top-20 h-[420px] w-[420px] rounded-full bg-sky-200/40 blur-[150px]" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-20 lg:flex-row">

        {/* LEFT */}
        <div className="flex-1">

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-5 py-2 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-cyan-600" />

            <span className="text-sm font-medium text-cyan-700">
              Smart Water Intelligence
            </span>
          </div>

          <h1 className="max-w-3xl text-6xl font-black leading-[1.05] text-slate-900 lg:text-7xl">

            Smart Water

            <br />

            Management

            <br />

            for

            <span className="block bg-gradient-to-r from-teal-700 to-cyan-500 bg-clip-text text-transparent">
              Modern Communities
            </span>

          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">

            Monitor water consumption, automate billing,
            detect leaks and manage apartment communities
            from one intelligent platform.

          </p>

          <Link
            to="/login"
            className="mt-10 inline-flex items-center gap-3 rounded-2xl
            bg-gradient-to-r from-teal-700 to-cyan-600
            px-8 py-4 text-lg font-semibold text-white
            shadow-xl transition-all duration-300 hover:scale-105"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Link>

          <div className="mt-12 flex items-center gap-8">

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                50+
              </h2>

              <p className="text-sm text-slate-500">
                Apartments
              </p>

            </div>

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                7300+
              </h2>

              <p className="text-sm text-slate-500">
                Households
              </p>

            </div>

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                95K KL
              </h2>

              <p className="text-sm text-slate-500">
                Water Managed
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="relative flex-1">

          <div className="absolute -left-50 top-10 rounded-2xl bg-white/90 p-5 shadow-2xl backdrop-blur">

            <p className="text-xs uppercase tracking-widest text-slate-400">
              Live Usage
            </p>

            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              68,578 KL
            </h3>

          </div>

          <div className="rounded-[34px] border border-white/60 bg-white/70 p-4 shadow-[0_35px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl">

            <img
              src="/dashboard-preview.png"
              alt="Dashboard Preview"
              className="rounded-3xl"
            />

          </div>

          <div className="absolute -bottom-8 right-0 rounded-2xl bg-white/90 p-5 shadow-2xl backdrop-blur">

            <p className="text-xs uppercase tracking-widest text-slate-400">
              Leak Detection
            </p>

            <h3 className="mt-2 font-bold text-emerald-600">
              All Systems Normal
            </h3>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;