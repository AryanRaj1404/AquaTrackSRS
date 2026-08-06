import { Save, UserPlus, Users, X } from "lucide-react";

export default function AssignResidentModal({
  showAssignModal,
  selectedHousehold,
  availableResidents,
  selectedResident,
  onResidentChange,
  onAssign,
  onClose,
  isAssigning,
}) {
  if (!showAssignModal) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
      >
        {/* Header */}

        <div className="flex items-start justify-between border-b border-slate-100 px-8 py-7">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-semibold uppercase tracking-[0.25em]">
              <Users size={15} />
              Residents
            </div>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Assign Resident
            </h2>

            <p className="mt-2 text-slate-500">
              Assign a resident to{" "}
              <span className="font-semibold text-slate-700">
                Flat {selectedHousehold?.flatNumber}
              </span>.
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

        <div className="p-8">

          {/* Household Card */}

          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold">
              Household
            </p>

            <h3 className="mt-2 text-xl font-bold text-slate-900">
              Flat {selectedHousehold?.flatNumber}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Choose an available resident to assign.
            </p>
          </div>

          {/* Resident Dropdown */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Available Residents
            </label>

            <select
              value={selectedResident}
              onChange={(e) => onResidentChange(e.target.value)}
              disabled={
                availableResidents.length === 0 ||
                isAssigning
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            >
              {availableResidents.length === 0 ? (
                <option value="">
                  No unassigned residents available
                </option>
              ) : (
                <>
                  <option value="">
                    Choose Resident
                  </option>

                  {availableResidents.map((resident) => (
                    <option
                      key={resident.id}
                      value={resident.id}
                    >
                      {resident.fullName} ({resident.username})
                    </option>
                  ))}
                </>
              )}
            </select>

            {availableResidents.length === 0 && (
              <p className="mt-2 text-sm text-amber-600">
                Every resident is already assigned to a household.
              </p>
            )}
          </div>

          {/* Footer */}

          <div className="mt-10 flex justify-end gap-4 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isAssigning}
              className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onAssign}
              disabled={
                !selectedResident ||
                isAssigning ||
                availableResidents.length === 0
              }
              className="flex items-center gap-2 rounded-xl bg-teal-700 px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserPlus size={18} />

              {isAssigning
                ? "Assigning..."
                : "Assign Resident"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}