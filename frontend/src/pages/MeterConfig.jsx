import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  Activity,
  CheckCircle2,
  Clock3,
  Edit3,
  Gauge,
  Plus,
  Trash2,
  X,
  Zap,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";

const initialMeters = [
  {
    id: 1,
    meterNumber: "AQ-1001",
    household: "A-101",
    resident: "Arun Kumar",
    apartment: "Green Valley Apartments",
    meterType: "Digital",
    installationDate: "2026-07-01",
    lastService: "2026-07-04",
    status: "Active",
  },
  {
    id: 2,
    meterNumber: "AQ-1002",
    household: "A-102",
    resident: "Priya S",
    apartment: "Green Valley Apartments",
    meterType: "Digital",
    installationDate: "2026-07-01",
    lastService: "2026-07-04",
    status: "Active",
  },
  {
    id: 3,
    meterNumber: "AQ-1024",
    household: "B-204",
    resident: "Vignesh R",
    apartment: "Lake View Residency",
    meterType: "Analog",
    installationDate: "2026-06-20",
    lastService: "2026-07-02",
    status: "Active",
  },
  {
    id: 4,
    meterNumber: "AQ-1041",
    household: "C-301",
    resident: "Nivetha M",
    apartment: "Sunrise Enclave",
    meterType: "Digital",
    installationDate: "2026-06-25",
    lastService: "Pending",
    status: "Pending",
  },
];

const emptyForm = {
  meterNumber: "",
  household: "",
  resident: "",
  apartment: "Green Valley Apartments",
  meterType: "Digital",
  installationDate: "",
  status: "Active",
};

