import GlassPanel from "../ui/GlassPanel";

import {
  ArrowUpRight,
  Bell,
  Building2,
  Droplets,
  FileText,
  Mail,
} from "lucide-react";

const activities = [
  {
    title: "Meter readings uploaded",
    description: "Harmony Gardens • 126 households",
    time: "2 mins ago",
    icon: Droplets,
    color: "bg-sky-100 text-sky-600",
  },
  {
    title: "Bills generated",
    description: "River Plaza • July 2026",
    time: "18 mins ago",
    icon: FileText,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Payment reminders sent",
    description: "38 households notified",
    time: "42 mins ago",
    icon: Mail,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "New apartment registered",
    description: "Sunrise Residency",
    time: "Today",
    icon: Building2,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "High consumption alert",
    description: "Green Valley",
    time: "Today",
    icon: Bell,
    color: "bg-red-100 text-red-600",
  },
];

export default function RecentActivity() {
  return (
    <GlassPanel className="p-8 shadow-2xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
            Recent Activity
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            What's happening
          </h2>

        </div>

        <button className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
          View History
          <ArrowUpRight size={16} />
        </button>

      </div>

      <div className="mt-8">

        {activities.map((activity, index) => {

          const Icon = activity.icon;

          return (

            <div
              key={activity.title}
              className={`flex items-start gap-5 ${
                index !== activities.length - 1
                  ? "border-b border-slate-100 pb-6 mb-6"
                  : ""
              }`}
            >

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${activity.color}`}
              >
                <Icon size={20} />
              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <h3 className="font-semibold text-slate-900">
                    {activity.title}
                  </h3>

                  <span className="text-sm text-slate-400">
                    {activity.time}
                  </span>

                </div>

                <p className="mt-1 text-slate-500">
                  {activity.description}
                </p>

              </div>

            </div>

          );

        })}

      </div>

    </GlassPanel>
  );
}