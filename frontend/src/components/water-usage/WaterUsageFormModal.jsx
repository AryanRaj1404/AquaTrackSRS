import {
    Droplet,
    Calendar,
    Home,
    Save,
    X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

function WaterUsageFormModal({

    showModal,

    editingId,

    form,

    billingCycles,

    households,

    handleInputChange,

    handleSubmit,

    closeModal,

    isSubmitting,

}) {

    const { t } = useTranslation();

    if (!showModal) {

        return null;

    }

    return (

<div
    className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-950/50
        backdrop-blur-sm
        p-6
        animate-in
        fade-in
    "
>

    <div
        className="
            relative
            w-full
            max-w-3xl
            max-h-[90vh]
            overflow-y-auto
            rounded-3xl
            border
            border-slate-100
            bg-white
            shadow-[0_30px_80px_rgba(15,23,42,.25)]
        "
    >

        {/* ================= HEADER ================= */}

        <div
            className="
                sticky
                top-0
                z-10
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-slate-100
                bg-white
                px-8
                py-6
            "
        >

            <div className="flex items-center gap-4">

                <div
                    className="
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-teal-700
                        text-white
                        shadow-sm
                    "
                >

                    <Droplet size={26} />

                </div>

                <div>

                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">

                        {editingId
                            ? t("waterUsage.modal.editTitle")
                            : t("waterUsage.modal.addTitle")}

                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                        {t("waterUsage.modal.desc")}

                    </p>

                </div>

            </div>

            <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="
                    rounded-xl
                    border
                    border-slate-200
                    p-2.5
                    text-slate-500
                    transition-colors
                    hover:bg-slate-50
                    hover:text-slate-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            >

                <X size={18} />

            </button>

        </div>

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit} className="p-8">

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* Billing Cycle */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                    "
                >

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">

                        {t("waterUsage.modal.billingCycle")}

                    </label>

                    <select
                        name="billingCycleId"
                        value={form.billingCycleId}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            text-slate-700
                            outline-none
                            transition-all
                            focus:border-teal-500
                            focus:ring-4
                            focus:ring-teal-50
                        "
                    >

                        <option value="">

                            {t("waterUsage.modal.selectBillingCycle")}

                        </option>

                        {billingCycles.map((cycle) => (

                            <option
                                key={cycle.id}
                                value={cycle.id}
                            >

                                {cycle.apartmentName} •{" "}

                                {new Date(cycle.startDate).toLocaleString(
                                    "en-US",
                                    {
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}

                            </option>

                        ))}

                    </select>

                </div>

                {/* Household */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                    "
                >

                    <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">

                        <Home size={12} />

                        {t("waterUsage.modal.household")}

                    </label>

                    <select
                        name="householdId"
                        value={form.householdId}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            text-slate-700
                            outline-none
                            transition-all
                            focus:border-teal-500
                            focus:ring-4
                            focus:ring-teal-50
                        "
                    >

                        <option value="">

                            {t("waterUsage.modal.selectHousehold")}

                        </option>

                        {households.map((household) => (

                            <option
                                key={household.id}
                                value={household.id}
                            >

                                {household.apartmentName}

                                {" - "}

                                {household.flatNumber}

                            </option>

                        ))}

                    </select>

                </div>

                {/* Usage Date */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                    "
                >

                    <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">

                        <Calendar size={12} />

                        {t("waterUsage.modal.usageDate")}

                    </label>

                    <input
                        type="date"
                        name="usageDate"
                        value={form.usageDate}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            text-slate-700
                            outline-none
                            transition-all
                            focus:border-teal-500
                            focus:ring-4
                            focus:ring-teal-50
                        "
                    />

                </div>

                {/* Liters */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                    "
                >

                    <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">

                        <Droplet size={12} />

                        {t("waterUsage.modal.litersConsumed")}

                    </label>

                    <div className="relative">

                        <input
                            type="number"
                            name="litersConsumed"
                            value={form.litersConsumed}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            placeholder="550"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2.5
                                pr-16
                                text-sm
                                text-slate-700
                                outline-none
                                transition-all
                                focus:border-teal-500
                                focus:ring-4
                                focus:ring-teal-50
                            "
                        />

                        <span
                            className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-400
                            "
                        >

                            Litres

                        </span>

                    </div>

                </div>

            </div>

            {/* Footer */}

            <div
                className="
                    mt-8
                    flex
                    flex-col-reverse
                    items-stretch
                    justify-between
                    gap-3
                    border-t
                    border-slate-100
                    pt-6
                    sm:flex-row
                    sm:items-center
                "
            >

                <p className="text-sm text-slate-500">

                    {t("waterUsage.modal.footerDesc")}

                </p>

                

                <div className="flex items-center gap-0.5 sm:gap-3">

                    <button
                        type="button"
                        onClick={closeModal}
                        disabled={isSubmitting}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-slate-700
                            transition-colors
                            hover:bg-slate-50
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        <X size={16} />

                        {t("waterUsage.modal.cancel")}

                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-teal-700
                            px-6
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition-colors
                            hover:bg-teal-800
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        <Save size={16} />

                        {isSubmitting
                            ? t("waterUsage.modal.saving")
                            : editingId
                            ? t("waterUsage.modal.updateReading")
                            : t("waterUsage.modal.saveReading")}

                    </button>

                </div>

            </div>

        </form>

    </div>

</div>

    );

}

export default WaterUsageFormModal;