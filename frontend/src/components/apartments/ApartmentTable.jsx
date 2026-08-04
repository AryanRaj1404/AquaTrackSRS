import { Building2, Loader2 } from "lucide-react";
import EmptyState from "../EmptyState";
import { memo } from "react";
import ResponsiveTable from "../ResponsiveTable";

function ApartmentTable({

    isLoading,

    apartments,

    onViewHouseholds,

}) {

    if (isLoading) {

        return (

                <div className="mg-empty-state">

                    <Loader2
                        size={36}
                        className="animate-spin"
                    />

                    <h3>Loading apartments</h3>

                    <p>
                        Please wait while apartment data is fetched.
                    </p>

                </div>

        );

    }

    return (

        <>

            <div className="mg-toolbar">

                <div>

                    <h2>Apartment Records</h2>

                    <p>
                        All registered apartment complexes are listed below.
                    </p>

                </div>

            </div>

            {apartments.length > 0 ? (

                <div className="mg-table-wrapper">

                    <ResponsiveTable>

                    <table className="mg-table">

                        <thead>

                            <tr>

                                <th>Apartment Name</th>

                                <th>Address</th>

                                <th>Households</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {apartments.map((apartment) => (

                                <tr
                                    key={apartment.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >

                                    <td>

                                        <span className="mg-table-primary">

                                            {apartment.name}

                                        </span>

                                    </td>

                                    <td>

                                        {apartment.address}

                                    </td>

                                    <td>

                                        <span className="mg-badge">

                                            {apartment.householdCount}

                                        </span>

                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            className="mg-secondary-button"
                                            onClick={() =>
                                                onViewHouseholds(apartment)
                                            }
                                        >

                                            View

                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    </ResponsiveTable>

                </div>

            ) : (

                <EmptyState
                    icon={Building2}
                    title="No apartments found"
                    description="Create your first apartment to begin managing households."
                />

            )}

        </>

    );

}

export default memo(ApartmentTable);