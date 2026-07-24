import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {

    Droplets,

    IndianRupee,

    Calendar,

    Truck,

    Plus,

    Search,

    Trash2,

    Loader2,

    Pencil,

} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import ConfirmDialog from "../components/ConfirmDialog";

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

function BulkWaterPurchases() {

    const [purchases, setPurchases] =
    useState([]);

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

}, []);

const loadData = async () => {

    try {

        setIsLoading(true);

        const [

            purchaseData,

            billingData,

            apartmentData,

        ] = await Promise.all([

            getPurchases(),

            getBillingCycles(),

            getApartments(),

        ]);

        setPurchases(purchaseData);

        setBillingCycles(billingData);

        setApartments(apartmentData);

    }

    catch (error) {

        console.error(error);

        toast.error(
            "Unable to load purchases."
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

                "Purchase updated successfully."

            );

        }

        else {

            await createPurchase(form);

            toast.success(

                "Purchase created successfully."

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

            "Unable to save purchase."

        );

    }

};

const handleDelete = async () => {

    if (!purchaseToDelete) {
        return;
    }

    try {

        await deletePurchase(purchaseToDelete.id);

        toast.success("Purchase deleted.");

        setShowDeleteDialog(false);

        setPurchaseToDelete(null);

        loadData();

    }
    catch (error) {

        console.error(error);

        toast.error(
            error.response?.data?.message ||
            error.response?.data ||
            "Unable to delete purchase."
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

    purchases.length;

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
    title="Bulk Water Purchases"
    description="Record and manage tanker and municipal water purchases."
    searchPlaceholder="Search supplier, source or apartment..."
    searchValue={query}
    onSearchChange={setQuery}
    action={
        <button
            type="button"
            className="mg-primary-button flex items-center gap-2"
            onClick={openCreateModal}
        >
            <Plus size={18} />
            Add Purchase
        </button>
    }
>

<section className="mg-summary-grid">

    <StatCard

        icon={Truck}

        title="Purchases"

        value={totalPurchases}

        description="Purchases recorded"

        delay={0}

    />

    <StatCard

        icon={Droplets}

        title="Volume"

        value={`${totalVolume.toFixed(2)} KL`}

        description="Purchased water"

        delay={0.1}

    />

    <StatCard

        icon={IndianRupee}

        title="Total Cost"

        value={`₹ ${totalCost.toLocaleString("en-IN")}`}

        description="Total Expenditure"

        delay={0.2}

    />

    <StatCard

        icon={Calendar}

        title="Average Rate"

        value={`₹ ${averageRate.toFixed(2)}/KL`}

        description="Average purchase rate"

        delay={0.3}

    />

</section>

<section className="mg-panel">

<div className="mg-toolbar">

    <div>

        <h2 >
            Bulk Water Purchases
        </h2>

        <p >
            Record and manage tanker and municipal water purchases.
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

title="No purchases found"

description="Record your first bulk water purchase."

/>

:
<div className="mg-table-wrapper">
<table className="mg-table">

<thead>

<tr>

<th>Date</th>

<th>Apartment</th>

<th>Billing Cycle</th>

<th>Supplier</th>

<th>Source</th>

<th>Volume</th>

<th>Unit Cost</th>

<th>Total Cost</th>

<th className="text-center">Actions</th>

</tr>

</thead>

<tbody>

{

filteredPurchases.map(purchase => {

    const cycle = billingCycles.find(
        b => b.id === purchase.billingCycleId
    );

    const apartment = apartments.find(
        a => a.id === purchase.apartmentId
    );

    return (
        <tr className="hover:bg-slate-50 transition-colors"
        key={purchase.id}>

<td>

{new Date(
    purchase.purchaseDate
).toLocaleDateString(
    "en-GB",
    {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }
)}

</td>

<td>

{apartment?.name ?? "-"}

</td>

<td>

{
    cycle
        ? new Date(cycle.startDate).toLocaleString(
              "en-US",
              {
                  month: "long",
                  year: "numeric",
              }
          )
        : "-"
}

</td>

<td className="font-medium text-slate-700">

{purchase.supplier}

</td>

<td>

<span
className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
${
purchase.source === "TANKER"

?

"bg-amber-100 text-amber-700"

:

"bg-sky-100 text-sky-700"
}`}
>

{
purchase.source === "TANKER"

?

"Tanker"

:

"Municipal"
}

</span>

</td>

<td className="font-semibold text-slate-900">

{purchase.volumeKl} KL

</td>

<td  className="font-semibold text-slate-900">

₹ {

Number(

purchase.unitCost

).toLocaleString(

"en-IN",

{

minimumFractionDigits:2,

maximumFractionDigits:2

}

)

}

</td>

<td  className="font-semibold text-slate-900">

₹ {

Number(

purchase.totalCost

).toLocaleString(

"en-IN",

{

minimumFractionDigits:2,

maximumFractionDigits:2

}

)

}

</td>

<td className="text-center">

<div className="flex justify-center gap-3">

<button
    title="Edit Purchase"
    className="mg-action-button"
    onClick={() => openEditModal(purchase)}
>
    <Pencil size={16} />
</button>

<button
    title="Delete Purchase"
    className="mg-action-button"
    onClick={() => {
    setPurchaseToDelete(purchase);
    setShowDeleteDialog(true);
}}
>
    <Trash2 size={16} />
</button>

</div>

</td>

</tr>

);



})}
</tbody>

</table>
</div>

}

</section>

{isModalOpen && (

<div className="mg-modal-overlay">

<div className="mg-modal">

<div className="mg-toolbar mb-6">

    <div>
        <h2>
            {editingPurchase
                ? "Edit Purchase"
                : "Add Purchase"}
        </h2>

        <p>
            Record bulk water purchases.
        </p>
    </div>

    <button
        type="button"
        className="mg-cancel-button"
        onClick={() => {
            setIsModalOpen(false);
            resetForm();
        }}
    >
        Close
    </button>

</div>

<form
onSubmit={handleSubmit}
className="mg-form-grid"
>
<div className="mg-form-group">

<label>

Apartment

</label>

<select

name="apartmentId"

value={form.apartmentId}

onChange={(event) => {

    const apartmentId = event.target.value;

    setForm(previous => {

        if (previous.apartmentId === apartmentId) {

            return previous;

        }

        return {

            ...previous,

            apartmentId,

            billingCycleId: "",

        };

    });

}}

required

>

<option value="">

Select Apartment

</option>

{

apartments.map(

apartment => (

<option

key={apartment.id}

value={apartment.id}

>

{apartment.name}

</option>

)

)

}

</select>

</div>
<div className="mg-form-group">

<label>

Billing Cycle

</label>

<select

name="billingCycleId"

value={form.billingCycleId}

onChange={handleChange}

disabled={!form.apartmentId}

required

>

<option value="">

{
form.apartmentId

?

"Select Billing Cycle"

:

"Select Apartment First"

}

</option>

{

filteredBillingCycles.map(

cycle => (

<option
key={cycle.id}
value={cycle.id}
>

{new Date(cycle.startDate).toLocaleString(
    "en-US",
    {
        month: "long",
        year: "numeric",
    }
)}

</option>

)

)

}

</select>

</div>
<div className="mg-form-group">

<label>

Purchase Date

</label>

<input

type="date"

name="purchaseDate"

value={form.purchaseDate}

onChange={handleChange}

required

/>

</div>
<div className="mg-form-group">

<label>

Source

</label>

<select

name="source"

value={form.source}

onChange={handleChange}

>

<option value="TANKER">

Tanker

</option>

<option value="MUNICIPAL">

Municipal

</option>

</select>

</div>

<div className="mg-form-group">

<label>

Volume (KL)

</label>

<input

type="number"

step="0.01"

name="volumeKl"

value={form.volumeKl}

onChange={handleChange}

required

/>
</div>


<div className="mg-form-group">

<label>

Unit Cost

</label>

<input

type="number"

step="0.01"

name="unitCost"

value={form.unitCost}

onChange={handleChange}

required

/>

</div>

<div className="mg-form-group mg-form-group-full">

<label>

Supplier

</label>

<input

type="text"

name="supplier"

value={form.supplier}

onChange={handleChange}

required

/>

</div>
<div className="mg-form-group-full">

<div className="mg-modal-actions">

<button

type="button"

className="mg-secondary-button"

onClick={() => {

setIsModalOpen(false);

resetForm();

}}

>

Cancel

</button>

<button

type="submit"

className="mg-primary-button"

>

{

editingPurchase

?

"Update Purchase"

:

"Save Purchase"

}

</button>

</div>
</div>

</form>

</div>

</div>

)}
</AdminPageShell>
<ConfirmDialog
    open={showDeleteDialog}
    title="Delete Purchase?"
    message="This purchase record will be permanently deleted. This action cannot be undone."
    confirmText="Delete"
    cancelText="Cancel"
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