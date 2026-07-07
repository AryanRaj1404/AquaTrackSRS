import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  CheckCircle2,
  Home,
  Loader2,
  Plus,
  Save,
  Users,
  X,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import {
  createHousehold,
  getHouseholds,
} from "../services/householdService";

const initialForm = {
  flatNumber: "",
  residentName: "",
  apartmentId: "",
  membersCount: "",
  meterNumber: "",
};

function Households() {
  const [households, setHouseholds] = useState([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadHouseholds();
  }, []);

  const loadHouseholds = async () => {
    try {
      setIsLoading(true);

      const data = await getHouseholds();

      setHouseholds(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Household fetch error:", error);

      setHouseholds([]);

      toast.error("Household API is not connected yet. Empty state is shown.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHouseholds = useMemo(() => {
    if (!query.trim()) {
      return households;
    }

    const keyword = query.toLowerCase();

    return households.filter((household) => {
      return (
        household.flatNumber?.toLowerCase().includes(keyword) ||
        household.residentName?.toLowerCase().includes(keyword) ||
        household.meterNumber?.toLowerCase().includes(keyword)
      );
    });
  }, [households, query]);

  const totalResidents = households.reduce((total, household) => {
    return total + Number(household.membersCount || 0);
  }, 0);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.flatNumber.trim()) {
      toast.error("Flat number is required.");
      return false;
    }

    if (!form.residentName.trim()) {
      toast.error("Resident name is required.");
      return false;
    }

    if (!form.apartmentId.trim()) {
      toast.error("Apartment ID is required.");
      return false;
    }

    if (!form.membersCount || Number(form.membersCount) <= 0) {
      toast.error("Enter a valid members count.");
      return false;
    }

    if (!form.meterNumber.trim()) {
      toast.error("Meter number is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const householdPayload = {
      flatNumber: form.flatNumber.trim(),
      residentName: form.residentName.trim(),
      apartmentId: form.apartmentId.trim(),
      membersCount: Number(form.membersCount),
      meterNumber: form.meterNumber.trim(),
    };

    setIsSubmitting(true);

    const loadingToast = toast.loading("Creating household...");

    try {
      const savedHousehold = await createHousehold(householdPayload);

      setHouseholds((previous) => [savedHousehold, ...previous]);

      toast.success("Household created successfully.", {
        id: loadingToast,
      });

      setForm(initialForm);
      setShowForm(false);
    } catch (error) {
      console.error("Household create error:", error);

      toast.error(
        "Household creation failed. Please confirm backend endpoint and field names.",
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
      title="Household Management"
      description="Create and manage households using backend-ready fields."
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="Search households, residents or meters..."
      action={
        <button
          type="button"
          className="mg-primary-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add Household
        </button>
      }
    >
      <section className="mg-summary-grid">
        <StatCard
          icon={Home}
          title="Total Households"
          value={households.length}
          description="Fetched from backend API"
        />

        <StatCard
          icon={Users}
          title="Total Residents"
          value={totalResidents}
          description="Based on members count"
        />

        <StatCard
          icon={CheckCircle2}
          title="Status"
          value="API Ready"
          description="No dummy household data"
        />

        <StatCard
          icon={Home}
          title="Apartment Link"
          value="Required"
          description="Household belongs to apartment"
        />
      </section>

      {showForm && (
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

              <div className="mg-form-group">
                <label htmlFor="residentName">Resident Name</label>

                <input
                  id="residentName"
                  name="residentName"
                  type="text"
                  value={form.residentName}
                  onChange={handleChange}
                  placeholder="Example: Arun Kumar"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mg-form-group">
                <label htmlFor="apartmentId">Apartment ID</label>

                <input
                  id="apartmentId"
                  name="apartmentId"
                  type="text"
                  value={form.apartmentId}
                  onChange={handleChange}
                  placeholder="Example: 1"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mg-form-group">
                <label htmlFor="membersCount">Members Count</label>

                <input
                  id="membersCount"
                  name="membersCount"
                  type="number"
                  min="1"
                  value={form.membersCount}
                  onChange={handleChange}
                  placeholder="Example: 4"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mg-form-group mg-form-group-full">
                <label htmlFor="meterNumber">Meter Number</label>

                <input
                  id="meterNumber"
                  name="meterNumber"
                  type="text"
                  value={form.meterNumber}
                  onChange={handleChange}
                  placeholder="Example: AQ-1001"
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
                {isSubmitting ? "Saving..." : "Create Household"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="mg-panel">
        <div className="mg-toolbar">
          <div>
            <h2>Household Records</h2>
            <p>
              Household data will appear here after successful backend API
              connection.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="mg-empty-state">
            <Loader2 size={36} className="animate-spin" />
            <h3>Loading households</h3>
            <p>Please wait while household data is fetched.</p>
          </div>
        ) : filteredHouseholds.length > 0 ? (
          <div className="mg-table-wrapper">
            <table className="mg-table">
              <thead>
                <tr>
                  <th>Flat Number</th>
                  <th>Resident Name</th>
                  <th>Apartment ID</th>
                  <th>Members Count</th>
                  <th>Meter Number</th>
                </tr>
              </thead>

              <tbody>
                {filteredHouseholds.map((household) => (
                  <tr key={household.id || household.flatNumber}>
                    <td>
                      <span className="mg-table-primary">
                        {household.flatNumber}
                      </span>
                    </td>

                    <td>{household.residentName}</td>
                    <td>{household.apartmentId}</td>
                    <td>{household.membersCount}</td>
                    <td>{household.meterNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Home}
            title="No households found"
            description="No fake records are shown. Add households after confirming backend fields."
          />
        )}
      </section>
    </AdminPageShell>
  );
}

export default Households;