import { Droplets, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white" id="contact">

      {/* Background Glow */}

      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-600/20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-20">

        <div className="grid gap-16 lg:grid-cols-3">

          {/* Brand */}

          <div>

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-cyan-600 p-3 shadow-lg">
                <Droplets className="h-6 w-6 text-white" />
              </div>

              <div>

                <h2 className="text-3xl font-bold">
                  {t("common.appName")}
                </h2>

                <p className="text-sm text-slate-400">
                  {t("footer.tagline")}
                </p>

              </div>

            </div>

            <p className="mt-8 max-w-md leading-8 text-slate-400">
              {t("footer.description")}
            </p>

          </div>

          {/* Product */}

          <div>

            <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
              {t("footer.product")}
            </h3>

            <div className="space-y-4">

              <a
                href="#features"
                className="block text-slate-300 transition hover:text-cyan-400"
              >
                {t("footer.features")}
              </a>

              <Link
                to="/login"
                className="block text-slate-300 transition hover:text-cyan-400"
              >
                {t("footer.login")}
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-cyan-400 transition hover:text-cyan-300"
              >
                {t("footer.getStarted")}

                <ArrowUpRight size={16} />

              </Link>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
              {t("footer.contact")}
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
              {t("footer.contactDescription")}
            </p>

          </div>

        </div>

        <div className="my-12 h-px bg-slate-800" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">

          <p>
            © {new Date().getFullYear()} {t("common.appName")}. {t("footer.rights")}
          </p>

          <p>
            {t("footer.builtWith")}
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;