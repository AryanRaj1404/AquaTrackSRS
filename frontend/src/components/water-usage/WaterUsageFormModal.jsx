import {
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
        backdrop-blur-lg
        p-6
        animate-in
        fade-in
    "
>

    <div
        className="
            relative
            w-full
            max-w-4xl
            overflow-hidden
            rounded-4xl
            bg-white
            shadow-[0_30px_80px_rgba(15,23,42,.25)]
        "
    >

        {/* Decorative Background */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

            <div
                className="
                    absolute
                    -right-24
                    -top-24
                    h-80
                    w-80
                    rounded-full
                    bg-cyan-400/15
                    blur-3xl
                "
            />

            <div
                className="
                    absolute
                    -bottom-20
                    -left-16
                    h-72
                    w-72
                    rounded-full
                    bg-teal-400/10
                    blur-3xl
                "
            />

        </div>

        {/* ================= HEADER ================= */}

        <div
            className="
                relative
                overflow-hidden
                bg-linear-to-r
                from-cyan-600
                via-sky-600
                to-teal-600
                px-8
                py-8
                text-white
            "
        >

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-5">

                    <div
                        className="
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-white/15
                            backdrop-blur-md
                            ring-1
                            ring-white/20
                        "
                    >

                        <Save size={30} />

                    </div>

                    <div>

                        <div className="flex items-center gap-3">

                            <h2 className="text-3xl font-bold tracking-tight">

                                {editingId
                                    ? t("waterUsage.modal.editTitle")
                                    : t("waterUsage.modal.addTitle")}

                            </h2>

                            <span
                                className="
                                    rounded-full
                                    bg-white/15
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                "
                            >

                                Water Usage

                            </span>

                        </div>

                        <p className="mt-2 text-cyan-100">

                            {t("waterUsage.modal.desc")}

                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    onClick={closeModal}
                    className="
                        rounded-2xl
                        bg-white/10
                        p-3
                        transition-all
                        duration-300
                        hover:bg-white/20
                        hover:rotate-90
                    "
                >

                    <X size={20} />

                </button>

            </div>

            {/* Quick Summary */}

            <div className="mt-8 flex flex-wrap gap-4">

                <div
                    className="
                        rounded-2xl
                        bg-white/12
                        px-5
                        py-3
                        backdrop-blur
                    "
                >

                    <p className="text-xs uppercase tracking-widest text-cyan-100">

                        Mode

                    </p>

                    <h3 className="mt-1 text-xl font-bold">

                        {editingId ? "Editing" : "New Entry"}

                    </h3>

                </div>

                <div
                    className="
                        rounded-2xl
                        bg-white/12
                        px-5
                        py-3
                        backdrop-blur
                    "
                >

                    <p className="text-xs uppercase tracking-widest text-cyan-100">

                        Household

                    </p>

                    <h3 className="mt-1 text-xl font-bold">

                        {form.householdId || "--"}

                    </h3>

                </div>

                <div
                    className="
                        rounded-2xl
                        bg-white/12
                        px-5
                        py-3
                        backdrop-blur
                    "
                >

                    <p className="text-xs uppercase tracking-widest text-cyan-100">

                        Usage

                    </p>

                    <h3 className="mt-1 text-xl font-bold">

                        {form.litersConsumed || 0} L

                    </h3>

                </div>

            </div>

        </div>

        {/* ================= FORM ================= */}

        <form
            onSubmit={handleSubmit}
            className="relative p-8"
        >

            <div className="grid grid-cols-2 gap-7">

                        {/* Billing Cycle */}

<div
    className="
        rounded-3xl
        border
        border-slate-200
        bg-linear-to-br
        from-white
        to-slate-50
        p-6
    "
>

    <label className="mb-3 block text-sm font-semibold text-slate-700">

        {t("waterUsage.modal.billingCycle")}

    </label>

    <select
        name="billingCycleId"
        value={form.billingCycleId}
        onChange={handleInputChange}
        disabled={isSubmitting}
        className="
            w-full
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            outline-none
            transition-all
            focus:border-cyan-500
            focus:ring-4
            focus:ring-cyan-100
        "
    >

        <option value="">

            {t("waterUsage.modal.selectBillingCycle")}

        </option>

        {billingCycles.map((cycle)=>(

            <option
                key={cycle.id}
                value={cycle.id}
            >

                {cycle.apartmentName} •{" "}

                {new Date(cycle.startDate).toLocaleString(
                    "en-US",
                    {
                        month:"long",
                        year:"numeric",
                    }
                )}

            </option>

        ))}

    </select>

</div>

{/* Household */}

<div
    className="
        rounded-3xl
        border
        border-slate-200
        bg-linear-to-br
        from-white
        to-slate-50
        p-6
    "
>

    <label className="mb-3 block text-sm font-semibold text-slate-700">

        {t("waterUsage.modal.household")}

    </label>

    <select
        name="householdId"
        value={form.householdId}
        onChange={handleInputChange}
        disabled={isSubmitting}
        className="
            w-full
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            outline-none
            transition-all
            focus:border-cyan-500
            focus:ring-4
            focus:ring-cyan-100
        "
    >

        <option value="">

            {t("waterUsage.modal.selectHousehold")}

        </option>

        {households.map((household)=>(

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
        rounded-3xl
        border
        border-slate-200
        bg-linear-to-br
        from-white
        to-slate-50
        p-6
    "
>

    <label className="mb-3 block text-sm font-semibold text-slate-700">

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
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            outline-none
            transition-all
            focus:border-cyan-500
            focus:ring-4
            focus:ring-cyan-100
        "
    />

</div>

{/* Liters */}

<div
    className="
        rounded-3xl
        border
        border-slate-200
        bg-linear-to-br
        from-white
        to-slate-50
        p-6
    "
>

    <label className="mb-3 block text-sm font-semibold text-slate-700">

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
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                pr-16
                outline-none
                transition-all
                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-100
            "
        />

        <span
            className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                text-sm
                font-semibold
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
        mt-10
        flex
        items-center
        justify-between
        rounded-t-[28px]
        border-t
        border-slate-200
        bg-linear-to-r
        from-slate-50
        via-white
        to-cyan-50
        px-8
        py-6
    "
>

    <div>

        <p className="text-sm font-semibold text-slate-700">

            {editingId
                ? "Editing water usage record"
                : "New water usage record"}

        </p>

        <p className="mt-1 text-xs text-slate-500">

            Review the information before saving.

        </p>

    </div>

    <div className="flex items-center gap-4">

        <button
            type="button"
            onClick={closeModal}
            disabled={isSubmitting}
            className="
                rounded-2xl
                border
                border-slate-300
                bg-white
                px-6
                py-3
                font-medium
                text-slate-700
                transition-all
                hover:border-slate-400
                hover:bg-slate-100
            "
        >

            <span className="flex items-center gap-2">

                <X size={18} />

                {t("waterUsage.modal.cancel")}

            </span>

        </button>

        <button
            type="submit"
            disabled={isSubmitting}
            className="
                rounded-2xl
                bg-linear-to-r
                from-cyan-600
                via-sky-600
                to-teal-600
                px-7
                py-3
                font-semibold
                text-white
                shadow-lg
                shadow-cyan-500/30
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-xl
                hover:shadow-cyan-500/40
                disabled:cursor-not-allowed
                disabled:opacity-60
            "
        >

            <span className="flex items-center gap-2">

                <Save size={18} />

                {isSubmitting
                    ? t("waterUsage.modal.saving")
                    : editingId
                    ? t("waterUsage.modal.updateReading")
                    : t("waterUsage.modal.saveReading")}

            </span>

        </button>

    </div>

</div>

</form>

</div>

</div>

    );

}

export default WaterUsageFormModal;