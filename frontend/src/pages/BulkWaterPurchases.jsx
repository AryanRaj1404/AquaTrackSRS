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

        loadData();

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

const handleDelete = async (id) => {

    if (

        !window.confirm(

            "Delete this purchase?"

        )

    ) {

        return;

    }

    try {

        await deletePurchase(id);

        toast.success(

            "Purchase deleted."

        );

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

<AdminPageShell

    searchPlaceholder="Search supplier or source..."

    searchValue={query}

    onSearchChange={setQuery}

>

<section className="mg-summary-grid">

    <StatCard

        icon={Truck}

        title="Purchases"

        value={totalPurchases}

        description="Recorded purchases"

    />

    <StatCard

        icon={Droplets}

        title="Volume"

        value={`${totalVolume.toFixed(2)} KL`}

        description="Purchased water"

    />

    <StatCard

        icon={IndianRupee}

        title="Total Cost"

        value={`₹ ${totalCost.toLocaleString("en-IN")}`}

        description="Purchase cost"

    />

    <StatCard

        icon={Calendar}

        title="Average Rate"

        value={`₹ ${averageRate.toFixed(2)}/KL`}

        description="Average purchase rate"

    />

</section>

<section className="mg-card">

<div className="mg-card-header">

<div>

<h2>

Bulk Water Purchases

</h2>

<p>

Manage tanker and municipal water purchases.

</p>

</div>

<button

className="mg-primary-button"

onClick={openCreateModal}

>

<Plus size={18}/>

Add Purchase

</button>

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

<th>Actions</th>

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
        <tr key={purchase.id}>

<td>

{purchase.purchaseDate}

</td>

<td>

{apartment?.name ?? "-"}

</td>

<td>

{

cycle

?

`${cycle.startDate} - ${cycle.endDate}`

:

"-"

}

</td>

<td>

{purchase.supplier}

</td>

<td>

{purchase.source}

</td>

<td>

{purchase.volumeKl} KL

</td>

<td>

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

<td>

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

<td>

<div className="mg-table-actions">

<button
    title="Edit Purchase"
    className="mg-icon-button"
    onClick={() => openEditModal(purchase)}
>
    <Pencil size={16} />
</button>

<button
    title="Delete Purchase"
    className="mg-icon-button mg-danger"
    onClick={() => handleDelete(purchase.id)}
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

}

</section>

{isModalOpen && (

<div className="mg-modal-overlay">

<div className="mg-modal">

<div className="mg-modal-header">

<h2>

{
editingPurchase
? "Edit Purchase"
: "Add Purchase"
}

</h2>

<button
onClick={() => {

setIsModalOpen(false);

resetForm();

}}
>

✕

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

{

cycle.startDate

}

{" - "}

{

cycle.endDate

}

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

<div className="mg-modal-footer">

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
  );
}

export default BulkWaterPurchases;