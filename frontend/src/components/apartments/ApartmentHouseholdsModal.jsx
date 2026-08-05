import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ApartmentHouseholdsModal({

    showHouseholdsModal,

    selectedApartment,

    households,

    onClose,

}) {

    const { t } = useTranslation();

    if (!showHouseholdsModal) {

        return null;

    }

    return (

        <div
            className="mg-modal-overlay"
            onClick={onClose}
        >

            <div
                className="mg-modal"
                onClick={(event) => event.stopPropagation()}
            >

                <div className="mg-modal-header">

                    <h2>

                        {t("apartments.householdsModalTitle")}

                    </h2>

                    <button
                        className="mg-close-button"
                        onClick={onClose}
                    >

                        <X size={18} />

                    </button>

                </div>

                <p className="mg-modal-subtitle">

                    {selectedApartment?.name}

                </p>

                <table className="mg-table">

                    <thead>

                        <tr>

                            <th>{t("apartments.colFlat")}</th>

                            <th>{t("apartments.colResident")}</th>

                            <th>{t("apartments.colArea")}</th>

                            <th>{t("apartments.colOccupancy")}</th>

                        </tr>

                    </thead>

                    <tbody>

                        {households.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={4}
                                    className="text-center py-8"
                                >

                                    {t("apartments.noHouseholdsFound")}

                                </td>

                            </tr>

                        ) : (

                            households.map((household) => (

                                <tr
                                    key={household.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >

                                    <td>

                                        {household.flatNumber}

                                    </td>

                                    <td>

                                        {household.residentName ??
                                            t("apartments.notAssigned")}

                                    </td>

                                    <td>

                                        {household.flatSize} sq.ft

                                    </td>

                                    <td>

                                        {household.occupancy}

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}