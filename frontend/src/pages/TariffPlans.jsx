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

    fixedCharge: "",

    effectiveFrom: "",

    effectiveTo: "",

    description: "",

    tiers: [

        {

            tierOrder: 1,

            uptoKl: "",

            ratePerKl: ""

        }

    ]

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

    const handleTierChange = (

      index,

      field,

      value

  ) => {

      setForm(previous => {

          const tiers = [...previous.tiers];

          tiers[index] = {

              ...tiers[index],

              [field]: value

          };

          return {

              ...previous,

              tiers

          };

      });

  };

  const addTier = () => {

      setForm(previous => ({

          ...previous,

          tiers: [

              ...previous.tiers,

              {

                  tierOrder:

                      previous.tiers.length + 1,

                  uptoKl: "",

                  ratePerKl: ""

              }

          ]

      }));

  };

  const removeTier = (index) => {

      setForm(previous => {

          const tiers = previous.tiers

              .filter((_, i) =>

                  i !== index

              )

              .map(

                  (tier, index) => ({

                      ...tier,

                      tierOrder: index + 1

                  })

              );

          return {

              ...previous,

              tiers

          };

      });

  };

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

    if (form.tiers.length === 0) {

      toast.error(

          "Add at least one tariff tier."

      );

      return false;

  }

  for (const tier of form.tiers) {

      if (

          !tier.ratePerKl

      ) {

          toast.error(

              "Each tier must have a rate."

          );

          return false;

      }

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

      planName:

          form.planName.trim(),

      fixedCharge:

          Number(form.fixedCharge),

      effectiveFrom:

          form.effectiveFrom,

      effectiveTo:

          form.effectiveTo,

      description:

          form.description.trim(),

      tiers:

          form.tiers.map(

              tier => ({

                  tierOrder:

                      tier.tierOrder,

                  uptoKl:

                      tier.uptoKl === ""

                      ? null

                      : Number(

                          tier.uptoKl

                      ),

                  ratePerKl:

                      Number(

                          tier.ratePerKl

                      )

              })

          )

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

    fixedCharge: tariffPlan.fixedCharge,

    effectiveFrom: tariffPlan.effectiveFrom,

    effectiveTo: tariffPlan.effectiveTo,

    description: tariffPlan.description ?? "",

    tiers:

        tariffPlan.tiers.map(

            tier => ({

                tierOrder:

                    tier.tierOrder,

                uptoKl:

                    tier.uptoKl ?? "",

                ratePerKl:

                    tier.ratePerKl

            })

        )

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

    toast.error(
      error.response?.data?.message ||
      error.response?.data ||
      "Failed to delete tariff plan.",
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

  const today =
    new Date().toISOString().split("T")[0];

const activePlans =
    tariffPlans.filter(

        plan =>

            plan.effectiveFrom <= today &&

            plan.effectiveTo >= today

    ).length;

const latestPlan =
    [...tariffPlans]

        .sort(

            (a, b) =>

                new Date(b.effectiveFrom) -

                new Date(a.effectiveFrom)

        )[0];

const highestRate =
    tariffPlans.length > 0

        ? Math.max(

            ...tariffPlans.flatMap(

                plan =>

                    plan.tiers.map(

                        tier =>

                            tier.ratePerKl

                    )

            )

        )

        : "-";

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
        delay={0}
      />

      <StatCard
        icon={CheckCircle2}
        title="Active Plans"
        value={activePlans}
        description="Currently configured"
        delay={0.1}
      />

      <StatCard
        icon={BadgeDollarSign}
        title="Highest Rate"
        value={
          highestRate === "-"

              ? "-"

              : `₹ ${highestRate.toLocaleString(
                  "en-IN",
                  {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                  }
              )}`
      }
        description="Rate per unit"
        delay={0.2}
      />

      <StatCard
        icon={BadgeDollarSign}
        title="Latest Plan"
        value={
            latestPlan?.planName ?? "-"
        }

        description={
            latestPlan?.effectiveFrom ??
            "No plans yet"
        }
        delay={0.3}
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

          <div
              style={{
                  marginTop: "30px",
              }}
          >

    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
        }}
    >

        <h3
            style={{
                margin: 0,
            }}
        >
            Tariff Tiers
        </h3>

        <button
            type="button"
            className="mg-secondary-button"
            onClick={addTier}
            disabled={isSubmitting}
        >
            <Plus size={16} />
            Add Tier
        </button>

    </div>

    {form.tiers.map(

        (tier, index) => (

            <div
                key={index}
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr auto",
                    gap: "16px",
                    padding: "16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    marginBottom: "16px",
                }}
            >

                <div className="mg-form-group">

                    <label>

                        Up To (KL)

                    </label>

                    <input
                        type="number"
                        step="0.01"
                        value={tier.uptoKl}
                        onChange={(e) =>
                            handleTierChange(
                                index,
                                "uptoKl",
                                e.target.value
                            )
                        }
                        placeholder="Leave empty for unlimited"
                        disabled={isSubmitting}
                    />

                </div>

                <div className="mg-form-group">

                        <label>

                            Rate / KL

                        </label>

                        <input
                            type="number"
                            step="0.01"
                            value={tier.ratePerKl}
                            onChange={(e) =>
                                handleTierChange(
                                    index,
                                    "ratePerKl",
                                    e.target.value
                                )
                            }
                            disabled={isSubmitting}
                        />

                    </div>

                    <div
                        className="mg-form-group"
                        style={{
                            justifyContent: "flex-end",
                            display: "flex",
                            alignItems: "end",
                        }}
                    >

                        {form.tiers.length > 1 && (

                            <button
                                type="button"
                                className="mg-danger-button"
                                onClick={() =>
                                    removeTier(index)
                                }
                            >
                                <Trash2 size={16} />
                                Remove
                            </button>

                        )}

                    </div>

                </div>

            )

        )}
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
                  <th>Tariff Slabs</th>
                  <th>Fixed Charge</th>
                  <th>Effective</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTariffPlans.map((plan) => (
                  <tr className="hover:bg-slate-50 transition-colors"
                  key={plan.id}>
                    <td>
                      <span className="mg-table-primary">
                        {plan.planName}
                      </span>
                    </td>

                    <td>

    <div
        style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
        }}
    >

        {[...plan.tiers]
            .sort(
                (a, b) =>
                    a.tierOrder - b.tierOrder
            )
            .map((tier, index) => {

                const previous =
                    index === 0
                        ? 0
                        : plan.tiers[index - 1].uptoKl;

                return (

                    <div
                        key={tier.id ?? index}
                        style={{
                            fontSize: "13px",
                            lineHeight: "18px",
                        }}
                    >

                        <strong>

                            {tier.uptoKl == null

                                ? `${previous}+ KL`

                                : `${previous} - ${tier.uptoKl} KL`

                            }

                        </strong>

                        {" : ₹"}

                        {Number(
                            tier.ratePerKl
                        ).toLocaleString(
                            "en-IN",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                        )}{" / KL"}

                    </div>

                );

            })}

    </div>

</td>

                    <td>
                        ₹ {
                            Number(

                                plan.fixedCharge

                            ).toLocaleString(

                                "en-IN",

                                {

                                    minimumFractionDigits: 2,

                                    maximumFractionDigits: 2

                                }

                            )

                        }
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
                        className="mg-action-button"
                        onClick={() =>
                          handleEdit(plan)
                        }
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="mg-action-button"
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