import {
  Building2,
  Droplets,
  Wallet,
  BellRing,
  ChartSpline,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Droplets,
    title: "Smart Water Monitoring",
    description:
      "Track water consumption across apartments with detailed real-time insights and historical trends.",
  },
  {
    icon: Wallet,
    title: "Automated Billing",
    description:
      "Generate accurate invoices automatically using configurable tariff plans and consumption data.",
  },
  {
    icon: Building2,
    title: "Apartment Management",
    description:
      "Manage apartments, households and residents from one centralized platform.",
  },
  {
    icon: BellRing,
    title: "Leak Detection",
    description:
      "Identify unusual water usage patterns early and reduce unnecessary water wastage.",
  },
  {
    icon: ChartSpline,
    title: "Powerful Analytics",
    description:
      "Understand water consumption with interactive charts, reports and performance metrics.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Access",
    description:
      "Role-based authentication keeps administrator and resident experiences secure and separate.",
  },
];

const Features = () => {
  return (
    <section className="relative py-28 px-6 lg:px-20" id="features">

      <div className="mx-auto max-w-7xl">

        {/* Heading */}

        <div className="text-center">

          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-teal-600">
            Features
          </span>

          <h2 className="mt-5 text-5xl font-black text-slate-900">
            Everything you need
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            AquaTrack helps apartment communities monitor consumption,
            automate billing, reduce water waste and make smarter
            operational decisions from one modern platform.
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

export default Features;