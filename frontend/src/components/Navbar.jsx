import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "./LanguageSwitcher";

function Navbar() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-white/70 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-20">

        {/* Logo */}

        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <img
            src="/aquatrack-logo.svg"
            alt="AquaTrack"
            className="h-10 w-10 transition-transform duration-300 group-hover:scale-105"
          />

          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            {t("common.appName")}
          </span>
        </Link>

        {/* Navigation */}

        <nav className="hidden items-center gap-10 md:flex">

          <a
            href="#home"
            className="group relative font-medium text-slate-600 transition-colors duration-300 hover:text-teal-700"
          >
            {t("navbar.home")}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a
            href="#features"
            className="group relative font-medium text-slate-600 transition-colors duration-300 hover:text-teal-700"
          >
            {t("navbar.features")}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a
            href="#contact"
            className="group relative font-medium text-slate-600 transition-colors duration-300 hover:text-teal-700"
          >
            {t("navbar.contact")}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
          </a>

        </nav>

        {/* Right Section */}

        <div className="flex items-center gap-4">

          {/* Language */}

          
            <LanguageSwitcher />
          

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
              px-7
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-2xl
              active:scale-95
            "
          >
            {t("navbar.getStarted")}

            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>

        </div>

      </div>
    </header>
  );
}

export default Navbar;