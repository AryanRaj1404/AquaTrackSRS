import { Save, X } from "lucide-react";

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
    if (!showAssignModal) {

    return null;

}
    return(
  <section className="mg-panel" style={{ marginBottom: "20px" }}>
    <div className="mg-toolbar">
      <div>
        <h2>Assign Resident</h2>
        <p>
          Assign a resident to Flat {selectedHousehold?.flatNumber}.
        </p>
      </div>

      <button
        type="button"
        className="mg-cancel-button"
        onClick={ onClose }
      >
        <X size={16} />
        Close
      </button>
    </div>

    <div className="mg-form-grid">
      <div className="mg-form-group mg-form-group-full">
        <label>Select Resident</label>

        <select
            value={selectedResident}
            onChange={(e) => onResidentChange(e.target.value)}
        >

            {availableResidents.length === 0 ? (

                <option value="">
                    No unassigned residents available
                </option>

            ) : (

                <>
                    <option value="">
                        Choose Resident
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
        Cancel
      </button>

      <button
        type="button"
        className="mg-primary-button disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onAssign}
        disabled={!selectedResident || isAssigning}
      >
        <Save size={17} />
        {isAssigning ? "Assigning..." : "Assign Resident"}
      </button>
    </div>
  </section>
)
}