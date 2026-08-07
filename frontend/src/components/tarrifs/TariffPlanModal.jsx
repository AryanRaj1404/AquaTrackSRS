import {
  Plus,
  Save,
  Trash2,
  X,
  BadgeDollarSign,
} from "lucide-react";

import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TariffPlanModal({

  open,

  editingId,

  form,

  setForm,

  isSubmitting,

  onSubmit,

  onCancel,

}) {

  const { t } = useTranslation();

  if (!open) return null;

  const stringToDate = (value) =>
    value ? new Date(value) : null;

    const dateToString = (date) => {
        if (!date) return "";

        return date.toISOString().split("T")[0];
    };

  const handleChange = (event) => {

    const { name, value } = event.target;

    setForm((previous) => ({

      ...previous,

      [name]: value,

    }));

  };

  const handleTierChange = (

    index,

    field,

    value

  ) => {

    setForm((previous) => {

      const tiers = [...previous.tiers];

      tiers[index] = {

        ...tiers[index],

        [field]: value,

      };

      return {

        ...previous,

        tiers,

      };

    });

  };

  const addTier = () => {

    setForm((previous) => ({

      ...previous,

      tiers: [

        ...previous.tiers,

        {

          tierOrder:

            previous.tiers.length + 1,

          uptoKl: "",

          ratePerKl: "",

        },

      ],

    }));

  };

  const removeTier = (index) => {

    setForm((previous) => ({

      ...previous,

      tiers: previous.tiers

        .filter((_, i) => i !== index)

        .map((tier, i) => ({

          ...tier,

          tierOrder: i + 1,

        })),

    }));

  };

  return (

    <div

      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-md p-6"

      onClick={onCancel}

    >

      <div

        onClick={(e) => e.stopPropagation()}

        className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[30px] bg-white shadow-[0_40px_90px_rgba(15,23,42,0.22)]"

      >

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-8 py-6">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-teal-600 text-white shadow-lg">

              <BadgeDollarSign size={28} />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-900">

                {editingId

                  ? t("tariffPlans.form.updateTitle")

                  : t("tariffPlans.form.registerTitle")}

              </h2>

              <p className="mt-1 text-sm text-slate-500">

                {t("tariffPlans.form.desc")}

              </p>

            </div>

          </div>

          <button

            onClick={onCancel}

            disabled={isSubmitting}

            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"

          >

            <X size={20} />

          </button>

        </div>

        {/* BODY */}

        <form onSubmit={onSubmit}>

          <div className="max-h-[68vh] overflow-y-auto px-8 py-7">

            {/* BASIC DETAILS */}

            <div className="grid grid-cols-2 gap-6">

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  {t("tariffPlans.form.planName")}

                </label>

                <input

                  name="planName"

                  value={form.planName}

                  onChange={handleChange}

                  disabled={isSubmitting}

                  placeholder="Residential Plan"

                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"

                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  {t("tariffPlans.form.fixedCharge")}

                </label>

                <input

                  type="number"

                  step="0.01"

                  name="fixedCharge"

                  value={form.fixedCharge}

                  placeholder="Amount in ₹"

                  onChange={handleChange}

                  disabled={isSubmitting}

                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"

                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  {t("tariffPlans.form.effectiveFrom")}

                </label>

                <DatePicker
                    selected={stringToDate(form.effectiveFrom)}
                    onChange={(date) =>
                        setForm((previous) => ({
                            ...previous,
                            effectiveFrom: dateToString(date),
                        }))
                    }
                    dateFormat="dd MMM yyyy"
                    placeholderText="Select date"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  {t("tariffPlans.form.effectiveTo")}

                </label>

                <DatePicker
                    selected={stringToDate(form.effectiveTo)}
                    onChange={(date) =>
                        setForm((previous) => ({
                            ...previous,
                            effectiveTo: dateToString(date),
                        }))
                    }
                    dateFormat="dd MMM yyyy"
                    placeholderText="Select date"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />

              </div>

              <div className="col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  {t("tariffPlans.form.description")}

                </label>

                <textarea

                  rows={4}

                  name="description"

                  value={form.description}

                  onChange={handleChange}

                  disabled={isSubmitting}

                  placeholder={t(

                    "tariffPlans.form.descriptionPlaceholder"

                  )}

                  className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"

                />

              </div>

            </div>

            {/* TIERS HEADER */}

            <div className="mt-10 mb-5 flex items-center justify-between">

              <div>

                <h3 className="text-lg font-bold text-slate-900">

                  {t("tariffPlans.form.tariffTiers")}

                </h3>

              </div>

              <button

                type="button"

                onClick={addTier}

                disabled={isSubmitting}

                className="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"

              >

                <Plus size={16} />

                {t("tariffPlans.form.addTier")}

              </button>

            </div>
                        {/* Tier Cards */}

            <div className="space-y-4">

              {form.tiers.map((tier, index) => (

                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-linear-to-r from-slate-50 to-white p-5 transition hover:border-cyan-300 hover:shadow-md"
                >

                  <div className="mb-5 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-sm font-bold text-cyan-700">

                        {index + 1}

                      </div>

                      <span className="font-semibold text-slate-700">

                        Tier {index + 1}

                      </span>

                    </div>

                    {form.tiers.length > 1 && (

                      <button
                        type="button"
                        onClick={() => removeTier(index)}
                        className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                      >

                        <Trash2 size={17} />

                      </button>

                    )}

                  </div>

                  <div className="grid grid-cols-2 gap-5">

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">

                        {t("tariffPlans.form.uptoKl")}

                      </label>

                      <input
                        type="number"
                        step="0.01"
                        value={tier.uptoKl}
                        onChange={(e) =>
                          handleTierChange(
                            index,
                            "uptoKl",
                            e.target.value
                          )
                        }
                        placeholder={t(
                          "tariffPlans.form.uptoKlPlaceholder"
                        )}
                        disabled={isSubmitting}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">

                        {t("tariffPlans.form.ratePerKl")}

                      </label>

                      <input
                        type="number"
                        step="0.01"
                        value={tier.ratePerKl}
                        onChange={(e) =>
                          handleTierChange(
                            index,
                            "ratePerKl",
                            e.target.value
                          )
                        }
                        disabled={isSubmitting}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      />

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Footer */}

          <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-8 py-5">

            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 transition hover:bg-slate-100"
            >

              <X size={16} className="inline mr-2" />

              {t("tariffPlans.form.cancel")}

            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-cyan-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-cyan-300/40 active:scale-95 disabled:opacity-60"
            >

              {isSubmitting ? (

                <>

                  <Save size={18} />

                  {editingId
                    ? t("tariffPlans.form.updating")
                    : t("tariffPlans.form.saving")}

                </>

              ) : (

                <>

                  <Save size={18} />

                  {editingId
                    ? t("tariffPlans.form.updateTitle")
                    : t("tariffPlans.form.savePlan")}

                </>

              )}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}