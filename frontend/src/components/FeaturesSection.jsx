import {
  Building2,
  Droplets,
  Wallet,
  BellRing,
  ChartSpline,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Droplets,
      title: t("features.cards.waterMonitoring.title"),
      description: t("features.cards.waterMonitoring.description"),
    },
    {
      icon: Wallet,
      title: t("features.cards.billing.title"),
      description: t("features.cards.billing.description"),
    },
    {
      icon: Building2,
      title: t("features.cards.apartment.title"),
      description: t("features.cards.apartment.description"),
    },
    {
      icon: BellRing,
      title: t("features.cards.leak.title"),
      description: t("features.cards.leak.description"),
    },
    {
      icon: ChartSpline,
      title: t("features.cards.analytics.title"),
      description: t("features.cards.analytics.description"),
    },
    {
      icon: ShieldCheck,
      title: t("features.cards.security.title"),
      description: t("features.cards.security.description"),
    },
  ];

  return (
    <section
      id="features"
      className="px-6 py-28 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}

        <div className="text-center">

          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-teal-600">
            {t("features.badge")}
          </span>

          <h2 className="mt-5 text-5xl font-black text-slate-900">
            {t("features.heading")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {t("features.description")}
          </p>

        </div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  group
                  rounded-3xl
                  border border-white/70
                  bg-white/70
                  backdrop-blur-xl
                  p-8
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:shadow-2xl
                "
              >
                <div
                  className="
                    mb-6
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-teal-700
                    to-cyan-600
                    shadow-lg
                  "
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;