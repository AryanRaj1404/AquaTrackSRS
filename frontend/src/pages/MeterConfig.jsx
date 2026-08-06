import { useEffect, useMemo, useState } from "react";
import { getHouseholds } from "../services/householdService";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  CheckCircle2,
  Clock3,
  Edit3,
  Gauge,
  Plus,
  Trash2,
  X,
  Zap,
} from "lucide-react";

import {
  getMeters,
  createMeter,
  updateMeter,
  deleteMeter,
} from "../services/meterService";

import AdminPageShell from "../components/AdminPageShell";

const emptyForm = {
  meterNumber: "",
  meterType: "DIGITAL",
  installedDate: "",
  householdId: "",
};

function MeterConfig() {
  const { t } = useTranslation();
  const [meters, setMeters] = useState([]);
  const [households, setHouseholds] = useState([]); 
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [meterToDelete, setMeterToDelete] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadMeters();
  }, []);

  const loadMeters = async () => {
  try {
    const [meterData, householdData] = await Promise.all([
    getMeters(),
    getHouseholds(),
  ]);

  setMeters(Array.isArray(meterData) ? meterData : []);

  setHouseholds(Array.isArray(householdData) ? householdData : []);

  } catch (error) {
    console.error(error);
    toast.error(t("meterConfig.toasts.loadError"));
    setMeters([]);

  }
};

  const filteredMeters = useMemo(() => {
  const keyword = query.toLowerCase();

  return meters.filter((meter) => {
    const matchesSearch =
      meter.meterNumber?.toLowerCase().includes(keyword) ||
      meter.flatNumber?.toLowerCase().includes(keyword) ||
      meter.apartmentName?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && meter.active) ||
      (statusFilter === "Inactive" && !meter.active);

    return matchesSearch && matchesStatus;
  });
}, [meters, query, statusFilter]);

  const activeMeters = meters.filter(
    (meter) => meter.active
  ).length;

  const inactiveMeters = meters.filter(
    (meter) => !meter.active
  ).length;

  const digitalMeters = meters.filter(
    (meter) => meter.meterType === "DIGITAL"
  ).length;

  const openAddModal = () => {
    setEditingId(null);

    setForm(emptyForm);

    setShowModal(true);
  };

  const openEditModal = (meter) => {
    setEditingId(meter.id);

    setForm({
      meterNumber: meter.meterNumber,
      meterType: meter.meterType,
      installedDate: meter.installedDate,
      householdId: meter.householdId,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (
    !form.meterNumber.trim() ||
    !form.householdId ||
    !form.installedDate
  ) {
    toast.error(t("meterConfig.toasts.completeDetails"));
    return;
  }

  const meterPayload = {
    meterNumber: form.meterNumber.trim(),
    meterType: form.meterType,
    installedDate: form.installedDate,
    householdId: Number(form.householdId),
  };

  const loadingToast = toast.loading(
    editingId ? t("meterConfig.toasts.updating") : t("meterConfig.toasts.creating")
  );

  try {
    if (editingId) {
      await updateMeter(editingId, meterPayload);

      toast.success(t("meterConfig.toasts.updateSuccess"), {
        id: loadingToast,
      });
    } else {
      await createMeter(meterPayload);

      toast.success(t("meterConfig.toasts.createSuccess"), {
        id: loadingToast,
      });
    }

    await loadMeters();

    closeModal();
  } catch (error) {
    console.error(error);

    toast.error(
      editingId
        ? t("meterConfig.toasts.updateError")
        : t("meterConfig.toasts.createError"),
      {
        id: loadingToast,
      }
    );
  }
};

  const handleDelete = (meter) => {
    setMeterToDelete(meter);
    setShowDeleteDialog(true);
  };
  const confirmDelete = async () => {
    if (!meterToDelete) {
      return;
    }

    const loadingToast = toast.loading(t("meterConfig.toasts.deleting"));

    try {
      await deleteMeter(meterToDelete.id);

      await loadMeters();

      toast.success(t("meterConfig.toasts.deleteSuccess"), {
        id: loadingToast,
      });

      setShowDeleteDialog(false);
      setMeterToDelete(null);
    } catch (error) {
      console.error(error);

      toast.error(t("meterConfig.toasts.deleteError"), {
        id: loadingToast,
      });
    }
  };

  return (
    <AdminPageShell
      title={t("meterConfig.pageTitle")}
      description={t("meterConfig.pageDesc")}
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder={t("meterConfig.searchPlaceholder")}
      action={
        <button
          type="button"
          className="mg-primary-button"
          onClick={openAddModal}
        >
          <Plus size={18} />
          {t("meterConfig.addMeter")}
        </button>
      }
    >
      <section className="mg-summary-grid">
        <article className="mg-summary-card">
          <div className="mg-summary-icon">
            <Gauge size={22} />
          </div>

          <div>
            <p>{t("meterConfig.stats.totalTitle")}</p>
            <h2>{meters.length}</h2>
          </div>
        </article>

        <article className="mg-summary-card">
          <div className="mg-summary-icon">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <p>{t("meterConfig.stats.activeTitle")}</p>
            <h2>{activeMeters}</h2>
          </div>
        </article>

        <article className="mg-summary-card">
          <div className="mg-summary-icon">
            <Clock3 size={22} />
          </div>

          <div>
            <p>{t("meterConfig.stats.inactiveTitle")}</p>
            <h2>{inactiveMeters}</h2>
          </div>
        </article>

        <article className="mg-summary-card">
          <div className="mg-summary-icon">
            <Zap size={22} />
          </div>

          <div>
            <p>{t("meterConfig.stats.digitalTitle")}</p>
            <h2>{digitalMeters}</h2>
          </div>
        </article>
      </section>

      <section className="mg-panel">
        <div className="mg-toolbar">
          <div>
            <h2>{t("meterConfig.recordsTitle")}</h2>
            <p>{t("meterConfig.recordsSubtitle")}</p>
          </div>

          <select
            className="mg-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">{t("meterConfig.filters.all")}</option>
            <option value="Active">{t("meterConfig.filters.active")}</option>
            <option value="Inactive">{t("meterConfig.filters.inactive")}</option>
          </select>
        </div>

        <div className="mg-table-wrapper">
          <table className="mg-table">
            <thead>
              <tr>
                <th>{t("meterConfig.table.meterNumber")}</th>
                <th>{t("meterConfig.table.apartment")}</th>
                <th>{t("meterConfig.table.flat")}</th>
                <th>{t("meterConfig.table.meterType")}</th>
                <th>{t("meterConfig.table.installedDate")}</th>
                <th>{t("meterConfig.table.status")}</th>
                <th>{t("meterConfig.table.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {filteredMeters.map((meter) => (
                <tr className="hover:bg-slate-50 transition-colors"
                key={meter.id}>
                  <td>
                    <span className="mg-table-primary">
                      {meter.meterNumber}
                    </span>
                  </td>

                  <td>{meter.apartmentName}</td>

                  <td>{meter.flatNumber}</td>

                  <td>{meter.meterType}</td>

                  <td>
                    {new Date(meter.installedDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <span
                      className={`mg-status ${
                        meter.active
                          ? "mg-status-active"
                          : "mg-status-pending"
                      }`}
                    >
                      {meter.active ? t("meterConfig.filters.active") : t("meterConfig.filters.inactive")}
                    </span>
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        type="button"
                        className="mg-action-button"
                        onClick={() => openEditModal(meter)}
                        title={t("meterConfig.actions.edit")}
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        type="button"
                        className="mg-action-button"
                        onClick={() => handleDelete(meter)}
                        title={t("meterConfig.actions.delete")}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMeters.length > 0 ? (
            <div className="mg-table-wrapper">
              <table className="mg-table">
                {/* Table */}
              </table>
            </div>
          ) : (
            <div className="mg-empty-state">
              {meters.length === 0
                ? t("meterConfig.noMetersYet")
                : t("meterConfig.noMetersMatch")}
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="mg-modal-overlay">
          <div className="mg-modal">
            <div className="mg-modal-header">
              <div>
                <h2>{editingId ? t("meterConfig.modal.editTitle") : t("meterConfig.modal.addTitle")}</h2>

                <p>
                  {editingId
                    ? t("meterConfig.modal.editDesc")
                    : t("meterConfig.modal.addDesc")}
                </p>
              </div>

              <button
                type="button"
                className="mg-modal-close"
                onClick={closeModal}
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mg-form-grid">
                <div className="mg-form-group">
                  <label htmlFor="meterNumber">{t("meterConfig.form.meterNumber")}</label>

                  <input
                    id="meterNumber"
                    name="meterNumber"
                    type="text"
                    value={form.meterNumber}
                    onChange={handleInputChange}
                    placeholder="AQ-1001"
                  />
                </div>

                <div className="mg-form-group">
                  <label htmlFor="householdId">{t("meterConfig.form.household")}</label>

                  <select
                    id="householdId"
                    name="householdId"
                    value={form.householdId}
                    onChange={handleInputChange}
                  >
                    <option value="">{t("meterConfig.form.selectHousehold")}</option>

                    {households.map((household) => (
                      <option
                        key={household.id}
                        value={household.id}
                      >
                        {household.apartmentName} - {household.flatNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mg-form-group">
                  <label htmlFor="meterType">{t("meterConfig.form.meterType")}</label>

                  <select
                    id="meterType"
                    name="meterType"
                    value={form.meterType}
                    onChange={handleInputChange}
                  >
                    <option value="DIGITAL">DIGITAL</option>
                    <option value="ANALOG">ANALOG</option>
                  </select>
                </div>

                <div className="mg-form-group">
                  <label htmlFor="installednDate">
                    {t("meterConfig.form.installedDate")}
                  </label>

                  <input
                    id="installedDate"
                    name="installedDate"
                    type="date"
                    value={form.installedDate}
                    onChange={handleInputChange}
                  />
                </div>

              </div>

              <div className="mg-modal-actions">
                <button
                  type="button"
                  className="mg-cancel-button"
                  onClick={closeModal}
                >
                  {t("meterConfig.form.cancel")}
                </button>

                <button type="submit" className="mg-primary-button">
                  {editingId ? t("meterConfig.form.saveChanges") : t("meterConfig.addMeter")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={showDeleteDialog}
        title={t("meterConfig.deleteDialog.title")}
        message={
          meterToDelete
            ? t("meterConfig.deleteDialog.message", { meterNumber: meterToDelete.meterNumber })
            : ""
        }
        onCancel={() => {
          setShowDeleteDialog(false);
          setMeterToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </AdminPageShell>
  );
}

export default MeterConfig;
