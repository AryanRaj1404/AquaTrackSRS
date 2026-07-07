import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  Building2,
  CheckCircle2,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import {
  createApartment,
  getApartments,
} from "../services/apartmentService";

const initialForm = {
  apartmentName: "",
  blockName: "",
  totalFloors: "",
  totalUnits: "",
  city: "",
  country: "",
};

function Apartments() {
  const [apartments, setApartments] = useState([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadApartments();
  }, []);

  const loadApartments = async () => {
    try {
      setIsLoading(true);

      const data = await getApartments();

      setApartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Apartment fetch error:", error);

      setApartments([]);

      toast.error(
        "Apartment API is not connected yet. Empty state is shown."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApartments = useMemo(() => {
    if (!query.trim()) {
      return apartments;
    }

    const keyword = query.toLowerCase();

    return apartments.filter((apartment) => {
      return (
        apartment.apartmentName?.toLowerCase().includes(keyword) ||
        apartment.blockName?.toLowerCase().includes(keyword) ||
        apartment.city?.toLowerCase().includes(keyword) ||
        apartment.country?.toLowerCase().includes(keyword)
      );
    });
  }, [apartments, query]);

  const totalUnits = apartments.reduce((total, apartment) => {
    return total + Number(apartment.totalUnits || 0);
  }, 0);

  const totalFloors = apartments.reduce((total, apartment) => {
    return total + Number(apartment.totalFloors || 0);
  }, 0);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.apartmentName.trim()) {
      toast.error("Apartment name is required.");
      return false;
    }

    if (!form.blockName.trim()) {
      toast.error("Block name is required.");
      return false;
    }

    if (!form.totalFloors || Number(form.totalFloors) <= 0) {
      toast.error("Enter valid total floors.");
      return false;
    }

    if (!form.totalUnits || Number(form.totalUnits) <= 0) {
      toast.error("Enter valid number of units.");
      return false;
    }

    if (!form.city.trim()) {
      toast.error("City is required.");
      return false;
    }

    if (!form.country.trim()) {
      toast.error("Country is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const apartmentPayload = {
      apartmentName: form.apartmentName.trim(),
      blockName: form.blockName.trim(),
      totalFloors: Number(form.totalFloors),
      totalUnits: Number(form.totalUnits),
      city: form.city.trim(),
      country: form.country.trim(),
    };

    setIsSubmitting(true);

    const loadingToast = toast.loading("Creating apartment...");

    try {
      const savedApartment = await createApartment(apartmentPayload);

      setApartments((previous) => [savedApartment, ...previous]);

      toast.success("Apartment created successfully.", {
        id: loadingToast,
      });

      setForm(initialForm);
      setShowForm(false);
    } catch (error) {
      console.error("Apartment create error:", error);

      toast.error(
        "Apartment creation failed. Please confirm backend endpoint and field names.",
        {
          id: loadingToast,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setShowForm(false);
  };

  return (
    <AdminPageShell
      title="Apartment Management"
      description="Create and manage apartment records using backend-ready fields."
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="Search apartments..."
      action={
        <button
          type="button"
          className="mg-primary-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add Apartment
        </button>
      }
    >
      <section className="mg-summary-grid">
        <StatCard
          icon={Building2}
          title="Total Apartments"
          value={apartments.length}
          description="Fetched from backend API"
        />

        <StatCard
          icon={CheckCircle2}
          title="Total Units"
          value={totalUnits}
          description="Total registered units"
        />

        <StatCard
          icon={Building2}
          title="Total Floors"
          value={totalFloors}
          description="Combined apartment floors"
        />

        <StatCard
          icon={CheckCircle2}
          title="Status"
          value="API Ready"
          description="No dummy apartment data"
        />
      </section>

      {showForm && (
        <section className="mg-panel" style={{ marginBottom: "20px" }}>
          <div className="mg-toolbar">
            <div>
              <h2>Add Apartment</h2>
              <p>
                These fields should match Sandhiya&apos;s backend apartment API.
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
              <div className="mg-form-group mg-form-group-full">
                <label htmlFor="apartmentName">Apartment Name</label>

                <input
                  id="apartmentName"
                  name="apartmentName"
                  type="text"
                  value={form.apartmentName}
                  onChange={handleChange}
                  placeholder="Example: Green Valley Apartments"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mg-form-group">
                <label htmlFor="blockName">Block Name</label>

                <input
                  id="blockName"
                  name="blockName"
                  type="text"
                  value={form.blockName}
                  onChange={handleChange}
                  placeholder="Example: Block A"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mg-form-group">
                <label htmlFor="totalFloors">Total Floors</label>

                <input
                  id="totalFloors"
                  name="totalFloors"
                  type="number"
                  min="1"
                  value={form.totalFloors}
                  onChange={handleChange}
                  placeholder="Example: 5"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mg-form-group">
                <label htmlFor="totalUnits">Number of Units</label>

                <input
                  id="totalUnits"
                  name="totalUnits"
                  type="number"
                  min="1"
                  value={form.totalUnits}
                  onChange={handleChange}
                  placeholder="Example: 40"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mg-form-group">
                <label htmlFor="city">City</label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Example: Chennai"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mg-form-group">
                <label htmlFor="country">Country</label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Example: India"
                  disabled={isSubmitting}
                />
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
                {isSubmitting ? "Saving..." : "Create Apartment"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="mg-panel">
        <div className="mg-toolbar">
          <div>
            <h2>Apartment Records</h2>
            <p>
              Apartment data will appear here after successful backend API
              connection.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="mg-empty-state">
            <Loader2 size={36} className="animate-spin" />
            <h3>Loading apartments</h3>
            <p>Please wait while apartment data is fetched.</p>
          </div>
        ) : filteredApartments.length > 0 ? (
          <div className="mg-table-wrapper">
            <table className="mg-table">
              <thead>
                <tr>
                  <th>Apartment Name</th>
                  <th>Block</th>
                  <th>Total Floors</th>
                  <th>Total Units</th>
                  <th>City</th>
                  <th>Country</th>
                </tr>
              </thead>

              <tbody>
                {filteredApartments.map((apartment) => (
                  <tr key={apartment.id || apartment.apartmentName}>
                    <td>
                      <span className="mg-table-primary">
                        {apartment.apartmentName}
                      </span>
                    </td>

                    <td>{apartment.blockName}</td>
                    <td>{apartment.totalFloors}</td>
                    <td>{apartment.totalUnits}</td>
                    <td>{apartment.city}</td>
                    <td>{apartment.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="No apartments found"
            description="No fake records are shown. Click Add Apartment after confirming backend fields."
          />
        )}
      </section>
    </AdminPageShell>
  );
}

export default Apartments;