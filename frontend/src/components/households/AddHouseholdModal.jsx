import { Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";

function AddHouseholdModal({

    showForm,

    handleCancel,

    handleSubmit,

    handleChange,

    form,

    apartments,

    isSubmitting,

}){
    const { t } = useTranslation();

    if (!showForm) {
    return null;
}


    return(

            
        <section className="mg-panel" style={{ marginBottom: "20px" }}>
          <div className="mg-toolbar">
            <div>
              <h2>{t("households.addModal.title")}</h2>
              <p>
                {t("households.addModal.subtitle")}
              </p>
            </div>

            <button
              type="button"
              className="mg-cancel-button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X size={16} />
              {t("households.addModal.close")}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mg-form-grid">

              {/* Flat Number */}

              <div className="mg-form-group">
                <label htmlFor="flatNumber">{t("households.addModal.flatNumberLabel")}</label>

                <input
                  id="flatNumber"
                  name="flatNumber"
                  type="text"
                  value={form.flatNumber}
                  onChange={handleChange}
                  placeholder={t("households.addModal.flatNumberPlaceholder")}
                  disabled={isSubmitting}
                />
              </div>

              {/* Flat Size */}

              <div className="mg-form-group">
                <label htmlFor="flatSize">{t("households.addModal.flatSizeLabel")}</label>

                <input
                  id="flatSize"
                  name="flatSize"
                  type="number"
                  value={form.flatSize}
                  onChange={handleChange}
                  placeholder={t("households.addModal.flatSizePlaceholder")}
                  disabled={isSubmitting}
                />
              </div>

              {/* Occupancy */}

              <div className="mg-form-group">
                <label htmlFor="occupancy">{t("households.addModal.occupancyLabel")}</label>

                <input
                  id="occupancy"
                  name="occupancy"
                  type="number"
                  min="1"
                  value={form.occupancy}
                  onChange={handleChange}
                  placeholder={t("households.addModal.occupancyPlaceholder")}
                  disabled={isSubmitting}
                />
              </div>

              {/* Apartment */}

              <div className="mg-form-group">
                <label htmlFor="apartmentId">{t("households.addModal.apartmentLabel")}</label>

                <select
                  id="apartmentId"
                  name="apartmentId"
                  value={form.apartmentId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >

                  <option value="">
                    {t("households.addModal.selectApartment")}
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

            </div>
            

            <div className="mg-modal-actions">
              <button
                type="button"
                className="mg-cancel-button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X size={17} />
                {t("households.addModal.cancel")}
              </button>

              <button
                type="submit"
                className="mg-primary-button"
                disabled={isSubmitting}
              >
                <Save size={17} />
                {isSubmitting ? t("households.addModal.saving") : t("households.addModal.createHousehold")}
              </button>
            </div>
          </form>
        </section>
      )

}

export default AddHouseholdModal;
