import { Building2, MapPin, Save, X } from "lucide-react";

export default function AddApartmentModal({
  showForm,
  form,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  if (!showForm) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="flex items-start justify-between border-b border-slate-100 px-8 py-7">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">
              <Building2 size={15} />
              Apartment
            </div>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Register Apartment
            </h2>

            <p className="mt-2 text-slate-500">
              Add a new apartment to your AquaTrack workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl p-3 transition hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}

        <form onSubmit={onSubmit} className="p-8">
          <div className="space-y-6">

            {/* Apartment Name */}

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Building2 size={16} className="text-teal-700" />
                Apartment Name
              </label>

              <input
                id="apartmentName"
                name="apartmentName"
                type="text"
                value={form.apartmentName}
                onChange={onChange}
                placeholder="Example: Green Valley Apartments"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                This will be displayed throughout the AquaTrack dashboard.
              </p>
            </div>

            {/* Address */}

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <MapPin size={16} className="text-teal-700" />
                Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={onChange}
                placeholder="Example: Sector-62, Noida"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Enter the complete address of the apartment complex.
              </p>
            </div>

          </div>

          {/* Footer */}

          <div className="mt-10 flex justify-end gap-4 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-teal-700 px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />

              {isSubmitting
                ? "Registering..."
                : "Register Apartment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}