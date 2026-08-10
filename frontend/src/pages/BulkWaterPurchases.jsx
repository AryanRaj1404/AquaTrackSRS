import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {useWorkspace} from "../context/WorkspaceContext";

import {
    Loader2,
    Truck 
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import BulkWaterStats from "../components/bulk-water/BulkWaterStats";
import BulkWaterTable from "../components/bulk-water/BulkWaterTable";
import BulkWaterFormModal from "../components/bulk-water/BulkWaterFormModal";
import BulkWaterActions from "../components/bulk-water/BulkWaterActions";

import {

    getPurchases,

    createPurchase,

    updatePurchase,

    deletePurchase,

} from "../services/bulkWaterPurchaseService";

import {
    getBillingCycles,
} from "../services/billingCycleService";

import {
    getApartments,
} from "../services/apartmentService";

const PAGE_SIZE = 20;

function BulkWaterPurchases() {
    const { t } = useTranslation();
    const { workspace } = useWorkspace();

    const [purchases, setPurchases] = useState([]);

    const [page, setPage] = useState(0);

    const [pageData, setPageData] = useState(null);

    const [billingCycles, setBillingCycles] =
        useState([]);

    const [apartments, setApartments] =
        useState([]);

    const [query, setQuery] =
        useState("");

    const [isLoading, setIsLoading] =
        useState(true);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [editingPurchase, setEditingPurchase] =
        useState(null);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const [purchaseToDelete, setPurchaseToDelete] = useState(null);

    const [form, setForm] =
        useState({

            apartmentId: "",

            billingCycleId: "",

            purchaseDate: "",

            source: "TANKER",

            volumeKl: "",

            unitCost: "",

            supplier: "",

        });

    useEffect(() => {

        loadData();

    }, [page, workspace]);

const loadData = async () => {

    try {

        setIsLoading(true);

        const [

            purchaseData,

            billingData,

            apartmentData,

        ] = await Promise.all([

            getPurchases(page, PAGE_SIZE),

            getBillingCycles(),

            getApartments(),

        ]);

        setPurchases(purchaseData.content);

        setPageData(purchaseData);

        setBillingCycles(billingData);

        setApartments(apartmentData.content);

    }

    catch (error) {

        console.error(error);

        toast.error(
            t("bulkWaterPurchases.toasts.loadError")
        );

    }

    finally {

        setIsLoading(false);

    }
};

    const resetForm = () => {

    setEditingPurchase(null);

    setForm({

        apartmentId: "",

        billingCycleId: "",

        purchaseDate: "",

        source: "TANKER",

        volumeKl: "",

        unitCost: "",

        supplier: "",

    });

};

const openCreateModal = () => {

    resetForm();

    setIsModalOpen(true);

};

const openEditModal = (purchase) => {

    setEditingPurchase(purchase);

    setForm({

        apartmentId: purchase.apartmentId,

        billingCycleId: purchase.billingCycleId,

        purchaseDate: purchase.purchaseDate,

        source: purchase.source,

        volumeKl: purchase.volumeKl,

        unitCost: purchase.unitCost,

        supplier: purchase.supplier,

    });

    setIsModalOpen(true);

};

const handleChange = (event) => {

    const {

        name,

        value,

    } = event.target;

    setForm(

        previous => ({

            ...previous,

            [name]: value,

        })

    );

};

const handleSubmit = async (event) => {

    event.preventDefault();

    try {

        if (editingPurchase) {

            await updatePurchase(

                editingPurchase.id,

                form

            );

            toast.success(

                t("bulkWaterPurchases.toasts.updateSuccess")

            );

        }

        else {

            await createPurchase(form);

            toast.success(

                t("bulkWaterPurchases.toasts.createSuccess")

            );

        }

        setIsModalOpen(false);

        resetForm();

        await loadData();

    }

    catch (error) {

        console.error(error);

        toast.error(

            error.response?.data?.message ||

            error.response?.data ||

            t("bulkWaterPurchases.toasts.saveError")

        );

    }

};

const handleDelete = async () => {

    if (!purchaseToDelete) {
        return;
    }

    try {

        await deletePurchase(purchaseToDelete.id);

        toast.success(t("bulkWaterPurchases.toasts.deleteSuccess"));

        setShowDeleteDialog(false);

        setPurchaseToDelete(null);

        loadData();

    }
    catch (error) {

        console.error(error);

        toast.error(
            error.response?.data?.message ||
            error.response?.data ||
            t("bulkWaterPurchases.toasts.deleteError")
        );
    }
};

const filteredPurchases = useMemo(() => {

    const keyword =

        query.toLowerCase();

    return purchases.filter(

        purchase =>

            purchase.supplier

                ?.toLowerCase()

                .includes(keyword)

            ||

            purchase.source

                ?.toLowerCase()

                .includes(keyword)

    );

}, [

    purchases,

    query,

]);

const totalPurchases =

    pageData?.totalElements ?? 0

const totalVolume =

    purchases.reduce(

        (sum, purchase) =>

            sum +

            Number(

                purchase.volumeKl

            ),

        0

    );

const totalCost =

    purchases.reduce(

        (sum, purchase) =>

            sum +

            Number(

                purchase.totalCost

            ),

        0

    );

const averageRate =

    totalVolume > 0

        ? totalCost / totalVolume

        : 0;

    
const filteredBillingCycles = billingCycles.filter(
    cycle =>
        String(cycle.apartmentId) ===
        String(form.apartmentId)
);

  return (
    <>

<AdminPageShell
    title={t("bulkWaterPurchases.pageTitle")}
    description={t("bulkWaterPurchases.pageDesc")}
    searchPlaceholder={t("bulkWaterPurchases.searchPlaceholder")}
    searchValue={query}
    onSearchChange={setQuery}
    action={
        <BulkWaterActions
            openCreateModal={openCreateModal}
        />
    }
>

<BulkWaterStats

    totalPurchases={totalPurchases}

    totalVolume={totalVolume}

    totalCost={totalCost}

    averageRate={averageRate}

/>

<section className="mg-panel">

<div className="mg-toolbar">

    <div>

        <h2 >
            {t("bulkWaterPurchases.recordsTitle")}
        </h2>

        <p >
            {t("bulkWaterPurchases.recordsSubtitle")}
        </p>

    </div>

</div>

{

isLoading ?

<div className="mg-loading">

<Loader2
className="mg-spin"
size={28}
/>

</div>

:

filteredPurchases.length === 0 ?

<EmptyState

icon={Truck}

title={t("bulkWaterPurchases.noPurchasesFound")}

description={t("bulkWaterPurchases.noPurchasesDesc")}

/>

:
<BulkWaterTable

    purchases={filteredPurchases}

    page={page}

    pageData={pageData}

    setPage={setPage}

    openEditModal={openEditModal}

    setPurchaseToDelete={setPurchaseToDelete}

    setShowDeleteDialog={setShowDeleteDialog}

/>

}

</section>

<BulkWaterFormModal

    showModal={isModalOpen}

    editingPurchase={editingPurchase}

    form={form}

    apartments={apartments}

    filteredBillingCycles={filteredBillingCycles}

    setForm={setForm}

    handleChange={handleChange}

    handleSubmit={handleSubmit}

    closeModal={() => {

        setIsModalOpen(false);

        resetForm();

    }}

/>

</AdminPageShell>
<ConfirmDialog
    open={showDeleteDialog}
    title={t("bulkWaterPurchases.deleteDialog.title")}
    message={t("bulkWaterPurchases.deleteDialog.message")}
    confirmText={t("bulkWaterPurchases.deleteDialog.confirm")}
    cancelText={t("bulkWaterPurchases.deleteDialog.cancel")}
    onConfirm={handleDelete}
    onCancel={() => {
        setShowDeleteDialog(false);
        setPurchaseToDelete(null);
    }}
/>
</>
);
}

export default BulkWaterPurchases;