import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  CheckCircle2,
  Home,
  Loader2,
  Plus,
  Save,
  Users,
  X,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import Pagination from "../components/Pagination";
import {
  createHousehold,
  getHouseholds,
  assignResident,
  removeResident,
  getUnassignedResidents,
} from "../services/householdService";

import { getApartments } from "../services/apartmentService";

const initialForm = {
  flatNumber: "",
  flatSize: "",
  occupancy: "",
  apartmentId: "",
};

function Households() {
  const [households, setHouseholds] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [availableResidents, setAvailableResidents] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [selectedResident, setSelectedResident] = useState("");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState(null);

  const PAGE_SIZE = 20;

  useEffect(() => {
    loadHouseholds();
  }, [page]);

  const loadHouseholds = async () => {
  try {
    setIsLoading(true);

    const [householdData, apartmentData] = await Promise.all([
      getHouseholds(page, PAGE_SIZE),
      getApartments(),
    ]);

    setHouseholds(householdData.content ?? []);
    setPageData(householdData);

    setApartments(Array.isArray(apartmentData) ? apartmentData : []);
  } catch (error) {
    console.error(error);

    setHouseholds([]);

    toast.error("Unable to load households.");
  } finally {
    setIsLoading(false);
  }
};

  const filteredHouseholds = useMemo(() => {
    if (!query.trim()) {
      return households;
    }

    const keyword = query.toLowerCase();

    return households.filter((household) => {
      return (
        household.flatNumber?.toLowerCase().includes(keyword) ||
        household.apartmentName?.toLowerCase().includes(keyword) ||
        household.residentName?.toLowerCase().includes(keyword)
      );
    });
  }, [households, query]);

  const totalOccupancy = households.reduce((total, household) => {
    return total + Number(household.occupancy || 0);
  }, 0);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.flatNumber.trim()) {
      toast.error("Flat number is required.");
      return false;
    }

    if (!form.flatSize) {
      toast.error("Flat size is required.");
      return false;
    }

    if (!form.occupancy) {
      toast.error("Occupancy is required.");
      return false;
    }

    if (!form.apartmentId) {
      toast.error("Apartment is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const householdPayload = {
      flatNumber: form.flatNumber.trim(),
      flatSize: Number(form.flatSize),
      occupancy: Number(form.occupancy),
      apartmentId: Number(form.apartmentId),
    };

    setIsSubmitting(true);

    const loadingToast = toast.loading("Creating household...");

    try {
      const savedHousehold = await createHousehold(householdPayload);

      setHouseholds((previous) => [savedHousehold, ...previous]);

      toast.success("Household created successfully.", {
        id: loadingToast,
      });

      setForm(initialForm);
      setShowForm(false);
    } catch (error) {
      console.error("Household create error:", error);

      toast.error(
        "Household creation failed. Please confirm backend endpoint and field names.",
        {
          id: loadingToast,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadAvailableResidents = async () => {
  try {
    const data = await getUnassignedResidents();

    setAvailableResidents(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error(error);
    toast.error("Unable to load residents.");
  }
};

const openAssignResident = async (household) => {
  setSelectedHousehold(household);
  setSelectedResident("");

  await loadAvailableResidents();

  setShowAssignModal(true);
};

const handleAssignResident = async () => {
  if (!selectedResident) {
    toast.error("Please select a resident.");
    return;
  }

  try {
    const loadingToast = toast.loading("Assigning resident...");

    await assignResident(
      selectedHousehold.id,
      selectedResident
    );

    toast.success("Resident assigned successfully.", {
      id: loadingToast,
    });

    setShowAssignModal(false);

    await loadHouseholds();

  } catch (error) {

    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to assign resident."
    );

  }
};

const handleRemoveResident = async (household) => {

  try {

    const loadingToast = toast.loading("Removing resident...");

    await removeResident(
      household.id,
      household.residentId
    );

    toast.success("Resident removed.", {
      id: loadingToast,
    });

    await loadHouseholds();

  } catch (error) {

    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to remove resident."
    );

  }

};

  const handleCancel = () => {
    setForm(initialForm);
    setShowForm(false);
  };

  return (
    <AdminPageShell
      title="Household Management"
      description="Create and manage households using backend-ready fields."
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="Search households, residents or meters..."
      action={
        <button
          type="button"
          className="mg-primary-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add Household
        </button>
      }
    >
      <section className="mg-summary-grid">
        <StatCard
          icon={Home}
          title="Total Households"
          value={pageData?.totalElements ?? 0}
          description="Fetched from backend API"
          delay={0}
        />

        <StatCard
          icon={Users}
          title="Page Occupancy"
          value={totalOccupancy}
          description="Residents on current page"
          delay={0.1}
        />

        <StatCard
          icon={CheckCircle2}
          title="Status"
          value="API Ready"
          description="No dummy household data"
          delay={0.2}
        />

        <StatCard
          icon={Home}
          title="Apartment Link"
          value="Required"
          description="Household belongs to apartment"
          delay={0.2}
        />
      </section>

      {showForm && (
        <section className="mg-panel" style={{ marginBottom: "20px" }}>
          <div className="mg-toolbar">
            <div>
              <h2>Add Household</h2>
              <p>
                These fields should match Sandhiya&apos;s backend household API.
              </p>
            </div>

            <button
              type="button"
              className="mg-cancel-button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X size={16} />
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mg-form-grid">

              {/* Flat Number */}

              <div className="mg-form-group">
                <label htmlFor="flatNumber">Flat Number</label>

                <input
                  id="flatNumber"
                  name="flatNumber"
                  type="text"
                  value={form.flatNumber}
                  onChange={handleChange}
                  placeholder="Example: A-101"
                  disabled={isSubmitting}
                />
              </div>

              {/* Flat Size */}

              <div className="mg-form-group">
                <label htmlFor="flatSize">Flat Size (sq.ft)</label>

                <input
                  id="flatSize"
                  name="flatSize"
                  type="number"
                  value={form.flatSize}
                  onChange={handleChange}
                  placeholder="Example: 1200"
                  disabled={isSubmitting}
                />
              </div>

              {/* Occupancy */}

              <div className="mg-form-group">
                <label htmlFor="occupancy">Occupancy</label>

                <input
                  id="occupancy"
                  name="occupancy"
                  type="number"
                  min="1"
                  value={form.occupancy}
                  onChange={handleChange}
                  placeholder="Example: 4"
                  disabled={isSubmitting}
                />
              </div>

              {/* Apartment */}

              <div className="mg-form-group">
                <label htmlFor="apartmentId">Apartment</label>

                <select
                  id="apartmentId"
                  name="apartmentId"
                  value={form.apartmentId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >

                  <option value="">
                    Select Apartment
                  </option>

                  {apartments.map((apartment) => (

                    <option
                      key={apartment.id}
                      value={apartment.id}
                    >
                      {apartment.name}
                    </option>

                  ))}

                </select>
              </div>

            </div>
            

            <div className="mg-modal-actions">
              <button
                type="button"
                className="mg-cancel-button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="submit"
                className="mg-primary-button"
                disabled={isSubmitting}
              >
                <Save size={17} />
                {isSubmitting ? "Saving..." : "Create Household"}
              </button>
            </div>
          </form>
        </section>
      )}

      {showAssignModal && (
  <section className="mg-panel" style={{ marginBottom: "20px" }}>
    <div className="mg-toolbar">
      <div>
        <h2>Assign Resident</h2>
        <p>
          Assign a resident to Flat {selectedHousehold?.flatNumber}.
        </p>
      </div>

      <button
        type="button"
        className="mg-cancel-button"
        onClick={() => setShowAssignModal(false)}
      >
        <X size={16} />
        Close
      </button>
    </div>

    <div className="mg-form-grid">
      <div className="mg-form-group mg-form-group-full">
        <label>Select Resident</label>

        <select
          value={selectedResident}
          onChange={(e) => setSelectedResident(e.target.value)}
        >
          <option value="">Choose Resident</option>

          {availableResidents.map((resident) => (
            <option
              key={resident.id}
              value={resident.id}
            >
              {resident.fullName} ({resident.username})
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="mg-modal-actions">
      <button
        type="button"
        className="mg-cancel-button"
        onClick={() => setShowAssignModal(false)}
      >
        <X size={17} />
        Cancel
      </button>

      <button
        type="button"
        className="mg-primary-button"
        onClick={handleAssignResident}
      >
        <Save size={17} />
        Assign Resident
      </button>
    </div>
  </section>
)}

      <section className="mg-panel">
        <div className="mg-toolbar">
          <div>
            <h2>Household Records</h2>
            <p>
              Household data will appear here after successful backend API
              connection.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="mg-empty-state">
            <Loader2 size={36} className="animate-spin" />
            <h3>Loading households</h3>
            <p>Please wait while household data is fetched.</p>
          </div>
        ) : filteredHouseholds.length > 0 ? (
          <>
          <div className="mg-table-wrapper">
            <table className="mg-table">
              <thead>
              <tr>
                <th>Flat Number</th>
                <th>Apartment</th>
                <th>Flat Size</th>
                <th>Occupancy</th>
                <th>Resident</th>
                <th>Actions</th>
              </tr>
              </thead>

              <tbody>
                {filteredHouseholds.map((household) => (
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
          <Pagination
              page={page}
              pageData={pageData}
              pageSize={PAGE_SIZE}
              currentCount={households.length}
              onPrevious={() => setPage(page - 1)}
              onNext={() => setPage(page + 1)}
              onPageChange={setPage}
          />
        </>

        ) : (
          <EmptyState
            icon={Home}
            title="No households found"
            description="No fake records are shown. Add households after confirming backend fields."
          />
        )}
      </section>
    </AdminPageShell>
  );
}

export default Households;