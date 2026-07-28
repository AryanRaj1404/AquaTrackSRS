import {
    Save,
    X,
} from "lucide-react";

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

    if (!showModal) {

        return null;

    }

    return (

        <div className="mg-modal-overlay">

            <div className="mg-modal">

                <div className="mg-toolbar">

                    <div>

                        <h2>

                            {editingId
                                ? "Edit Reading"
                                : "Add Reading"}

                        </h2>

                        <p>

                            Record household water consumption.

                        </p>

                    </div>

                    <button
                        type="button"
                        className="mg-cancel-button"
                        onClick={closeModal}
                    >

                        <X size={16} />

                        Close

                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="mg-form-grid">

                        <div className="mg-form-group">

                            <label>

                                Billing Cycle

                            </label>

                            <select
                                name="billingCycleId"
                                value={form.billingCycleId}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            >

                                <option value="">

                                    Select Billing Cycle

                                </option>

                                {billingCycles.map((cycle) => (

                                    <option
                                        key={cycle.id}
                                        value={cycle.id}
                                    >

                                        {cycle.apartmentName} •{" "}

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

                        </div>

                        <div className="mg-form-group">

                            <label>

                                Household

                            </label>

                            <select
                                name="householdId"
                                value={form.householdId}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            >

                                <option value="">

                                    Select Household

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

                        <div className="mg-form-group">

                            <label>

                                Usage Date

                            </label>

                            <input
                                type="date"
                                name="usageDate"
                                value={form.usageDate}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />

                        </div>

                        <div className="mg-form-group">

                            <label>

                                Liters Consumed

                            </label>

                            <input
                                type="number"
                                name="litersConsumed"
                                value={form.litersConsumed}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                placeholder="550"
                            />

                        </div>

                    </div>

                    <div className="mg-modal-actions">

                        <button
                            type="button"
                            className="mg-cancel-button"
                            onClick={closeModal}
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            className="mg-primary-button"
                            disabled={isSubmitting}
                        >

                            <Save size={16} />

                            {isSubmitting
                                ? "Saving..."
                                : editingId
                                ? "Update Reading"
                                : "Save Reading"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default WaterUsageFormModal;