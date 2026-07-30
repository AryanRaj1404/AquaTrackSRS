import { BarChart3 } from "lucide-react";
import GlassPanel from "../ui/GlassPanel";

export default function ConsumptionSection() {
  return (
    <GlassPanel className="p-8 shadow-2xl">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
            Water Consumption
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Daily Usage Overview
          </h2>

          <p className="mt-2 text-slate-500">
            Track daily water consumption across all registered apartments.
          </p>

        </div>

        <div className="flex rounded-2xl bg-slate-100 p-1">

          {["30D", "90D", "6M", "1Y"].map((period, index) => (
            <button
              key={period}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
                index === 0
                  ? "bg-white shadow text-slate-900"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {period}
            </button>
          ))}

        </div>

      </div>

      <div className="mt-8 flex h-[420px] items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-sky-50">

        <div className="text-center">

          <BarChart3 className="mx-auto h-14 w-14 text-sky-500" />

          <h3 className="mt-5 text-xl font-bold text-slate-900">
            Monthly Consumption Chart
          </h3>

          <p className="mt-2 text-slate-500">
            Janith's chart will live here.
          </p>

        </div>

      </div>

    </GlassPanel>
  );
}