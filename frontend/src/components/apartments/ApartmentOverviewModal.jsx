import {
  Building2,
  Home,
  MapPin,
  Users,
  CheckCircle2,
  Circle,
  X,
  Hash,
} from "lucide-react";

export default function ApartmentOverviewModal({
    showHouseholdsModal,
    selectedApartment,
    overview,
    loading,
    onClose,
}) {
  if (!showHouseholdsModal || !selectedApartment) return null;

  if (loading) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-16 shadow-2xl text-center">

        <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />

        <h2 className="text-2xl font-bold text-slate-900">
          Loading Apartment Overview
        </h2>

        <p className="mt-3 text-slate-500">
          Fetching the latest statistics...
        </p>

      </div>
    </div>
  );
}

  const stats = [
    {
      title: "Households",
      value: overview?.householdCount ?? 0,
      icon: Home,
      color: "bg-sky-100 text-sky-700",
    },
    {
      title: "Residents",
      value: overview?.residentCount ?? 0,
      icon: Users,
      color: "bg-violet-100 text-violet-700",
    },
    {
      title: "Occupied",
      value: overview?.occupiedHouseholds ?? 0,
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Vacant",
      value: overview?.vacantHouseholds ?? 0,
      icon: Circle,
      color: "bg-amber-100 text-amber-700",
    },
  ];

  const occupancyPercentage =
    overview?.householdCount > 0
      ? Math.round(
          (overview.occupiedHouseholds /
            overview.householdCount) *
            100
        )
      : 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="flex items-start justify-between border-b border-slate-100 px-8 py-7">
          <div>

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
              <Building2 size={15} />
              Apartment Overview
            </div>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {selectedApartment.name}
            </h2>

            <p className="mt-2 flex items-center gap-2 text-slate-500">
              <MapPin size={16} />
              {selectedApartment.address}
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-3 transition hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}

        <div className="p-8 space-y-8">

          {/* Stat Cards */}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-slate-500">
                        {card.title}
                      </p>

                      <h3 className="mt-2 text-3xl font-bold text-slate-900">
                        {card.value}
                      </h3>

                    </div>

                    <div
                      className={`rounded-2xl p-4 ${card.color}`}
                    >
                      <Icon size={24} />
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Details */}

          <div className="grid gap-6 lg:grid-cols-2">

            {/* Left */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

              <h3 className="mb-6 text-lg font-bold text-slate-900">
                Apartment Information
              </h3>

              <div className="space-y-5">

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-sky-100 p-3 text-sky-700">
                    <Building2 size={20} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Apartment Name
                    </p>

                    <p className="font-semibold text-slate-900">
                      {selectedApartment.name}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Address
                    </p>

                    <p className="font-semibold text-slate-900">
                      {selectedApartment.address}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
                    <Hash size={20} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Workspace ID
                    </p>

                    <p className="font-semibold text-slate-900">
                      #{selectedApartment.id}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Right */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

              <h3 className="mb-6 text-lg font-bold text-slate-900">
                Occupancy Status
              </h3>

              <div className="mb-5 flex items-center justify-between">

                <span className="text-slate-600">
                  Apartment Occupancy
                </span>

                <span className="font-bold text-teal-700">
                  {occupancyPercentage}%
                </span>

              </div>

              <div className="h-4 overflow-hidden rounded-full bg-slate-200">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 transition-all"
                  style={{
                    width: `${occupancyPercentage}%`,
                  }}
                />

              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">

                <div className="rounded-xl bg-white p-4 text-center shadow-sm">

                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Occupied
                  </p>

                  <p className="mt-2 text-2xl font-bold text-emerald-600">
                    {overview?.occupiedHouseholds ?? 0}
                  </p>

                </div>

                <div className="rounded-xl bg-white p-4 text-center shadow-sm">

                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Vacant
                  </p>

                  <p className="mt-2 text-2xl font-bold text-amber-600">
                    {overview?.vacantHouseholds ?? 0}
                  </p>

                </div>

              </div>

              <div className="mt-6 rounded-xl bg-white p-4 shadow-sm">

                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Average Occupancy
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {overview?.averageOccupancy ?? 0}
                </p>

                <p className="text-sm text-slate-500">
                  Residents per household
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t border-slate-100 px-8 py-6">

          <button
            onClick={onClose}
            className="rounded-xl bg-teal-700 px-7 py-3 font-semibold text-white transition hover:bg-teal-800"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}