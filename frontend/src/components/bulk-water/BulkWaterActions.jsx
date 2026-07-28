import { Plus } from "lucide-react";

function BulkWaterActions({

    openCreateModal,

}) {

    return (

        <button
            type="button"
            className="mg-primary-button flex items-center gap-2"
            onClick={openCreateModal}
        >

            <Plus size={18} />

            Add Purchase

        </button>

    );

}

export default BulkWaterActions;