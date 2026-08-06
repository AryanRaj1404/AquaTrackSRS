import { Building2, Loader2 } from "lucide-react";
import EmptyState from "../EmptyState";
import { memo } from "react";
import { useTranslation } from "react-i18next";

function ApartmentTable({

    isLoading,

    apartments,

    onViewOverview,

}) {

    const { t } = useTranslation();

    if (isLoading) {

        return (

                <div className="mg-empty-state">

                    <Loader2
                        size={36}
                        className="animate-spin"
                    />

                    <h3>{t("apartments.loadingApartments")}</h3>

                    <p>
                        {t("apartments.pleaseWaitFetch")}
                    </p>

                </div>

        );

    }

    return (

        <>

            <div className="mg-toolbar">

                <div>

                    <h2>{t("apartments.apartmentRecords")}</h2>

                    <p>
                        {t("apartments.allComplexesListed")}
                    </p>

                </div>

            </div>

            {apartments.length > 0 ? (

                <div className="mg-table-wrapper">

                    <table className="mg-table">

                        <thead>

                            <tr>

                                <th>{t("apartments.apartmentName")}</th>

                                <th>{t("apartments.address")}</th>

                                <th>{t("apartments.colHouseholds")}</th>

                                <th>{t("apartments.colAction")}</th>

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
                                                onViewOverview(apartment)
                                            }
                                        >

                                            {t("apartments.view")}

                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            ) : (

                <EmptyState
                    icon={Building2}
                    title={t("apartments.noApartmentsFound")}
                    description={t("apartments.createFirstApartment")}
                />

            )}

        </>

    );

}

export default memo(ApartmentTable);