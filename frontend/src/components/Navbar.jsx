import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-20">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <img
            src="/aquatrack-logo.svg"
            alt="AquaTrack"
            className="h-10 w-10"
          />

          <span className="text-2xl font-black text-slate-900">
            AquaTrack
          </span>
        </Link>

        {/* Navigation */}

        <nav className="hidden items-center gap-10 md:flex">

          <a
            href="#features"
            className="font-medium text-slate-600 transition hover:text-teal-700"
          >
            Features
          </a>

          <a
            href="#dashboard"
            className="font-medium text-slate-600 transition hover:text-teal-700"
          >
            Dashboard
          </a>

          <a
            href="#contact"
            className="font-medium text-slate-600 transition hover:text-teal-700"
          >
            Contact
          </a>

        </nav>

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
            px-6
            py-3
            text-sm
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:scale-105
          "
        >
          Get Started

          <ArrowRight size={16} />
        </Link>

      </div>
    </header>
  );
}

export default Navbar;