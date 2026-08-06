import { useState, useEffect } from 'react'

import { 
  ChevronDown,
  Check
 } from "lucide-react";
import ResponsiveTable from '../ResponsiveTable';

function HouseholdTable(
    {

    households,

    apartments,

    handleRemoveResident,

    openAssignResident,

}
) {

    const [showApartmentFilter, setShowApartmentFilter] = useState(false);

     useEffect(() => {
        setShowApartmentFilter(false);
    }, []);

    useEffect(() => {
    
        const handleClick = () => {
    
            setShowApartmentFilter(false);
    
        };
    
        window.addEventListener("click", handleClick);
    
        return () =>
            window.removeEventListener("click", handleClick);
    
    }, []);

    return (

        <div className="mg-table-wrapper">
          <ResponsiveTable>
            <table className="mg-table">
              <thead>
              <tr>
                <th>Flat Number</th>
                <th>Apartment </th>
                <th>Flat Size</th>
                <th>Occupancy</th>
                <th>Resident</th>
                <th>Actions</th>
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
                          Not Assigned
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
                          Remove
                        </button>

                      ) : (

                        <button
                          className="mg-primary-button"
                          type="button"
                          onClick={() => openAssignResident(household)}
                        >
                          Assign
                        </button>

                      )}

                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            </ResponsiveTable>
          </div>

    );

}

export default HouseholdTable;