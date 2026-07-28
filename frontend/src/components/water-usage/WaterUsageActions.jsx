import {
    Plus,
    Upload,
} from "lucide-react";

function WaterUsageActions({

    billingCycles,

    selectedBillingCycle,

    setSelectedBillingCycle,

    handleCsvUpload,

    openAddModal,

}) {

    return (

        <div className="flex flex-wrap items-center gap-3">

            <select
                className="mg-select min-w-[220px]"
                value={selectedBillingCycle}
                onChange={(e) =>
                    setSelectedBillingCycle(
                        e.target.value
                    )
                }
            >

                <option value="">

                    All Billing Cycles

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
                className="mg-secondary-button flex items-center gap-2"
                onClick={() =>
                    document
                        .getElementById("csvUpload")
                        .click()
                }
            >

                <Upload size={18} />

                Upload CSV

            </button>

            <button
                type="button"
                className="mg-primary-button flex items-center gap-2"
                onClick={openAddModal}
            >

                <Plus size={18} />

                Add Reading

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