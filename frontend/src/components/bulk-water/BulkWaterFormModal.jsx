import React from 'react'

function BulkWaterFormModal({

    showModal,

    editingPurchase,

    form,

    apartments,

    filteredBillingCycles,

    setForm,

    handleChange,

    handleSubmit,

    closeModal,

}){
    if (!showModal) {

    return null;

}
    
  return (
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
            closeModal();
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

closeModal();

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


  )
}

export default BulkWaterFormModal