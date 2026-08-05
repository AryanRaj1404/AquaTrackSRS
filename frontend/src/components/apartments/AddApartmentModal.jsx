import { Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AddApartmentModal({

    showForm,

    form,

    onChange,

    onSubmit,

    onCancel,

    isSubmitting,

}) {

    const { t } = useTranslation();

    if (!showForm) {
        return null;
    }

    return (

        <section
            className="mg-panel"
            style={{ marginBottom: "20px" }}
        >

            <div className="mg-toolbar">

                <div>

                    <h2>{t("apartments.registerApartment")}</h2>

                    <p>
                        {t("apartments.enterDetails")}
                    </p>

                </div>

                <button
                    type="button"
                    className="mg-cancel-button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >

                    <X size={16} />

                    {t("apartments.close")}

                </button>

            </div>

            <form onSubmit={onSubmit}>

                <div className="mg-form-grid">

                    <div className="mg-form-group mg-form-group-full">

                        <label htmlFor="apartmentName">

                            {t("apartments.apartmentName")}

                        </label>

                        <input
                            id="apartmentName"
                            name="apartmentName"
                            type="text"
                            value={form.apartmentName}
                            onChange={onChange}
                            placeholder={t("apartments.apartmentNamePlaceholder")}
                            disabled={isSubmitting}
                        />

                    </div>

                    <div className="mg-form-group">

                        <label htmlFor="address">

                            {t("apartments.address")}

                        </label>

                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={form.address}
                            onChange={onChange}
                            placeholder={t("apartments.addressPlaceholder")}
                            disabled={isSubmitting}
                        />

                    </div>

                </div>

                <div className="mg-modal-actions">

                    <button
                        type="button"
                        className="mg-cancel-button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >

                        <X size={17} />

                        {t("apartments.cancel")}

                    </button>

                    <button
                        type="submit"
                        className="mg-primary-button"
                        disabled={isSubmitting}
                    >

                        <Save size={17} />

                        {isSubmitting
                            ? t("apartments.registering")
                            : t("apartments.registerApartment")}

                    </button>

                </div>

            </form>

        </section>

    );

}