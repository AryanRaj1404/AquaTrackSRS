import { Save, X, Building2, Home } from "lucide-react";

function AddHouseholdModal({
  showForm,
  handleCancel,
  handleSubmit,
  handleChange,
  form,
  apartments,
  isSubmitting,
  workspaceId,
}) {
  if (!showForm) return null;

  const workspaceApartment = apartments.find(
    (a) => Number(a.id) === Number(workspaceId)
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6"
      onClick={handleCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-[fadeIn_.2s_ease]"
      >
        {/* Header */}

        <div className="flex items-start justify-between border-b border-slate-100 px-8 py-7">
          <div>
            <div className="flex items-center gap-2 text-teal-700 font-semibold uppercase tracking-[0.25em] text-xs">
              <Home size={15} />
              Household
            </div>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Add Household
            </h2>

            <p className="mt-2 text-slate-500">
              Create a new household inside your apartment workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl p-3 transition hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Flat Number */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Flat Number
              </label>

              <input
                name="flatNumber"
                value={form.flatNumber}
                onChange={handleChange}
                placeholder="Example: A-101"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            {/* Flat Size */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Flat Size (sq.ft)
              </label>

              <input
                name="flatSize"
                type="number"
                value={form.flatSize}
                onChange={handleChange}
                placeholder="Example: 1200"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            {/* Occupancy */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Occupancy
              </label>

              <input
                name="occupancy"
                type="number"
                min="1"
                value={form.occupancy}
                onChange={handleChange}
                placeholder="Example: 4"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            {/* Apartment */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Apartment
              </label>

              {workspaceId ? (
                <>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Building2
                        size={18}
                        className="text-teal-700"
                      />

                      <span className="font-medium text-slate-700">
                        {workspaceApartment?.name}
                      </span>
                    </div>

                    <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                      Workspace
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Apartment is automatically selected from the active
                    workspace.
                  </p>
                </>
              ) : (
                <select
                  name="apartmentId"
                  value={form.apartmentId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                >
                  <option value="">
                    Select Apartment
                  </option>

                  {apartments.map((apartment) => (
                    <option
                      key={apartment.id}
                      value={apartment.id}
                    >
                      {apartment.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Footer */}

          <div className="mt-10 flex justify-end gap-4 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-teal-700 px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-teal-800"
            >
              <Save size={18} />

              {isSubmitting
                ? "Creating..."
                : "Create Household"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddHouseholdModal;