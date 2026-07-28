import { Save, X } from "lucide-react";

export default function AddApartmentModal({

    showForm,

    form,

    onChange,

    onSubmit,

    onCancel,

    isSubmitting,

}) {

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

                    <h2>Register Apartment</h2>

                    <p>
                        Enter the apartment details below.
                    </p>

                </div>

                <button
                    type="button"
                    className="mg-cancel-button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >

                    <X size={16} />

                    Close

                </button>

            </div>

            <form onSubmit={onSubmit}>

                <div className="mg-form-grid">

                    <div className="mg-form-group mg-form-group-full">

                        <label htmlFor="apartmentName">

                            Apartment Name

                        </label>

                        <input
                            id="apartmentName"
                            name="apartmentName"
                            type="text"
                            value={form.apartmentName}
                            onChange={onChange}
                            placeholder="Example: Green Valley Apartments"
                            disabled={isSubmitting}
                        />

                    </div>

                    <div className="mg-form-group">

                        <label htmlFor="address">

                            Address

                        </label>

                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={form.address}
                            onChange={onChange}
                            placeholder="Sector-62, Noida"
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

                        Cancel

                    </button>

                    <button
                        type="submit"
                        className="mg-primary-button"
                        disabled={isSubmitting}
                    >

                        <Save size={17} />

                        {isSubmitting
                            ? "Registering..."
                            : "Register Apartment"}

                    </button>

                </div>

            </form>

        </section>

    );

}