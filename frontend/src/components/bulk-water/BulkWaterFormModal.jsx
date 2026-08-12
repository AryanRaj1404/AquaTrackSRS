import {
    Save,
    X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

function BulkWaterFormModal({

    showModal,

    editingPurchase,

    form,

    apartments,

    filteredBillingCycles,

    setForm,

    handleChange,

    handleSubmit,

    closeModal,

}) {

    const { t } = useTranslation();

    if (!showModal) {

        return null;

    }

    const handleApartmentChange = (event) => {

        const { value } = event.target;

        setForm((previous) => ({
            ...previous,
            apartmentId: value,
            billingCycleId: "",
        }));

    };

    return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">

      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {editingPurchase
              ? t("bulkWaterPurchases.modal.editTitle")
              : t("bulkWaterPurchases.modal.addTitle")}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t("bulkWaterPurchases.modal.desc")}
          </p>
        </div>

        <button
          type="button"
          onClick={closeModal}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-h-[65vh] overflow-y-auto px-6 py-6">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Apartment */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t("bulkWaterPurchases.modal.apartment")}
              </label>

              <select
                name="apartmentId"
                value={form.apartmentId}
                onChange={handleApartmentChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
              >
                <option value="">
                  {t("bulkWaterPurchases.modal.selectApartment")}
                </option>

                {apartments.map((apartment) => (
                  <option key={apartment.id} value={apartment.id}>
                    {apartment.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Billing Cycle */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t("bulkWaterPurchases.modal.billingCycle")}
              </label>

              <select
                name="billingCycleId"
                value={form.billingCycleId}
                onChange={handleChange}
                disabled={!form.apartmentId}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">
                  {form.apartmentId
                    ? t("bulkWaterPurchases.modal.selectBillingCycle")
                    : t("bulkWaterPurchases.modal.selectApartmentFirst")}
                </option>

                {filteredBillingCycles.map((cycle) => (
                  <option key={cycle.id} value={cycle.id}>
                    {new Date(cycle.startDate).toLocaleString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </option>
                ))}
              </select>
            </div>

            {/* Purchase Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t("bulkWaterPurchases.modal.purchaseDate")}
              </label>

              <input
                type="date"
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
              />
            </div>

            {/* Source */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t("bulkWaterPurchases.modal.source")}
              </label>

              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
              >
                <option value="TANKER">
                  {t("bulkWaterPurchases.table.tanker")}
                </option>

                <option value="MUNICIPAL">
                  {t("bulkWaterPurchases.table.municipal")}
                </option>
              </select>
            </div>

            {/* Volume */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t("bulkWaterPurchases.modal.volume")}
              </label>

              <input
                type="number"
                name="volumeKl"
                value={form.volumeKl}
                onChange={handleChange}
                placeholder="10"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
              />
            </div>

            {/* Unit Cost */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t("bulkWaterPurchases.modal.unitCost")}
              </label>

              <input
                type="number"
                name="unitCost"
                value={form.unitCost}
                onChange={handleChange}
                placeholder="1.50"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
              />
            </div>

            {/* Supplier */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t("bulkWaterPurchases.modal.supplier")}
              </label>

              <input
                type="text"
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                placeholder="Supplier name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-50 to-sky-50 border border-cyan-100 p-5">
            <p className="text-sm text-slate-500">
              Total Purchase Cost
            </p>

            <h3 className="mt-2 text-3xl font-bold text-cyan-700">
              ₹
              {(
                (Number(form.volumeKl || 0) *
                  Number(form.unitCost || 0))
              ).toLocaleString("en-IN")}
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              {form.volumeKl || 0} KL × ₹{form.unitCost || 0}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {t("bulkWaterPurchases.modal.cancel")}
          </button>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-cyan-700"
          >
            <Save size={18} />

            {editingPurchase
              ? t("bulkWaterPurchases.modal.updatePurchase")
              : t("bulkWaterPurchases.modal.savePurchase")}
          </button>
        </div>
      </form>
    </div>
  </div>
);

}

export default BulkWaterFormModal;
