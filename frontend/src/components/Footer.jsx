import { Droplets, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white" id="contact">

      {/* Background Glow */}

      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-600/20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-20">

        {/* Top */}

        <div className="grid gap-16 lg:grid-cols-3">

          {/* Brand */}

          <div>

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-cyan-600 p-3 shadow-lg">
                <Droplets className="h-6 w-6 text-white" />
              </div>

              <div>
                <h2 className="text-3xl font-bold">
                  AquaTrack
                </h2>

                <p className="text-sm text-slate-400">
                  Smart Water Management Platform
                </p>
              </div>

            </div>

            <p className="mt-8 max-w-md leading-8 text-slate-400">

              AquaTrack empowers apartment communities to monitor
              water consumption, automate billing, detect leaks,
              and manage households from one intelligent platform.

            </p>

          </div>

          {/* Product */}

          <div>

            <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
              Product
            </h3>

            <div className="space-y-4">

              <a
                href="#features"
                className="block text-slate-300 transition hover:text-cyan-400"
              >
                Features
              </a>

              <Link
                to="/login"
                className="block text-slate-300 transition hover:text-cyan-400"
              >
                Login
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
              >
                Get Started

                <ArrowUpRight size={16} />
              </Link>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
              Contact
            </h3>

            <a
              href="mailto:aquatrack.platform@gmail.com"
              className="
                inline-flex
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/40
                px-5
                py-3
                text-slate-300
                transition-all
                duration-300
                hover:border-cyan-500
                hover:bg-slate-900
              "
            >
              <Mail size={18} />

              aquatrack.platform@gmail.com

            </a>

            <p className="mt-6 text-sm leading-7 text-slate-500">
              Designed for modern apartment communities focused on
              smarter water management and sustainable living.
            </p>

          </div>

        </div>

        {/* Divider */}

        <div className="my-12 h-px bg-slate-800" />

        {/* Bottom */}

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">

          <p>
            © {new Date().getFullYear()} AquaTrack. All rights reserved.
          </p>

          <p>
            Built with React, Spring Boot & PostgreSQL
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;