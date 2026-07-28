import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  Loader2,
  Droplets,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import WaterUsageStats from "../components/water-usage/WaterUsageStats";
import WaterUsageTable from "../components/water-usage/WaterUsageTable";
import WaterUsageFormModal from "../components/water-usage/WaterUsageFormModal";
import WaterUsageActions from "../components/water-usage/WaterUsageActions";

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
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState(emptyForm);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [usageToDelete, setUsageToDelete] = useState(null);

    const PAGE_SIZE = 20;

    const [page, setPage] = useState(0);

    const [pageData, setPageData] = useState(null);

    useEffect(() => {

    const timer = setTimeout(() => {

        setDebouncedQuery(query.trim());

    }, 300);

    return () => clearTimeout(timer);

}, [query]);

useEffect(() => {

    setPage(0);

}, [query]);

    useEffect(() => {
        loadUsageLogs();
        }, [page, debouncedQuery]);

    const loadUsageLogs = async () => {
    try {
        setIsLoading(true);

        const [

    usagePage,

    householdData,

    billingCycleData,

] = await Promise.all([

    getUsageLogs(
        page,
        PAGE_SIZE,
        debouncedQuery
    ),

    getHouseholds(),

    getBillingCycles(),

]);

setUsageLogs(usagePage.content);

setPageData(usagePage);

setHouseholds(Array.isArray(householdData) ? householdData : []);

setBillingCycles(
    Array.isArray(billingCycleData)
        ? billingCycleData
        : []
);

    } catch (error) {
        console.error(error);

        toast.error("Unable to load water usage logs.");

        setUsageLogs([]);

    } finally {
        setIsLoading(false);
    }
    };
    
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

    const displayedLogs = usageLogs;

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
        searchValue={query}
        onSearchChange={(value) => {
            setPage(0);
            setQuery(value);
        }}
        searchPlaceholder="Search by household, apartment or date..."
        action={

            <WaterUsageActions

                billingCycles={billingCycles}

                selectedBillingCycle={selectedBillingCycle}

                setSelectedBillingCycle={setSelectedBillingCycle}

                handleCsvUpload={handleCsvUpload}

                openAddModal={openAddModal}

            />

        }
    >

        <WaterUsageStats

            totalUsage={totalUsage}

            displayedHouseholds={displayedHouseholds}

            totalLogs={totalLogs}

            averageUsage={averageUsage}

        />

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
        ) : displayedLogs.length > 0 ? (

        <WaterUsageTable

            displayedLogs={displayedLogs}

            page={page}

            pageData={pageData}

            setPage={setPage}

            openEditModal={openEditModal}

            setUsageToDelete={setUsageToDelete}

            setShowDeleteDialog={setShowDeleteDialog}

        />

        

        ) : (

        <EmptyState
            icon={Droplets}
            title="No usage logs found"
            description="Start by adding a manual reading or uploading a CSV file."
        />

        )}
        </section>

        <WaterUsageFormModal

            showModal={showModal}

            editingId={editingId}

            form={form}

            billingCycles={billingCycles}

            households={households}

            handleInputChange={handleInputChange}

            handleSubmit={handleSubmit}

            closeModal={closeModal}

            isSubmitting={isSubmitting}

        />
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