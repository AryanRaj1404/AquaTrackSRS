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

        <div className="mg-modal-overlay">

            <div className="mg-modal">

                <div className="mg-toolbar">

                    <div>

                        <h2>

                            {editingId
                                ? t("waterUsage.modal.editTitle")
                                : t("waterUsage.modal.addTitle")}

                        </h2>

                        <p>

                            {t("waterUsage.modal.desc")}

                        </p>

                    </div>

                    <button
                        type="button"
                        className="mg-cancel-button"
                        onClick={closeModal}
                    >

                        <X size={16} />

                        {t("waterUsage.modal.close")}

                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="mg-form-grid">

                        <div className="mg-form-group">

                            <label>

                                {t("waterUsage.modal.billingCycle")}

                            </label>

                            <select
                                name="billingCycleId"
                                value={form.billingCycleId}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
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

                                {t("waterUsage.modal.household")}

                            </label>

                            <select
                                name="householdId"
                                value={form.householdId}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
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

                        <div className="mg-form-group">

                            <label>

                                {t("waterUsage.modal.usageDate")}

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

                                {t("waterUsage.modal.litersConsumed")}

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

                            {t("waterUsage.modal.cancel")}

                        </button>

                        <button
                            type="submit"
                            className="mg-primary-button"
                            disabled={isSubmitting}
                        >

                            <Save size={16} />

                            {isSubmitting
                                ? t("waterUsage.modal.saving")
                                : editingId
                                ? t("waterUsage.modal.updateReading")
                                : t("waterUsage.modal.saveReading")}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default WaterUsageFormModal;