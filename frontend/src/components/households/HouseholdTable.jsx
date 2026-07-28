import { useState, useEffect } from 'react'

import { 
  ChevronDown,
  Check
 } from "lucide-react";

function HouseholdTable(
    {

    households,

    apartments,

    selectedApartment,

    setSelectedApartment,

    handleRemoveResident,

    openAssignResident,

}
) {

    const [showApartmentFilter, setShowApartmentFilter] = useState(false);

     useEffect(() => {
        setShowApartmentFilter(false);
    }, [selectedApartment]);

    useEffect(() => {
    
        const handleClick = () => {
    
            setShowApartmentFilter(false);
    
        };
    
        window.addEventListener("click", handleClick);
    
        return () =>
            window.removeEventListener("click", handleClick);
    
    }, []);

    const selectedApartmentName = 
      apartments.find(
          apartment =>
              String(apartment.id) === String(selectedApartment)
      )?.name || "Apartment";

    return (

        <div className="mg-table-wrapper">
            <table className="mg-table">
              <thead>
              <tr>
                <th>Flat Number</th>
                <th>

  <div className="relative inline-block">

    <button
      type="button"
      onClick={(event) => {

        event.stopPropagation();
        setShowApartmentFilter(previous => !previous);

      }}
      className="flex items-center gap-1 font-medium hover:text-sky-600 transition-colors"
    >

      <span>{selectedApartmentName}</span>

      <ChevronDown
        size={16}
        strokeWidth={2.8}
        className={`transition-transform duration-200 ${
          showApartmentFilter ? "rotate-180" : ""
        }`}
      />

    </button>

    {showApartmentFilter && (

      <div
        onClick={(event) => event.stopPropagation()}
        className="
          absolute
          left-0
          top-full
          mt-2
          w-60
          bg-white
          border
          border-slate-200
          rounded-xl
          shadow-xl
          overflow-y-auto
          max-h-64
          z-50
          "
      >

        <button
          type="button"
          onClick={() => {

            setSelectedApartment("");
            setShowApartmentFilter(false);

          }}
          className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition ${
            selectedApartment === ""
              ? "bg-sky-50 text-sky-600 font-semibold"
              : ""
          }`}
        >
          <div className="flex items-center justify-between">

    <span>All Apartments</span>

    {selectedApartment === "" && (

        <Check
            size={16}
            className="text-sky-600"
        />

    )}

</div>
        </button>
        {apartments.map((apartment) => (

  <button
    key={apartment.id}
    type="button"
    onClick={() => {

      setSelectedApartment(apartment.id);
      setShowApartmentFilter(false);

    }}
    className={`
      w-full
      px-4
      py-3
      flex
      items-center
      justify-between
      hover:bg-slate-50
      transition
      ${
          String(selectedApartment) === String(apartment.id)
              ? "bg-sky-50 text-sky-600 font-semibold"
              : ""
      }
      `}
  >
    {apartment.name}
      {String(selectedApartment) === String(apartment.id) && (
        <Check
            size={16}
            className="text-sky-600"
        />
    )}
  </button>

))}

      </div>

    )}

  </div>

</th>
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
          </div>

    );

}

export default HouseholdTable;