function MeterConfig() {
  const [meters, setMeters] = useState(initialMeters);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredMeters = useMemo(() => {
    return meters.filter((meter) => {
      const keyword = query.toLowerCase();

      const matchesSearch =
        meter.meterNumber.toLowerCase().includes(keyword) ||
        meter.household.toLowerCase().includes(keyword) ||
        meter.resident.toLowerCase().includes(keyword) ||
        meter.apartment.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" || meter.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [meters, query, statusFilter]);

  const activeMeters = meters.filter((meter) => meter.status === "Active").length;

  const pendingMeters = meters.filter(
    (meter) => meter.status === "Pending"
  ).length;

  const digitalMeters = meters.filter(
    (meter) => meter.meterType === "Digital"
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
      household: meter.household,
      resident: meter.resident,
      apartment: meter.apartment,
      meterType: meter.meterType,
      installationDate: meter.installationDate,
      status: meter.status,
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.meterNumber.trim() ||
      !form.household.trim() ||
      !form.resident.trim() ||
      !form.installationDate
    ) {
      toast.error("Please complete all meter details.");
      return;
    }

    if (editingId) {
      setMeters((previous) =>
        previous.map((meter) =>
          meter.id === editingId
            ? {
                ...meter,
                meterNumber: form.meterNumber.trim(),
                household: form.household.trim(),
                resident: form.resident.trim(),
                apartment: form.apartment,
                meterType: form.meterType,
                installationDate: form.installationDate,
                status: form.status,
              }
            : meter
        )
      );

      toast.success("Meter configuration updated successfully.");
    } else {
      const newMeter = {
        id: Date.now(),
        meterNumber: form.meterNumber.trim(),
        household: form.household.trim(),
        resident: form.resident.trim(),
        apartment: form.apartment,
        meterType: form.meterType,
        installationDate: form.installationDate,
        lastService: "Pending",
        status: form.status,
      };

      setMeters((previous) => [newMeter, ...previous]);

      toast.success("Meter configured successfully.");
    }

    closeModal();
  };

  const handleDelete = (meter) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete meter ${meter.meterNumber}?`
    );

    if (!confirmed) {
      return;
    }

    setMeters((previous) => previous.filter((item) => item.id !== meter.id));

    toast.success("Meter deleted successfully.");
  };

  return (
    <AdminPageShell
      title="Meter Configuration"
      description="Assign and manage water meters for registered households."
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="Search meter, household or resident..."
      action={
        <button
          type="button"
          className="mg-primary-button"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Meter
        </button>
      }
    >
      <section className="mg-summary-grid">
        <article className="mg-summary-card">
          <div className="mg-summary-icon">
            <Gauge size={22} />
          </div>

          <div>
            <p>Total Meters</p>
            <h2>{meters.length}</h2>
          </div>
        </article>

        <article className="mg-summary-card">
          <div className="mg-summary-icon">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <p>Active Meters</p>
            <h2>{activeMeters}</h2>
          </div>
        </article>

        <article className="mg-summary-card">
          <div className="mg-summary-icon">
            <Clock3 size={22} />
          </div>

          <div>
            <p>Pending Meters</p>
            <h2>{pendingMeters}</h2>
          </div>
        </article>

        <article className="mg-summary-card">
          <div className="mg-summary-icon">
            <Zap size={22} />
          </div>

          <div>
            <p>Digital Meters</p>
            <h2>{digitalMeters}</h2>
          </div>
        </article>
      </section>

      <section className="mg-panel">
        <div className="mg-toolbar">
          <div>
            <h2>Configured Meters</h2>
            <p>View household meter assignment and status.</p>
          </div>

          <select
            className="mg-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="mg-table-wrapper">
          <table className="mg-table">
            <thead>
              <tr>
                <th>Meter Number</th>
                <th>Household</th>
                <th>Resident</th>
                <th>Apartment</th>
                <th>Meter Type</th>
                <th>Installed Date</th>
                <th>Last Service</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMeters.map((meter) => (
                <tr key={meter.id}>
                  <td>
                    <span className="mg-table-primary">
                      {meter.meterNumber}
                    </span>

                    <span className="mg-table-secondary">
                      ID: M-{meter.id}
                    </span>
                  </td>

                  <td>{meter.household}</td>

                  <td>{meter.resident}</td>

                  <td>{meter.apartment}</td>

                  <td>{meter.meterType}</td>

                  <td>{meter.installationDate}</td>

                  <td>{meter.lastService}</td>

                  <td>
                    <span
                      className={`mg-status ${
                        meter.status === "Active"
                          ? "mg-status-active"
                          : "mg-status-pending"
                      }`}
                    >
                      {meter.status}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: "flex", gap: "7px" }}>
                      <button
                        type="button"
                        className="mg-action-button"
                        onClick={() => openEditModal(meter)}
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        type="button"
                        className="mg-action-button"
                        onClick={() => handleDelete(meter)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMeters.length === 0 && (
            <div className="mg-empty-state">
              No meters match your search.
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="mg-modal-overlay">
          <div className="mg-modal">
            <div className="mg-modal-header">
              <div>
                <h2>{editingId ? "Edit Meter" : "Add New Meter"}</h2>

                <p>
                  {editingId
                    ? "Update meter and household assignment."
                    : "Configure a water meter for a household."}
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
                  <label htmlFor="meterNumber">Meter number</label>

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
                  <label htmlFor="household">Household</label>

                  <input
                    id="household"
                    name="household"
                    type="text"
                    value={form.household}
                    onChange={handleInputChange}
                    placeholder="A-101"
                  />
                </div>

                <div className="mg-form-group">
                  <label htmlFor="resident">Resident name</label>

                  <input
                    id="resident"
                    name="resident"
                    type="text"
                    value={form.resident}
                    onChange={handleInputChange}
                    placeholder="Arun Kumar"
                  />
                </div>

                <div className="mg-form-group">
                  <label htmlFor="apartment">Apartment</label>

                  <select
                    id="apartment"
                    name="apartment"
                    value={form.apartment}
                    onChange={handleInputChange}
                  >
                    <option value="Green Valley Apartments">
                      Green Valley Apartments
                    </option>

                    <option value="Lake View Residency">
                      Lake View Residency
                    </option>

                    <option value="Sunrise Enclave">
                      Sunrise Enclave
                    </option>

                    <option value="Ocean Breeze Towers">
                      Ocean Breeze Towers
                    </option>
                  </select>
                </div>

                <div className="mg-form-group">
                  <label htmlFor="meterType">Meter type</label>

                  <select
                    id="meterType"
                    name="meterType"
                    value={form.meterType}
                    onChange={handleInputChange}
                  >
                    <option value="Digital">Digital</option>
                    <option value="Analog">Analog</option>
                  </select>
                </div>

                <div className="mg-form-group">
                  <label htmlFor="installationDate">
                    Installation date
                  </label>

                  <input
                    id="installationDate"
                    name="installationDate"
                    type="date"
                    value={form.installationDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mg-form-group mg-form-group-full">
                  <label htmlFor="status">Status</label>

                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="mg-modal-actions">
                <button
                  type="button"
                  className="mg-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="mg-primary-button">
                  {editingId ? "Save Changes" : "Add Meter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminPageShell>
  );
}

export default MeterConfig;