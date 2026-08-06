import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

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
        t("billingCycles.toasts.loadError")
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
        toast.error(t("billingCycles.toasts.selectApartment"));
        return false;
    }

    if (!form.startDate) {
        toast.error(t("billingCycles.toasts.startDateRequired"));
        return false;
    }

    if (!form.endDate) {
        toast.error(t("billingCycles.toasts.endDateRequired"));
        return false;
    }

    if (form.startDate > form.endDate) {
        toast.error(t("billingCycles.toasts.endAfterStart"));
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
        ? t("billingCycles.toasts.updating")
        : t("billingCycles.toasts.creating")
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
            t("billingCycles.toasts.updateSuccess"),
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
            t("billingCycles.toasts.createSuccess"),
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
            ? t("billingCycles.toasts.updateError")
            : t("billingCycles.toasts.createError"),
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
        t("billingCycles.toasts.deleting")
    );

    try {

        await deleteBillingCycle(deleteId);

        setBillingCycles((previous) =>
        previous.filter(
            (cycle) => cycle.id !== deleteId
        )
        );

        toast.success(
        t("billingCycles.toasts.deleteSuccess"),
        {
            id: loadingToast,
        }
        );

        setDeleteId(null);

    } catch (error) {

        console.error(error);

        toast.error(
        t("billingCycles.toasts.deleteError"),
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
      title={t("billingCycles.pageTitle")}
      description={t("billingCycles.pageDesc")}
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder={t("billingCycles.searchPlaceholder")}
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
          {t("billingCycles.addBillingCycle")}
        </button>
      }
    >
      <section className="mg-summary-grid">
        <StatCard
          icon={ReceiptText}
          title={t("billingCycles.stats.totalTitle")}
          value={billingCycles.length}
          description={t("billingCycles.stats.totalDesc")}
          delay={0}
        />

        <StatCard
          icon={CalendarDays}
          title={t("billingCycles.stats.openTitle")}
          value={
            billingCycles.filter(
              (cycle) => cycle.status === "OPEN"
            ).length
          }
          description={t("billingCycles.stats.openDesc")}
          delay={0.1}
        />

        <StatCard
          icon={CheckCircle2}
          title={t("billingCycles.stats.paidTitle")}
          value={
            billingCycles.filter(
              (cycle) => cycle.status === "PAID"
            ).length
          }
          description={t("billingCycles.stats.paidDesc")}
          delay={0.2}
        />

        <StatCard
          icon={ReceiptText}
          title={t("billingCycles.stats.latestTitle")}
          value={
            billingCycles.length > 0
              ? billingCycles[0].apartmentName
              : "-"
          }
          description={
            billingCycles.length > 0
              ? billingCycles[0].status
              : t("billingCycles.stats.noCycles")
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
                  ? t("billingCycles.form.updateTitle")
                  : t("billingCycles.form.createTitle")}
              </h2>

              <p>
                {t("billingCycles.form.desc")}
              </p>
            </div>

            <button
              type="button"
              className="mg-cancel-button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X size={16} />
              {t("billingCycles.form.close")}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mg-form-grid">

              <div className="mg-form-group">
                <label>{t("billingCycles.form.apartment")}</label>

                <select
                  name="apartmentId"
                  value={form.apartmentId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">
                    {t("billingCycles.form.selectApartment")}
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
                <label>{t("billingCycles.form.tariffPlan")}</label>

                <select
                  name="tariffPlanId"
                  value={form.tariffPlanId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">
                    {t("billingCycles.form.selectTariffPlan")}
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
                <label>{t("billingCycles.form.startDate")}</label>

                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="mg-form-group">
                <label>{t("billingCycles.form.endDate")}</label>

                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="mg-form-group">
                <label>{t("billingCycles.form.status")}</label>

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
                {t("billingCycles.form.cancel")}
              </button>

              <button
                type="submit"
                className="mg-primary-button"
                disabled={isSubmitting}
              >
                <Save size={17} />

                {isSubmitting
                  ? editingId
                    ? t("billingCycles.form.updating")
                    : t("billingCycles.form.saving")
                  : editingId
                  ? t("billingCycles.form.updateTitle")
                  : t("billingCycles.form.createTitle")}
              </button>
            </div>
          </form>
        </section>
      )}
      <section className="mg-panel">
        <div className="mg-toolbar">
            <div>
            <h2>{t("billingCycles.recordsTitle")}</h2>
            <p>
                {t("billingCycles.recordsSubtitle")}
            </p>
            </div>
        </div>

        {isLoading ? (
            <div className="mg-empty-state">
            <Loader2
                size={36}
                className="animate-spin"
            />

            <h3>{t("billingCycles.loading")}</h3>

            <p>
                {t("billingCycles.pleaseWait")}
            </p>
            </div>
        ) : filteredBillingCycles.length > 0 ? (
            <div className="mg-table-wrapper">
            <table className="mg-table">
                <thead>
                <tr>
                    <th>{t("billingCycles.table.apartment")}</th>
                    <th>{t("billingCycles.table.tariffPlan")}</th>
                    <th>{t("billingCycles.table.period")}</th>
                    <th>{t("billingCycles.table.status")}</th>
                    <th>{t("billingCycles.table.actions")}</th>
                </tr>
                </thead>

                <tbody>
                {filteredBillingCycles.map((cycle) => (
                    <tr className="hover:bg-slate-50 transition-colors"
                    key={cycle.id}>
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
                        "en-In",
                        {
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
                        className="mg-action-button"
                        onClick={() => handleEdit(cycle)}
                        >
                        <Pencil size={16} />
                        {t("billingCycles.table.edit")}
                        </button>

                        <button
                        type="button"
                        className="mg-action-button"
                        onClick={() =>
                            setDeleteId(cycle.id)
                        }
                        >
                        <Trash2 size={16} />
                        {t("billingCycles.table.delete")}
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
            title={t("billingCycles.noCyclesFound")}
            description={t("billingCycles.noCyclesDesc")}
            />
        )}
        </section>
    </AdminPageShell>
        <ConfirmDialog
            open={deleteId !== null}
            title={t("billingCycles.deleteDialog.title")}
            message={t("billingCycles.deleteDialog.message")}
            confirmText={t("billingCycles.deleteDialog.confirm")}
            cancelText={t("billingCycles.deleteDialog.cancel")}
            onCancel={() => setDeleteId(null)}
            onConfirm={handleDelete}
        />
    </>
    );
}

export default BillingCycles;