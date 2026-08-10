import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "./LanguageSwitcher";

function Navbar() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-white/80 backdrop-blur-xl">
  <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

    {/* ================= LOGO ================= */}

    <Link
      to="/"
      className="group flex items-center gap-2 sm:gap-3"
    >
      <img
        src="/aquatrack-logo.svg"
        alt="AquaTrack"
        className="h-9 w-9 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10"
      />

      <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
        {t("common.appName")}
      </span>
    </Link>

    {/* ================= DESKTOP NAV ================= */}

    <nav className="hidden items-center gap-10 lg:flex">

      <a
        href="#home"
        className="group relative font-medium text-slate-600 transition-colors duration-300 hover:text-teal-700"
      >
        {t("navbar.home")}

        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-teal-600 transition-all duration-300 group-hover:w-full" />
      </a>

      <a
        href="#features"
        className="group relative font-medium text-slate-600 transition-colors duration-300 hover:text-teal-700"
      >
        {t("navbar.features")}

        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-teal-600 transition-all duration-300 group-hover:w-full" />
      </a>

      <a
        href="#contact"
        className="group relative font-medium text-slate-600 transition-colors duration-300 hover:text-teal-700"
      >
        {t("navbar.contact")}

        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-teal-600 transition-all duration-300 group-hover:w-full" />
      </a>

    </nav>

    {/* ================= RIGHT ================= */}

    <div className="flex items-center gap-2 sm:gap-4">

      {/* Desktop Language */}

      <div className="hidden md:block">
        <LanguageSwitcher />
      </div>

      {/* Mobile Globe */}

      <button
        type="button"
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-slate-200
          bg-white
          shadow-sm
          transition-all
          duration-300
          hover:border-cyan-400
          hover:bg-cyan-50
          md:hidden
        "
      >
        🌐
      </button>

      {/* CTA */}

      <Link
        to="/login"
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-gradient-to-r
          from-teal-700
          to-cyan-600
          px-4
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-lg
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:shadow-2xl
          active:scale-95
          sm:px-6
          sm:py-3
        "
      >
        <span className="hidden sm:inline">
          {t("navbar.getStarted")}
        </span>

        <span className="sm:hidden">
          Get Started
        </span>

        <ArrowRight
          size={16}
          className="hidden sm:block transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>

    </div>

  </div>
</header>
  );
}

export default Navbar;