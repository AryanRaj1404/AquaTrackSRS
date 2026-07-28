import { Save, X } from "lucide-react";

function AddHouseholdModal({

    showForm,

    handleCancel,

    handleSubmit,

    handleChange,

    form,

    apartments,

    isSubmitting,

}){
    if (!showForm) {
    return null;
}


    return(
        
            
        <section className="mg-panel" style={{ marginBottom: "20px" }}>
          <div className="mg-toolbar">
            <div>
              <h2>Add Household</h2>
              <p>
                These fields should match Sandhiya&apos;s backend household API.
              </p>
            </div>

            <button
              type="button"
              className="mg-cancel-button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X size={16} />
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mg-form-grid">

              {/* Flat Number */}

              <div className="mg-form-group">
                <label htmlFor="flatNumber">Flat Number</label>

                <input
                  id="flatNumber"
                  name="flatNumber"
                  type="text"
                  value={form.flatNumber}
                  onChange={handleChange}
                  placeholder="Example: A-101"
                  disabled={isSubmitting}
                />
              </div>

              {/* Flat Size */}

              <div className="mg-form-group">
                <label htmlFor="flatSize">Flat Size (sq.ft)</label>

                <input
                  id="flatSize"
                  name="flatSize"
                  type="number"
                  value={form.flatSize}
                  onChange={handleChange}
                  placeholder="Example: 1200"
                  disabled={isSubmitting}
                />
              </div>

              {/* Occupancy */}

              <div className="mg-form-group">
                <label htmlFor="occupancy">Occupancy</label>

                <input
                  id="occupancy"
                  name="occupancy"
                  type="number"
                  min="1"
                  value={form.occupancy}
                  onChange={handleChange}
                  placeholder="Example: 4"
                  disabled={isSubmitting}
                />
              </div>

              {/* Apartment */}

              <div className="mg-form-group">
                <label htmlFor="apartmentId">Apartment</label>

                <select
                  id="apartmentId"
                  name="apartmentId"
                  value={form.apartmentId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >

                  <option value="">
                    Select Apartment
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
                Cancel
              </button>

              <button
                type="submit"
                className="mg-primary-button"
                disabled={isSubmitting}
              >
                <Save size={17} />
                {isSubmitting ? "Saving..." : "Create Household"}
              </button>
            </div>
          </form>
        </section>
      )

}

export default AddHouseholdModal;