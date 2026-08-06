import { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next";



function HouseholdTable(
    {

    households,

    apartments,

    handleRemoveResident,

    openAssignResident,

}
) {
    const { t } = useTranslation();

    return (

        <div className="mg-table-wrapper">
            <table className="mg-table">
              <thead>
              <tr>
                <th>{t("households.table.colFlatNumber")}</th>
                <th>{t("households.table.colApartment")}</th>
                <th>{t("households.table.colFlatSize")}</th>
                <th>{t("households.table.colOccupancy")}</th>
                <th>{t("households.table.colResident")}</th>
                <th>{t("households.table.colActions")}</th>
                </tr>
              </thead>
              <tbody>
                {households.map((household) => (
                  <tr className="hover:bg-slate-50 transition-colors"
                  key={household.id}>

                    <td>
                      <span className="mg-table-primary">
                        {household.flatNumber}
                      </span>
                    </td>

                    <td>{household.apartmentName}</td>

                    <td>{household.flatSize} sq.ft</td>

                    <td>{household.occupancy}</td>

                    <td>
                      {household.residentName ? (
                        household.residentName
                      ) : (
                        <span className="mg-badge">
                          {t("households.table.notAssigned")}
                        </span>
                      )}
                    </td>

                    <td>

                      {household.residentId ? (

                        <button
                          className="mg-cancel-button"
                          type="button"
                          onClick={() => handleRemoveResident(household)}
                        >
                          {t("households.table.remove")}
                        </button>

                      ) : (

                        <button
                          className="mg-primary-button"
                          type="button"
                          onClick={() => openAssignResident(household)}
                        >
                          {t("households.table.assign")}
                        </button>

                      )}

                    </td>

                  </tr>
                ))}
                
              </tbody>
            </table>
          </div>

    );

}

export default HouseholdTable;
