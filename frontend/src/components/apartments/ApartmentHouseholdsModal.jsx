import { X } from "lucide-react";
import ResponsiveTable from "../ResponsiveTable";

export default function ApartmentHouseholdsModal({

    showHouseholdsModal,

    selectedApartment,

    households,

    onClose,

}) {

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

                        Households

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

                <ResponsiveTable>

                <table className="mg-table">

                    <thead>

                        <tr>

                            <th>Flat</th>

                            <th>Resident</th>

                            <th>Area</th>

                            <th>Occupancy</th>

                        </tr>

                    </thead>

                    <tbody>

                        {households.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={4}
                                    className="text-center py-8"
                                >

                                    No households found.

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
                                            "Not Assigned"}

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
                </ResponsiveTable>

            </div>

        </div>

    );

}