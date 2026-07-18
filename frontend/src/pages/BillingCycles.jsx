import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  ReceiptText,
  Save,
  Trash2,
  X,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";

import {
  getBillingCycles,
  createBillingCycle,
  updateBillingCycle,
  deleteBillingCycle,
} from "../services/billingCycleService";

import { getApartments } from "../services/apartmentService";
import { getTariffPlans } from "../services/tariffPlanService";

const initialForm = {
  apartmentId: "",
  tariffPlanId: "",
  startDate: "",
  endDate: "",
  totalAmount: 0,
  status: "OPEN",
};

function BillingCycles(){
    const [billingCycles, setBillingCycles] = useState([]);

    const [apartments, setApartments] = useState([]);

    const [tariffPlans, setTariffPlans] = useState([]);

    const [query, setQuery] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [deleteId, setDeleteId] = useState(null);

    const [form, setForm] = useState(initialForm);

    const [isLoading, setIsLoading] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadData();
        }, []);

    const loadData = async () => {
    try {

        setIsLoading(true);

        const [
          billingData,
          apartmentData,
          tariffData,
      ] = await Promise.all([
          getBillingCycles(),
          getApartments(),
          getTariffPlans(),
      ]);

        setBillingCycles(
        Array.isArray(billingData)
            ? billingData
            : []
        );

        setApartments(
        Array.isArray(apartmentData)
            ? apartmentData
            : []
        );

        setTariffPlans(
        Array.isArray(tariffData)
            ? tariffData
            : []
        );

    } catch (error) {

        console.error(error);

        toast.error(
        "Unable to load billing data."
        );

    } finally {

        setIsLoading(false);

    }
    };

    const filteredBillingCycles = useMemo(() => {

    if (!query.trim()) {
        return billingCycles;
    }

    const keyword = query.toLowerCase();

    return billingCycles.filter((cycle) => {

        return (

        cycle.apartmentName
            ?.toLowerCase()
            .includes(keyword)

        ||

        cycle.tariffPlanName
            ?.toLowerCase()
            .includes(keyword)

        ||

        cycle.status
            ?.toLowerCase()
            .includes(keyword)

        );

    });

    }, [billingCycles, query]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        };

    const validateForm = () => {

    if (!form.apartmentId) {
        toast.error("Select an Apartment.");
        return false;
    }

    if (!form.startDate) {
        toast.error("Start date is required.");
        return false;
    }

    if (!form.endDate) {
        toast.error("End date is required.");
        return false;
    }

    if (form.startDate > form.endDate) {
        toast.error("End date must be after start date.");
        return false;
    }

    

    return true;
    };
    const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const billingPayload = {
        apartmentId: Number(form.apartmentId),
        tariffPlanId: form.tariffPlanId
        ? Number(form.tariffPlanId)
        : null,
        startDate: form.startDate,
        endDate: form.endDate,
        totalAmount: 0,
        status: form.status,
    };

    setIsSubmitting(true);

    const loadingToast = toast.loading(
        editingId
        ? "Updating billing cycle..."
        : "Creating billing cycle..."
    );

    try {
        if (editingId) {
        const updatedCycle = await updateBillingCycle(
            editingId,
            billingPayload
        );

        setBillingCycles((previous) =>
            previous.map((cycle) =>
            cycle.id === editingId
                ? updatedCycle
                : cycle
            )
        );

        toast.success(
            "Billing cycle updated successfully.",
            {
            id: loadingToast,
            }
        );
        } else {
        const savedCycle = await createBillingCycle(
            billingPayload
        );

        setBillingCycles((previous) => [
            savedCycle,
            ...previous,
        ]);

        toast.success(
            "Billing cycle created successfully.",
            {
            id: loadingToast,
            }
        );
        }

        setForm(initialForm);
        setEditingId(null);
        setShowForm(false);

    } catch (error) {

        console.error(error);

        toast.error(
        editingId
            ? "Failed to update billing cycle."
            : "Failed to create billing cycle.",
        {
            id: loadingToast,
        }
        );

    } finally {

        setIsSubmitting(false);

    }
    };

    const handleEdit = (cycle) => {

    setEditingId(cycle.id);

    setForm({
        apartmentId: cycle.apartmentId,
        tariffPlanId: cycle.tariffPlanId ?? "",
        startDate: cycle.startDate,
        endDate: cycle.endDate,
        totalAmount: 0,
        status: cycle.status,
    });

    setShowForm(true);

    };

    const handleDelete = async () => {

    if (deleteId === null) {
        return;
    }

    const loadingToast = toast.loading(
        "Deleting billing cycle..."
    );

    try {

        await deleteBillingCycle(deleteId);

        setBillingCycles((previous) =>
        previous.filter(
            (cycle) => cycle.id !== deleteId
        )
        );

        toast.success(
        "Billing cycle deleted successfully.",
        {
            id: loadingToast,
        }
        );

        setDeleteId(null);

    } catch (error) {

        console.error(error);

        toast.error(
        "Failed to delete billing cycle.",
        {
            id: loadingToast,
        }
        );

        setDeleteId(null);

    }

    };

    const handleCancel = () => {

    setForm(initialForm);

    setEditingId(null);

    setShowForm(false);

    };

    const getStatusStyle = (status) => {

      switch (status) {

          case "OPEN":
              return {
                  background: "#dbeafe",
                  color: "#1d4ed8",
              };

          case "INVOICED":
              return {
                  background: "#fef3c7",
                  color: "#92400e",
              };

          case "PAID":
              return {
                  background: "#dcfce7",
                  color: "#166534",
              };

          case "CLOSED":
              return {
                  background: "#e5e7eb",
                  color: "#374151",
              };

          default:
              return {};
      }

  };
    return (
  <>
    <AdminPageShell
      title="Billing Cycle Management"
      description="Manage Apartment billing cycles and assigned tariff plans."
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="Search billing cycles..."
      action={
        <button
          type="button"
          className="mg-primary-button"
          onClick={() => {
            setEditingId(null);
            setForm(initialForm);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add Billing Cycle
        </button>
      }
    >
      <section className="mg-summary-grid">
        <StatCard
          icon={ReceiptText}
          title="Billing Cycles"
          value={billingCycles.length}
          description="Total billing records"
        />

        <StatCard
          icon={CalendarDays}
          title="Open Cycles"
          value={
            billingCycles.filter(
              (cycle) => cycle.status === "OPEN"
            ).length
          }
          description="Currently active"
        />

        <StatCard
          icon={CheckCircle2}
          title="Paid Cycles"
          value={
            billingCycles.filter(
              (cycle) => cycle.status === "PAID"
            ).length
          }
          description="Completed payments"
        />

        <StatCard
          icon={ReceiptText}
          title="Latest Cycle"
          value={
            billingCycles.length > 0
              ? billingCycles[0].apartmentName
              : "-"
          }
          description={
            billingCycles.length > 0
              ? billingCycles[0].status
              : "No billing cycles"
          }
        />
      </section>

      {showForm && (
        <section
          className="mg-panel"
          style={{ marginBottom: "20px" }}
        >
          <div className="mg-toolbar">
            <div>
              <h2>
                {editingId
                  ? "Update Billing Cycle"
                  : "Create Billing Cycle"}
              </h2>

              <p>
                Configure billing cycle details.
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
                <label>Apartment</label>

                <select
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

              <div className="mg-form-group">
                <label>Tariff Plan</label>

                <select
                  name="tariffPlanId"
                  value={form.tariffPlanId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">
                    Select Tariff Plan
                  </option>

                  {tariffPlans.map((plan) => (
                    <option
                      key={plan.id}
                      value={plan.id}
                    >
                      {plan.planName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mg-form-group">
                <label>Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="mg-form-group">
                <label>End Date</label>

                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="mg-form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="INVOICED">INVOICED</option>
                    <option value="PAID">PAID</option>
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

                {isSubmitting
                  ? editingId
                    ? "Updating..."
                    : "Saving..."
                  : editingId
                  ? "Update Billing Cycle"
                  : "Create Billing Cycle"}
              </button>
            </div>
          </form>
        </section>
      )}
      <section className="mg-panel">
        <div className="mg-toolbar">
            <div>
            <h2>Billing Cycle Records</h2>
            <p>
                All billing cycles are listed below.
            </p>
            </div>
        </div>

        {isLoading ? (
            <div className="mg-empty-state">
            <Loader2
                size={36}
                className="animate-spin"
            />

            <h3>Loading billing cycles</h3>

            <p>
                Please wait while billing data is fetched.
            </p>
            </div>
        ) : filteredBillingCycles.length > 0 ? (
            <div className="mg-table-wrapper">
            <table className="mg-table">
                <thead>
                <tr>
                    <th>Apartment</th>
                    <th>Tariff Plan</th>
                    <th>Period</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {filteredBillingCycles.map((cycle) => (
                    <tr key={cycle.id}>
                    <td>
                        <span className="mg-table-primary">
                        {cycle.apartmentName}
                        </span>
                    </td>

                    <td>
                        {cycle.tariffPlanName ?? "-"}
                    </td>

                    <td>
                        {new Date(cycle.startDate).toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                        )}{" "}
                        -{" "}
                        {new Date(cycle.endDate).toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                        )}
                    </td>

                    <td>
                        <span
                            className="mg-status"
                            style={getStatusStyle(cycle.status)}
                        >
                        {cycle.status}
                        </span>
                    </td>

                    <td
                        style={{
                        display: "flex",
                        gap: "10px",
                        }}
                    >
                        <button
                        type="button"
                        className="mg-secondary-button"
                        onClick={() => handleEdit(cycle)}
                        >
                        <Pencil size={16} />
                        Edit
                        </button>

                        <button
                        type="button"
                        className="mg-danger-button"
                        onClick={() =>
                            setDeleteId(cycle.id)
                        }
                        >
                        <Trash2 size={16} />
                        Delete
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        ) : (
            <EmptyState
            icon={ReceiptText}
            title="No billing cycles found"
            description="Create your first billing cycle to begin tracking Apartment bills."
            />
        )}
        </section>
    </AdminPageShell>
        <ConfirmDialog
            open={deleteId !== null}
            title="Delete Billing Cycle"
            message="Are you sure you want to delete this billing cycle? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onCancel={() => setDeleteId(null)}
            onConfirm={handleDelete}
        />
    </>
    );
}

export default BillingCycles;