import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden px-6 py-20 sm:px-8 lg:px-12 lg:py-28">

  {/* Background Glow */}

  <div className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-cyan-300/20 blur-3xl" />


  <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-teal-300/20 blur-3xl" />

  <div className="relative z-10 mx-auto flex max-w-7xl flex-col-reverse items-center gap-14 lg:flex-row lg:gap-20">

    {/* ================= LEFT ================= */}

    <div className="w-full flex-1 text-center lg:text-left">

      {/* Badge */}

      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">

        <Sparkles className="h-4 w-4 text-cyan-600" />

        <span className="text-xs font-medium text-cyan-700 sm:text-sm">
          {t("hero.badge")}
        </span>

      </div>

      {/* Heading */}

      <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl">

        {t("hero.title1")}

        <br />

        {t("hero.title2")}

        <br />

        {t("hero.title3")}

        <span className="block bg-gradient-to-r from-teal-700 to-cyan-500 bg-clip-text text-transparent">
          {t("hero.titleHighlight")}
        </span>

      </h1>

      {/* Description */}

      <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg lg:mx-0">

        {t("hero.description")}

      </p>

      {/* CTA */}

      <Link
        to="/login"
        className="
            relative
            z-20
            mt-8
            inline-flex
            items-center
            gap-3
            rounded-2xl
            bg-gradient-to-r
            from-teal-700
            to-cyan-600
            px-7
            py-4
            text-base
            font-semibold
            text-white
            shadow-xl
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-2xl
      "
      >
        {t("navbar.getStarted")}
        <ArrowRight className="h-5 w-5" />
      </Link>

      {/* Stats */}

      <div className="mt-12 grid grid-cols-3 gap-6 text-center sm:flex sm:justify-center lg:justify-start lg:gap-12">

        <div>

          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            50+
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {t("hero.stats.apartments")}
          </p>

        </div>

        <div>

          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            7300+
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {t("hero.stats.households")}
          </p>

        </div>

        <div>

          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            95K KL
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {t("hero.stats.waterManaged")}
          </p>

        </div>

      </div>

    </div>

    {/* ================= RIGHT ================= */}

    <div className="relative hidden md:block md:flex-1">

      {/* Live Usage */}

      <div className="absolute left-0 top-2 z-10 rounded-2xl bg-white/90 p-4 shadow-2xl backdrop-blur sm:left-4 lg:-left-10">

        <p className="text-[10px] uppercase tracking-widest text-slate-400 sm:text-xs">
          {t("hero.liveUsage")}
        </p>

        <h3 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
          68,578 KL
        </h3>

      </div>

      {/* Dashboard */}

      <div className="rounded-[28px] border border-white/60 bg-white/70 p-3 shadow-[0_35px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl">

        <img
          src="/dashboard-preview.png"
          alt={t("hero.dashboardPreview")}
          className="w-full rounded-3xl"
        />

      </div>

      {/* Status */}

      <div className="absolute bottom-2 right-0 rounded-2xl bg-white/90 p-4 shadow-2xl backdrop-blur sm:right-4 lg:-right-4">

        <p className="text-[10px] uppercase tracking-widest text-slate-400 sm:text-xs">
          {t("hero.leakDetection")}
        </p>

        <h3 className="mt-1 text-sm font-bold text-emerald-600 sm:text-base">
          {t("hero.systemNormal")}
        </h3>

      </div>

    </div>

  </div>

</section>
  );
};

export default Hero;