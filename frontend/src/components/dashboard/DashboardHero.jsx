import {
  CalendarDays,
  Building2,
  Activity,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

export default function DashboardHero({ dashboard }) {
  const username =
    localStorage.getItem("username") ||
    localStorage.getItem("user") ||
    "Administrator";

  const greeting = (() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const collectionRate = Number(
    dashboard?.collectionRate ?? 0
  ).toFixed(1);

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-10 shadow-[0_20px_60px_rgba(15,23,42,.08)]">

      {/* Background decoration */}

      <div className="absolute -top-28 right-0 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">

        {/* Left */}

        <div className="max-w-3xl">

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">

            <ShieldCheck size={16} />

            Platform Operational

          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-900">

            {greeting},

            <br />

            {username}

          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">

            Welcome back to AquaTrack.

            Monitor apartment performance, billing,
            water consumption and revenue from one place.

          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">

            <div className="flex items-center gap-2">

              <CalendarDays size={17} />

              {today}

            </div>

            <div className="flex items-center gap-2">

              <Building2 size={17} />

              AquaTrack Platform

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="grid w-full max-w-md gap-4">

          <div className="rounded-3xl bg-white/80 p-6 backdrop-blur">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Collection Rate
                </p>

                <h2 className="mt-1 text-4xl font-black">

                  {collectionRate}%

                </h2>

              </div>

              <div className="rounded-2xl bg-emerald-100 p-4 text-emerald-600">

                <TrendingUp />

              </div>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-white/80 p-5">

              <Activity
                className="mb-3 text-sky-500"
                size={22}
              />

              <p className="text-xs uppercase tracking-wider text-slate-400">

                Water Loss

              </p>

              <h3 className="mt-2 text-2xl font-bold">

                {Number(
                  dashboard?.waterLossPercentage ?? 0
                ).toFixed(1)}
                %

              </h3>

            </div>

            <div className="rounded-2xl bg-white/80 p-5">

              <Building2
                className="mb-3 text-indigo-500"
                size={22}
              />

              <p className="text-xs uppercase tracking-wider text-slate-400">

                Apartments

              </p>

              <h3 className="mt-2 text-2xl font-bold">

                {dashboard?.totalApartments ?? 0}

              </h3>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}