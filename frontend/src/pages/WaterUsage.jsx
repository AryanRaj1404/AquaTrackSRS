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
  Home,
  ClipboardList,
  BarChart3,
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

    const displayedLogs = filteredUsageLogs;

    const totalUsage = displayedLogs.reduce(
        (sum, log) => sum + Number(log.litersConsumed),
        0
    );

    const totalLogs = displayedLogs.length;

    const averageUsage =
        totalLogs === 0
            ? 0
            : totalUsage / totalLogs;

    const displayedHouseholds = new Set(
        displayedLogs.map(log => log.householdId)
    ).size;

  return (
    <AdminPageShell
        title="Water Usage Management"
        description="Track and manage household water consumption records."
        searchPlaceholder="Search by household, apartment or date..."
        action={
            <div className="flex flex-wrap items-center gap-3">

        <select
            className="mg-select min-w-[220px]"
            value={selectedBillingCycle}
            onChange={(e) => setSelectedBillingCycle(e.target.value)}
        >
            <option value="">
                All Billing Cycles
            </option>

            {billingCycles.map((cycle) => (
                <option
                    key={cycle.id}
                    value={cycle.id}
                >
                    {cycle.apartmentName} •{" "}
                    {new Date(cycle.startDate).toLocaleString(
                        "en-US",
                        {
                            month: "long",
                            year: "numeric",
                        }
                    )}
                </option>
            ))}
        </select>

        <button
            type="button"
            className="mg-secondary-button flex items-center gap-2"
            onClick={() =>
                document.getElementById("csvUpload").click()
            }
        >
            <Upload size={18} />
            Upload CSV
        </button>

        <button
            type="button"
            className="mg-primary-button flex items-center gap-2"
            onClick={openAddModal}
        >
            <Plus size={18} />
            Add Reading
        </button>

        <input
            id="csvUpload"
            hidden
            type="file"
            accept=".csv"
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
                delay={0}
            />

            <StatCard
                icon={Home}
                title="Households"
                value={displayedHouseholds}
                description="Households in current view"
                delay={0.1}
            />

            <StatCard
                icon={ClipboardList}
                title="Readings"
                value={totalLogs}
                description="Usage records"
                delay={0.2}
            />

            <StatCard
                icon={BarChart3}
                title="Average Consumption"
                value={`${averageUsage.toFixed(0)} L`}
                description="Per recorded reading"
                delay={0.3}
            />

        </section>

        <section className="mg-panel">

    <div>

        <div className="mg-toolbar">
            <div>

    <h2>
        Water Usage Records
    </h2>
    <p>
        Track, filter and manage household water consumption records.
    </p>
    </div>

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
                <th>Household</th>
                <th>Reading Date</th>
                <th>Consumption</th>
                <th>Source</th>
                <th>Action</th>
                </tr>
            </thead>

            <tbody>

                {filteredUsageLogs.map((log) => (

                <tr className="hover:bg-slate-50 transition-colors"
                key={log.id}>

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
                        <td className="font-semibold text-slate-800"
                        >{log.litersConsumed} L</td>
                    <td>
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium
                        ${
                            log.source === "MANUAL_ENTRY"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-sky-100 text-sky-700"
                        }`}
                    >
                        {log.source === "MANUAL_ENTRY"
                            ? "Manual"
                            : "CSV"}
                    </span>
                    </td>

                    <td>
                    <div className="flex justify-center gap-2">
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
            description="Start by adding a manual reading or uploading a CSV file."
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
                                    {cycle.apartmentName} • {cycle.apartmentName} • {new Date(cycle.startDate).toLocaleString(
                                        "en-US",
                                        {
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
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