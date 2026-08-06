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

        <div className="mg-modal-overlay">

            <div className="mg-modal">

                <div className="mg-toolbar">

                    <div>

                        <h2>

                            {editingPurchase
                                ? t("bulkWaterPurchases.modal.editTitle")
                                : t("bulkWaterPurchases.modal.addTitle")}

                        </h2>

                        <p>

                            {t("bulkWaterPurchases.modal.desc")}

                        </p>

                    </div>

                    <button
                        type="button"
                        className="mg-cancel-button"
                        onClick={closeModal}
                    >

                        <X size={16} />

                        {t("bulkWaterPurchases.modal.close")}

                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="mg-form-grid">

                        <div className="mg-form-group">

                            <label>

                                {t("bulkWaterPurchases.modal.apartment")}

                            </label>

                            <select
                                name="apartmentId"
                                value={form.apartmentId}
                                onChange={handleApartmentChange}
                            >

                                <option value="">

                                    {t("bulkWaterPurchases.modal.selectApartment")}

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

                        </div>

                        <div className="mg-form-group">

                            <label>

                                {t("bulkWaterPurchases.modal.billingCycle")}

                            </label>

                            <select
                                name="billingCycleId"
                                value={form.billingCycleId}
                                onChange={handleChange}
                                disabled={!form.apartmentId}
                            >

                                <option value="">

                                    {form.apartmentId
                                        ? t("bulkWaterPurchases.modal.selectBillingCycle")
                                        : t("bulkWaterPurchases.modal.selectApartmentFirst")}

                                </option>

                                {filteredBillingCycles.map((cycle) => (

                                    <option
                                        key={cycle.id}
                                        value={cycle.id}
                                    >

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

                                {t("bulkWaterPurchases.modal.purchaseDate")}

                            </label>

                            <input
                                type="date"
                                name="purchaseDate"
                                value={form.purchaseDate}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="mg-form-group">

                            <label>

                                {t("bulkWaterPurchases.modal.source")}

                            </label>

                            <select
                                name="source"
                                value={form.source}
                                onChange={handleChange}
                            >

                                <option value="TANKER">

                                    {t("bulkWaterPurchases.table.tanker")}

                                </option>

                                <option value="MUNICIPAL">

                                    {t("bulkWaterPurchases.table.municipal")}

                                </option>

                            </select>

                        </div>

                        <div className="mg-form-group">

                            <label>

                                {t("bulkWaterPurchases.modal.volume")}

                            </label>

                            <input
                                type="number"
                                name="volumeKl"
                                value={form.volumeKl}
                                onChange={handleChange}
                                placeholder="10"
                            />

                        </div>

                        <div className="mg-form-group">

                            <label>

                                {t("bulkWaterPurchases.modal.unitCost")}

                            </label>

                            <input
                                type="number"
                                name="unitCost"
                                value={form.unitCost}
                                onChange={handleChange}
                                placeholder="1.50"
                            />

                        </div>

                        <div className="mg-form-group">

                            <label>

                                {t("bulkWaterPurchases.modal.supplier")}

                            </label>

                            <input
                                type="text"
                                name="supplier"
                                value={form.supplier}
                                onChange={handleChange}
                                placeholder="Supplier name"
                            />

                        </div>

                    </div>

                    <div className="mg-modal-actions">

                        <button
                            type="button"
                            className="mg-cancel-button"
                            onClick={closeModal}
                        >

                            {t("bulkWaterPurchases.modal.cancel")}

                        </button>

                        <button
                            type="submit"
                            className="mg-primary-button"
                        >

                            <Save size={16} />

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
