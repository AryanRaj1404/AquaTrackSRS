import {
    Plus,
    Upload,
} from "lucide-react";

import { useTranslation } from "react-i18next";

function WaterUsageActions({

    billingCycles,

    selectedBillingCycle,

    setSelectedBillingCycle,

    handleCsvUpload,

    openAddModal,

}) {

    const { t } = useTranslation();

    return (

        <div className="flex flex-wrap items-center gap-3">

            <select
                value={selectedBillingCycle}
                onChange={(e) =>
                    setSelectedBillingCycle(e.target.value)
                }
                className="
                    min-w-60
                    appearance-none
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-3
                    pr-12
                    text-sm
                    font-medium
                    text-slate-700
                    shadow-sm
                    transition-all
                    duration-300
                    outline-none
                    hover:border-cyan-300
                    hover:shadow-md
                    focus:border-cyan-500
                    focus:ring-4
                    focus:ring-cyan-100
                    focus:shadow-lg
                    disabled:cursor-not-allowed
                    disabled:bg-slate-100
                    disabled:text-slate-400
                "
            >

                <option value="">

                    {t("waterUsage.actions.allBillingCycles")}

                </option>

                {billingCycles.map((cycle) => (

                    <option
                        key={cycle.id}
                        value={cycle.id}
                    >

                        {cycle.apartmentName}
                        {" • "}
                        {new Date(
                            cycle.startDate
                        ).toLocaleString(
                            "en-US",
                            {
                                month: "long",
                                year: "numeric",
                            }
                        )}

                    </option>

                ))}

            </select>

            <button
                type="button"
                onClick={() =>
                    document
                        .getElementById("csvUpload")
                        .click()
                }
                className="
                    inline-flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-teal-900
                    bg-linear-to-r
                    from-emerald-50
                    to-cyan-50
                    px-5
                    py-2
                    text-sm
                    font-semibold
                    text-teal-700
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-teal-300
                    hover:from-teal-600
                    hover:to-cyan-200
                    hover:shadow-lg
                    active:scale-[0.98]
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-teal-700
                            text-white
                            shadow-md
                        "
                    >
                        <Upload size={18} />
                    </div>

                    <div className="flex flex-col items-start leading-tight">

                        <span>
                            {t("waterUsage.actions.uploadCsv")}
                        </span>

                        

                    </div>

                </button>

            <button
                type="button"
                className="mg-primary-button flex items-center gap-2"
                onClick={openAddModal}
            >

                <Plus size={18} />

                {t("waterUsage.actions.addReading")}

            </button>

            <input
                id="csvUpload"
                hidden
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
            />

        </div>

    );

}

export default WaterUsageActions;