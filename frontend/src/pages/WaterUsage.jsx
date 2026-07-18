import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  Droplets,
  Plus,
  Save,
  Loader2,
  Edit3,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  getUsageLogs,
  createUsageLog,
  updateUsageLog,
  deleteUsageLog,
  uploadCsv,
} from "../services/usageLogService";

import { getHouseholds } from "../services/householdService";
import { getBillingCycles } from "../services/billingCycleService";

const emptyForm = {
        householdId: "",
        billingCycleId: "",
        usageDate: "",
        litersConsumed: "",
        };

function WaterUsage() {
    
    const [usageLogs, setUsageLogs] = useState([]);
    const [households, setHouseholds] = useState([]);
    const [billingCycles, setBillingCycles] = useState([]);
    const [selectedBillingCycle, setSelectedBillingCycle] = useState("");

    const [query, setQuery] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState(emptyForm);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [usageToDelete, setUsageToDelete] = useState(null);

    const [csvFile, setCsvFile] = useState(null);

    useEffect(() => {
        loadUsageLogs();
        }, []);

    const loadUsageLogs = async () => {
    try {
        setIsLoading(true);

        const [usageData,
            householdData,
            billingCycleData
        ] = await Promise.all([
        getUsageLogs(),
        getHouseholds(),
        getBillingCycles(),
        ]);

        setUsageLogs(Array.isArray(usageData) ? usageData : []);
        setHouseholds(Array.isArray(householdData) ? householdData : []);
        setBillingCycles(Array.isArray(billingCycleData)? billingCycleData : []);

    } catch (error) {
        console.error(error);

        toast.error("Unable to load water usage logs.");

        setUsageLogs([]);

    } finally {
        setIsLoading(false);
    }
    };


    const filteredUsageLogs = useMemo(() => {
    const keyword = query.toLowerCase();

    return usageLogs.filter((log) => {
        return (
        log.flatNumber?.toLowerCase().includes(keyword) ||
        log.apartmentName?.toLowerCase().includes(keyword)
        );
    });
    }, [usageLogs, query]);

    const openAddModal = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowModal(true);
        };

    const openEditModal = (log) => {
    setEditingId(log.id);

    setForm({
        householdId: log.householdId,
        billingCycleId: log.billingCycleId ?? "",
        usageDate: log.usageDate,
        litersConsumed: log.litersConsumed,
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

    const validateForm = () => {
    if (!form.householdId) {
        toast.error("Please select a household.");
        return false;
    }

    if (!form.billingCycleId) {
        toast.error("Please select a billing cycle.");
        return false;
    }

    if (!form.usageDate) {
        toast.error("Please select a usage date.");
        return false;
    }

    if (!form.litersConsumed) {
        toast.error("Please enter liters consumed.");
        return false;
    }

    return true;
    };

    const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const payload = {
        householdId: Number(form.householdId),
        billingCycleId: Number(form.billingCycleId),
        usageDate: form.usageDate,
        litersConsumed: Number(form.litersConsumed),
    };

    setIsSubmitting(true);

    const loadingToast = toast.loading(
        editingId
        ? "Updating usage log..."
        : "Saving usage log..."
    );

    try {

        if (editingId) {

        await updateUsageLog(editingId, payload);

        toast.success("Usage log updated successfully.", {
            id: loadingToast,
        });

        } else {

        await createUsageLog(payload);

        toast.success("Usage log created successfully.", {
            id: loadingToast,
        });

        }

        await loadUsageLogs();

        closeModal();

    } catch (error) {

        console.error(error);

        toast.error(
        error.response?.data?.message ??
        "Unable to save usage log.",
        {
            id: loadingToast,
        }
        );

    } finally {

        setIsSubmitting(false);

    }
    };

    const confirmDelete = async () => {
    if (!usageToDelete) return;

    const loadingToast = toast.loading(
        "Deleting usage log..."
    );

    try {

        await deleteUsageLog(usageToDelete.id);

        toast.success(
        "Usage log deleted successfully.",
        {
            id: loadingToast,
        }
        );

        await loadUsageLogs();

    } catch (error) {

        console.error(error);

        toast.error(
        "Unable to delete usage log.",
        {
            id: loadingToast,
        }
        );

    } finally {

        setShowDeleteDialog(false);
        setUsageToDelete(null);

    }
    };

    const handleCsvUpload = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    if (!selectedBillingCycle) {

            toast.error("Select a billing cycle first.");

            return;

        }

    const loadingToast = toast.loading(
        "Uploading CSV..."
    );

    try {

        

        await uploadCsv(
            file,
            selectedBillingCycle
        );

        toast.success(
        "CSV uploaded successfully.",
        {
            id: loadingToast,
        }
        );

        await loadUsageLogs();

    } catch (error) {

        console.error(error);

        toast.error(
            error.response?.data?.message ||
            error.response?.data ||
            "CSV upload failed.",
            {
                id: loadingToast,
            }
        );

    } finally {

        event.target.value = "";

    }
    };

    const totalUsage = usageLogs.reduce(
    (sum, log) => sum + Number(log.litersConsumed),
    0
    );

    const totalLogs = usageLogs.length;

    const manualEntries = usageLogs.filter(
    (log) => log.source === "MANUAL_ENTRY"
    ).length;

    const latestDate =
    usageLogs.length > 0
        ? new Date(usageLogs[0].usageDate).toLocaleDateString(
            "en-GB",
            {
            day: "2-digit",
            month: "short",
            year: "numeric",
            }
        )
        : "-";
  return (
    <AdminPageShell
    searchPlaceholder="Search by household and apartment..."
        action={
            <div style={{ display: "flex", gap: "10px" }}>
                <select
                    className="mg-select"
                    value={selectedBillingCycle}
                    onChange={(e) =>
                        setSelectedBillingCycle(e.target.value)
                    }
                >

                    <option value="">
                        Billing Cycle
                    </option>

                    {billingCycles.map((cycle) => (

                        <option
                            key={cycle.id}
                            value={cycle.id}
                        >
                            {cycle.apartmentName} • {cycle.startDate}
                        </option>

                    ))}

                </select>

                <button
                type="button"
                className="mg-secondary-button"
                onClick={() =>
                    document.getElementById("csvUpload").click()
                }
                >
                <Upload size={18} />
                Upload CSV
                </button>

                <button
                type="button"
                className="mg-primary-button"
                onClick={openAddModal}
                >
                <Plus size={18} />
                Add Reading
                </button>

                <input
                id="csvUpload"
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={handleCsvUpload}
                />
            </div>
        }
    >
        <section className="mg-summary-grid">

            <StatCard
                icon={Droplets}
                title="Total Usage"
                value={`${totalUsage.toFixed(0)} L`}
                description="Total recorded consumption"
            />

            <StatCard
                icon={Droplets}
                title="Usage Logs"
                value={totalLogs}
                description="Recorded entries"
            />

            <StatCard
                icon={Droplets}
                title="Manual Entries"
                value={manualEntries}
                description="Entered by admin"
            />

            <StatCard
                icon={Droplets}
                title="Latest Reading"
                value={latestDate}
                description="Most recent usage log"
            />

        </section>

        <section className="mg-panel">

            <div className="mg-toolbar">

                <div>
                <h2>Water Usage Records</h2>

                <p>
                    Household water consumption logs.
                </p>

                </div>

            </div>
        

        {isLoading ? (
        <div className="mg-empty-state">
            <Loader2
            size={36}
            className="animate-spin"
            />

            <h3>Loading usage logs</h3>

            <p>Please wait while usage logs are fetched.</p>
        </div>
        ) : filteredUsageLogs.length > 0 ? (

        <div className="mg-table-wrapper">

            <table className="mg-table">

            <thead>
                <tr>
                <th>Apartment</th>
                <th>Flat</th>
                <th>Usage Date</th>
                <th>Liters</th>
                <th>Source</th>
                <th>Action</th>
                </tr>
            </thead>

            <tbody>

                {filteredUsageLogs.map((log) => (

                <tr key={log.id}>

                    <td>{log.apartmentName}</td>

                    <td>{log.flatNumber}</td>

                    <td>
                    {new Date(log.usageDate).toLocaleDateString(
                        "en-GB",
                        {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        }
                    )}
                    </td>

                    <td>{log.litersConsumed} L</td>

                    <td>
                    <span className="mg-status mg-status-active">
                        {log.source.replaceAll("_", " ")}
                    </span>
                    </td>

                    <td>
                    <div
                        style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                        }}
                    >
                        <button
                        type="button"
                        className="mg-action-button"
                        onClick={() => openEditModal(log)}
                        >
                        <Edit3 size={15} />
                        </button>

                        <button
                        type="button"
                        className="mg-action-button"
                        onClick={() => {
                            setUsageToDelete(log);
                            setShowDeleteDialog(true);
                        }}
                        >
                        <Trash2 size={15} />
                        </button>
                    </div>
                    </td>

                </tr>

                ))}

            </tbody>

            </table>

        </div>

        ) : (

        <EmptyState
            icon={Droplets}
            title="No usage logs found"
            description="Create your first water usage record."
        />

        )}
        </section>

        {showModal && (
            <div className="mg-modal-overlay">
                <div className="mg-modal">

                <div className="mg-toolbar">
                    <div>
                    <h2>
                        {editingId ? "Edit Reading" : "Add Reading"}
                    </h2>

                    <p>
                        Record household water consumption.
                    </p>
                    </div>

                    <button
                    type="button"
                    className="mg-cancel-button"
                    onClick={closeModal}
                    >
                    <X size={16} />
                    Close
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="mg-form-grid">

                    <div className="mg-form-group">

                        <label>Billing Cycle</label>

                        <select
                            name="billingCycleId"
                            value={form.billingCycleId}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        >

                            <option value="">
                                Select Billing Cycle
                            </option>

                            {billingCycles.map((cycle) => (

                                <option
                                    key={cycle.id}
                                    value={cycle.id}
                                >
                                    {cycle.apartmentName} • {cycle.startDate} - {cycle.endDate}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="mg-form-group">

                        <label>Household</label>

                        <select
                        name="householdId"
                        value={form.householdId}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        >
                        <option value="">
                            Select Household
                        </option>

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

                        <label>Usage Date</label>

                        <input
                        type="date"
                        name="usageDate"
                        value={form.usageDate}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        />

                    </div>

                    <div className="mg-form-group">

                        <label>Liters Consumed</label>

                        <input
                        type="number"
                        name="litersConsumed"
                        value={form.litersConsumed}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder="550"
                        />

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

                    <button
                        type="submit"
                        className="mg-primary-button"
                        disabled={isSubmitting}
                    >
                        <Save size={16} />
                        {isSubmitting
                            ? "Saving..."
                            : editingId
                            ? "Update Reading"
                            : "Save Reading"}
                    </button>

                    </div>

                </form>

                </div>
            </div>
            )}
            <ConfirmDialog
                open={showDeleteDialog}
                title="Delete Usage Log"
                message={
                    usageToDelete
                    ? `Delete usage record for Flat ${usageToDelete.flatNumber}?`
                    : ""
                }
                onCancel={() => {
                    setShowDeleteDialog(false);
                    setUsageToDelete(null);
                }}
                onConfirm={confirmDelete}
                />

    </AdminPageShell>
    
  )
}

export default WaterUsage;