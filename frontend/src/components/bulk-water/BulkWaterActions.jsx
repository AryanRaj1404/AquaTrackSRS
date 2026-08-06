import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

function BulkWaterActions({

    openCreateModal,

}) {

    const { t } = useTranslation();

    return (

        <button
            type="button"
            className="mg-primary-button flex items-center gap-2"
            onClick={openCreateModal}
        >

            <Plus size={18} />

            {t("bulkWaterPurchases.addPurchase")}

        </button>

    );

}

export default BulkWaterActions;