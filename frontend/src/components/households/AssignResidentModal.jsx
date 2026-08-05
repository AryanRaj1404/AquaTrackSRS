import { Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AssignResidentModal({

    showAssignModal,

    selectedHousehold,

    availableResidents,

    selectedResident,

    onResidentChange,

    onAssign,

    onClose,

    isAssigning

}) {
    const { t } = useTranslation();

    if (!showAssignModal) {

    return null;

}
    return(
  <section className="mg-panel" style={{ marginBottom: "20px" }}>
    <div className="mg-toolbar">
      <div>
        <h2>{t("households.assignModal.title")}</h2>
        <p>
          {t("households.assignModal.subtitle", { flat: selectedHousehold?.flatNumber })}
        </p>
      </div>

      <button
        type="button"
        className="mg-cancel-button"
        onClick={ onClose }
      >
        <X size={16} />
        {t("households.assignModal.close")}
      </button>
    </div>

    <div className="mg-form-grid">
      <div className="mg-form-group mg-form-group-full">
        <label>{t("households.assignModal.selectResidentLabel")}</label>

        <select
            value={selectedResident}
            onChange={(e) => onResidentChange(e.target.value)}
        >

            {availableResidents.length === 0 ? (

                <option value="">
                    {t("households.assignModal.noUnassigned")}
                </option>

            ) : (

                <>
                    <option value="">
                        {t("households.assignModal.chooseResident")}
                    </option>

                    {availableResidents.map((resident) => (

                        <option
                            key={resident.id}
                            value={resident.id}
                        >
                            {resident.fullName} ({resident.username})
                        </option>

                    ))}

                </>

            )}

        </select>
      </div>
    </div>

    <div className="mg-modal-actions">
      <button
        type="button"
        className="mg-cancel-button"
        onClick={ onClose }
      >
        <X size={17} />
        {t("households.assignModal.cancel")}
      </button>

      <button
        type="button"
        className="mg-primary-button disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onAssign}
        disabled={!selectedResident || isAssigning}
      >
        <Save size={17} />
        {isAssigning ? t("households.assignModal.assigning") : t("households.assignModal.assignResidentBtn")}
      </button>
    </div>
  </section>
)
}
