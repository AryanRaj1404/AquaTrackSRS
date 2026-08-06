import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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

      toast.error(t("tariffPlans.toasts.loadError"));
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
      toast.error(t("tariffPlans.toasts.planNameRequired"));
      return false;
    }

    if (form.tiers.length === 0) {

      toast.error(

          t("tariffPlans.toasts.atLeastOneTier")

      );

      return false;

  }

  for (const tier of form.tiers) {

      if (

          !tier.ratePerKl

      ) {

          toast.error(

              t("tariffPlans.toasts.tierRateRequired")

          );

          return false;

      }

  }

    if (!form.fixedCharge) {
      toast.error(t("tariffPlans.toasts.fixedChargeRequired"));
      return false;
    }

    if (Number(form.fixedCharge) < 0) {
      toast.error(t("tariffPlans.toasts.fixedChargeNegative"));
      return false;
    }

    if (!form.effectiveFrom) {
      toast.error(t("tariffPlans.toasts.effectiveFromRequired"));
      return false;
    }

    if (!form.effectiveTo) {
      toast.error(t("tariffPlans.toasts.effectiveToRequired"));
      return false;
    }

    if (form.effectiveFrom > form.effectiveTo) {
      toast.error(t("tariffPlans.toasts.effectiveToAfterFrom"));
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
      ? t("tariffPlans.toasts.updating")
      : t("tariffPlans.toasts.creating")
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

      toast.success(t("tariffPlans.toasts.updateSuccess"), {
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

      toast.success(t("tariffPlans.toasts.createSuccess"), {
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
        ? t("tariffPlans.toasts.updateError")
        : t("tariffPlans.toasts.createError"),
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

  const loadingToast = toast.loading(t("tariffPlans.toasts.deleting"));

  try {
    await deleteTariffPlan(deleteId);

    setTariffPlans((previous) =>
      previous.filter((plan) => plan.id !== deleteId)
    );

    toast.success(t("tariffPlans.toasts.deleteSuccess"), {
      id: loadingToast,
    });

    setDeleteId(null);
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      error.response?.data ||
      t("tariffPlans.toasts.deleteError"),
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
    title={t("tariffPlans.pageTitle")}
    description={t("tariffPlans.pageDesc")}
    searchValue={query}
    onSearchChange={setQuery}
    searchPlaceholder={t("tariffPlans.searchPlaceholder")}
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
        {t("tariffPlans.addTariffPlan")}
      </button>
    }
  >
    <section className="mg-summary-grid">
      <StatCard
        icon={BadgeDollarSign}
        title={t("tariffPlans.stats.totalTitle")}
        value={tariffPlans.length}
        description={t("tariffPlans.stats.totalDesc")}
        delay={0}
      />

      <StatCard
        icon={CheckCircle2}
        title={t("tariffPlans.stats.activeTitle")}
        value={activePlans}
        description={t("tariffPlans.stats.activeDesc")}
        delay={0.1}
      />

      <StatCard
        icon={BadgeDollarSign}
        title={t("tariffPlans.stats.highestTitle")}
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
        description={t("tariffPlans.stats.highestDesc")}
        delay={0.2}
      />

      <StatCard
        icon={BadgeDollarSign}
        title={t("tariffPlans.stats.latestTitle")}
        value={
            latestPlan?.planName ?? "-"
        }

        description={
            latestPlan?.effectiveFrom ??
            t("tariffPlans.stats.noPlansYet")
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
                ? t("tariffPlans.form.updateTitle")
                : t("tariffPlans.form.registerTitle")}
            </h2>

            <p>
              {t("tariffPlans.form.desc")}
            </p>
          </div>

          <button
            type="button"
            className="mg-cancel-button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X size={16} />
            {t("tariffPlans.form.close")}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mg-form-grid">

            <div className="mg-form-group">
              <label>{t("tariffPlans.form.planName")}</label>

              <input
                name="planName"
                value={form.planName}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Residential Plan"
              />
            </div>

            


            <div className="mg-form-group">
              <label>{t("tariffPlans.form.fixedCharge")}</label>

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
              <label>{t("tariffPlans.form.effectiveFrom")}</label>

              <input
                type="date"
                name="effectiveFrom"
                value={form.effectiveFrom}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="mg-form-group">
              <label>{t("tariffPlans.form.effectiveTo")}</label>

              <input
                type="date"
                name="effectiveTo"
                value={form.effectiveTo}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="mg-form-group mg-form-group-full">
              <label>{t("tariffPlans.form.description")}</label>

              <textarea
                rows={4}
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder={t("tariffPlans.form.descriptionPlaceholder")}
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
            {t("tariffPlans.form.tariffTiers")}
        </h3>

        <button
            type="button"
            className="mg-secondary-button"
            onClick={addTier}
            disabled={isSubmitting}
        >
            <Plus size={16} />
            {t("tariffPlans.form.addTier")}
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

                        {t("tariffPlans.form.uptoKl")}

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
                        placeholder={t("tariffPlans.form.uptoKlPlaceholder")}
                        disabled={isSubmitting}
                    />

                </div>

                <div className="mg-form-group">

                        <label>

                            {t("tariffPlans.form.ratePerKl")}

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
                                {t("tariffPlans.form.remove")}
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
              {t("tariffPlans.form.cancel")}
            </button>

            <button
              type="submit"
              className="mg-primary-button"
              disabled={isSubmitting}
            >
              <Save size={17} />

              {isSubmitting
                ? editingId
                  ? t("tariffPlans.form.updating")
                  : t("tariffPlans.form.saving")
                : editingId
                ? t("tariffPlans.form.updateTitle")
                : t("tariffPlans.form.savePlan")}
            </button>
          </div>
        </form>
      </section>)
    }
            <section className="mg-panel">
        <div className="mg-toolbar">
          <div>
            <h2>{t("tariffPlans.recordsTitle")}</h2>
            <p>
              {t("tariffPlans.recordsSubtitle")}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="mg-empty-state">
            <Loader2
              size={36}
              className="animate-spin"
            />
            <h3>{t("tariffPlans.loading")}</h3>
            <p>
              {t("tariffPlans.pleaseWait")}
            </p>
          </div>
        ) : filteredTariffPlans.length > 0 ? (
          <div className="mg-table-wrapper">
            <table className="mg-table">
              <thead>
                <tr>
                  <th>{t("tariffPlans.table.planName")}</th>
                  <th>{t("tariffPlans.table.tariffSlabs")}</th>
                  <th>{t("tariffPlans.table.fixedCharge")}</th>
                  <th>{t("tariffPlans.table.effective")}</th>
                  <th>{t("tariffPlans.table.actions")}</th>
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

                                ? `${previous}+ ${t("tariffPlans.table.klUnit")}`

                                : `${previous} - ${tier.uptoKl} ${t("tariffPlans.table.klUnit")}`

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
                        {t("tariffPlans.table.edit")}
                      </button>

                      <button
                        type="button"
                        className="mg-action-button"
                        onClick={() =>
                          setDeleteId(plan.id)
                        }
                      >
                        <Trash2 size={16} />
                        {t("tariffPlans.table.delete")}
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
            title={t("tariffPlans.noPlansFound")}
            description={t("tariffPlans.noPlansDesc")}
          />
        )}
      </section>
    </AdminPageShell>
    <ConfirmDialog
        open={deleteId !== null}
        title={t("tariffPlans.deleteDialog.title")}
        message={t("tariffPlans.deleteDialog.message")}
        confirmText={t("tariffPlans.deleteDialog.confirm")}
        cancelText={t("tariffPlans.deleteDialog.cancel")}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        />
        </>
  );

}

export default TariffPlans;