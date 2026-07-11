import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  BadgeDollarSign,
  CheckCircle2,
  Loader2,
  Plus,
  Save,
  X,
  Pencil,
  Trash2,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  getTariffPlans,
  createTariffPlan,
  updateTariffPlan,
  deleteTariffPlan,
} from "../services/tariffPlanService";

const initialForm = {
  planName: "",
  ratePerUnit: "",
  fixedCharge: "",
  effectiveFrom: "",
  effectiveTo: "",
  description: "",
};

function TariffPlans() {

  const [tariffPlans, setTariffPlans] = useState([]);

  const [query, setQuery] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadTariffPlans();
  }, []);

  const loadTariffPlans = async () => {
    try {
      setIsLoading(true);

      const data = await getTariffPlans();

      setTariffPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Tariff Plan fetch error:", error);

      setTariffPlans([]);

      toast.error("Unable to load tariff plans.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTariffPlans = useMemo(() => {
        if (!query.trim()) {
      return tariffPlans;
    }

    const keyword = query.toLowerCase();

    return tariffPlans.filter((plan) => {
      return (
        plan.planName?.toLowerCase().includes(keyword) ||
        plan.description?.toLowerCase().includes(keyword)
      );
    });
  }, [tariffPlans, query]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
        if (!form.planName.trim()) {
      toast.error("Plan name is required.");
      return false;
    }

    if (!form.ratePerUnit) {
      toast.error("Rate per unit is required.");
      return false;
    }

    if (Number(form.ratePerUnit) <= 0) {
      toast.error("Rate per unit must be greater than zero.");
      return false;
    }

    if (!form.fixedCharge) {
      toast.error("Fixed charge is required.");
      return false;
    }

    if (Number(form.fixedCharge) < 0) {
      toast.error("Fixed charge cannot be negative.");
      return false;
    }

    if (!form.effectiveFrom) {
      toast.error("Effective From is required.");
      return false;
    }

    if (!form.effectiveTo) {
      toast.error("Effective To is required.");
      return false;
    }

    if (form.effectiveFrom > form.effectiveTo) {
      toast.error("Effective To must be after Effective From.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const tariffPlanPayload = {
    planName: form.planName.trim(),
    ratePerUnit: Number(form.ratePerUnit),
    fixedCharge: Number(form.fixedCharge),
    effectiveFrom: form.effectiveFrom,
    effectiveTo: form.effectiveTo,
    description: form.description.trim(),
  };

  setIsSubmitting(true);

  const loadingToast = toast.loading(
    editingId
      ? "Updating tariff plan..."
      : "Creating tariff plan..."
  );

  try {
    if (editingId) {
      const updatedPlan = await updateTariffPlan(
        editingId,
        tariffPlanPayload
      );

      setTariffPlans((previous) =>
        previous.map((plan) =>
          plan.id === editingId ? updatedPlan : plan
        )
      );

      toast.success("Tariff plan updated successfully.", {
        id: loadingToast,
      });
    } else {
      const savedPlan = await createTariffPlan(
        tariffPlanPayload
      );

      setTariffPlans((previous) => [
        savedPlan,
        ...previous,
      ]);

      toast.success("Tariff plan created successfully.", {
        id: loadingToast,
      });
    }

    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  } catch (error) {
    console.error(error);

    toast.error(
      editingId
        ? "Failed to update tariff plan."
        : "Failed to create tariff plan.",
      {
        id: loadingToast,
      }
    );
  } finally {
    setIsSubmitting(false);
  }
  };

  const handleEdit = (tariffPlan) => {
    setEditingId(tariffPlan.id);

    setForm({
        planName: tariffPlan.planName,
        ratePerUnit: tariffPlan.ratePerUnit,
        fixedCharge: tariffPlan.fixedCharge,
        effectiveFrom: tariffPlan.effectiveFrom,
        effectiveTo: tariffPlan.effectiveTo,
        description: tariffPlan.description ?? "",
    });

    setShowForm(true);
  };

  const handleDelete = async () => {
  if (deleteId === null) {
    return;
  }

  const loadingToast = toast.loading("Deleting tariff plan...");

  try {
    await deleteTariffPlan(deleteId);

    setTariffPlans((previous) =>
      previous.filter((plan) => plan.id !== deleteId)
    );

    toast.success("Tariff plan deleted successfully.", {
      id: loadingToast,
    });

    setDeleteId(null);
  } catch (error) {
    console.error(error);

    toast.error("Failed to delete tariff plan.", {
      id: loadingToast,
    });

    setDeleteId(null);
  }
};

  const handleCancel = () => {
    setForm(initialForm);

    setEditingId(null);

    setShowForm(false);
  };

  return (
    <>
      <AdminPageShell
    title="Tariff Plan Management"
    description="Manage water tariff plans used for billing."
    searchValue={query}
    onSearchChange={setQuery}
    searchPlaceholder="Search tariff plans..."
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
        Add Tariff Plan
      </button>
    }
  >
    <section className="mg-summary-grid">
      <StatCard
        icon={BadgeDollarSign}
        title="Total Plans"
        value={tariffPlans.length}
        description="Available tariff plans"
      />

      <StatCard
        icon={CheckCircle2}
        title="Active Plans"
        value={tariffPlans.length}
        description="Currently configured"
      />

      <StatCard
        icon={BadgeDollarSign}
        title="Highest Rate"
        value={
          tariffPlans.length > 0
            ? Math.max(
                ...tariffPlans.map((plan) => plan.ratePerUnit)
              )
            : "-"
        }
        description="Rate per unit"
      />

      <StatCard
        icon={BadgeDollarSign}
        title="Latest Plan"
        value={
          tariffPlans.length > 0
            ? tariffPlans[0].planName
            : "-"
        }
        description={
          tariffPlans.length > 0
            ? tariffPlans[0].effectiveFrom
            : "No plans yet"
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
                ? "Update Tariff Plan"
                : "Register Tariff Plan"}
            </h2>

            <p>
              Configure tariff details for billing.
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
              <label>Plan Name</label>

              <input
                name="planName"
                value={form.planName}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Residential Plan"
              />
            </div>

            <div className="mg-form-group">
              <label>Rate Per Unit</label>

              <input
                type="number"
                step="0.01"
                name="ratePerUnit"
                value={form.ratePerUnit}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="mg-form-group">
              <label>Fixed Charge</label>

              <input
                type="number"
                step="0.01"
                name="fixedCharge"
                value={form.fixedCharge}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="mg-form-group">
              <label>Effective From</label>

              <input
                type="date"
                name="effectiveFrom"
                value={form.effectiveFrom}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="mg-form-group">
              <label>Effective To</label>

              <input
                type="date"
                name="effectiveTo"
                value={form.effectiveTo}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="mg-form-group mg-form-group-full">
              <label>Description</label>

              <textarea
                rows={4}
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Tariff description..."
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

              {isSubmitting
                ? editingId
                  ? "Updating..."
                  : "Saving..."
                : editingId
                ? "Update Tariff Plan"
                : "Save Tariff Plan"}
            </button>
          </div>
        </form>
      </section>)
    }
            <section className="mg-panel">
        <div className="mg-toolbar">
          <div>
            <h2>Tariff Plan Records</h2>
            <p>
              All configured tariff plans are listed below.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="mg-empty-state">
            <Loader2
              size={36}
              className="animate-spin"
            />
            <h3>Loading tariff plans</h3>
            <p>
              Please wait while tariff plans are fetched.
            </p>
          </div>
        ) : filteredTariffPlans.length > 0 ? (
          <div className="mg-table-wrapper">
            <table className="mg-table">
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Rate/Unit</th>
                  <th>Fixed Charge</th>
                  <th>Effective</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTariffPlans.map((plan) => (
                  <tr key={plan.id}>
                    <td>
                      <span className="mg-table-primary">
                        {plan.planName}
                      </span>
                    </td>

                    <td>
                      ₹ {plan.ratePerUnit}
                    </td>

                    <td>
                      ₹ {plan.fixedCharge}
                    </td>

                    <td>
                        {new Date(plan.effectiveFrom).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                        {" - "}

                        {new Date(plan.effectiveTo).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
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
                        onClick={() =>
                          handleEdit(plan)
                        }
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="mg-danger-button"
                        onClick={() =>
                          setDeleteId(plan.id)
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
            icon={BadgeDollarSign}
            title="No tariff plans found"
            description="Create your first tariff plan to begin billing households."
          />
        )}
      </section>
    </AdminPageShell>
    <ConfirmDialog
        open={deleteId !== null}
        title="Delete Tariff Plan"
        message="Are you sure you want to delete this tariff plan? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        />
        </>
  );

}

export default TariffPlans;