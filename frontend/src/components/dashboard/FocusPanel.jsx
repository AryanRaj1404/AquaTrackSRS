import GlassPanel from "../ui/GlassPanel";

import {
  ArrowRight,
  Bell,
  Droplets,
  FileSpreadsheet,
} from "lucide-react";

const tasks = [
  {
    title: "Upload Meter Readings",
    subtitle: "Import today's consumption logs",
    icon: Droplets,
    color: "bg-sky-100 text-sky-600",
  },
  {
    title: "Review Active Alerts",
    subtitle: "Check unresolved system alerts",
    icon: Bell,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Generate Monthly Bills",
    subtitle: "Create invoices for current billing cycle",
    icon: FileSpreadsheet,
    color: "bg-emerald-100 text-emerald-600",
  },
];

export default function FocusPanel() {
  return (
    <GlassPanel className="p-8 shadow-2xl">

      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
          Today's Focus
        </p>

        <h2 className="mt-2 text-3xl font-bold text-slate-900">
          Pick up where you left off.
        </h2>
      </div>

      <div className="space-y-4">

        {tasks.map((task) => {
          const Icon = task.icon;

          return (
            <button
              key={task.title}
              className="group flex w-full items-center justify-between rounded-2xl border border-transparent bg-white/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-100 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${task.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="text-left">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {task.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {task.subtitle}
                  </p>
                </div>

              </div>

              <ArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-600" />

            </button>
          );
        })}

      </div>

    </GlassPanel>
  );
}