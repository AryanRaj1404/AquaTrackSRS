import { useEffect,useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  CheckCircle2,
  Home,
  Loader2,
  Plus,
  Save,
  Users,
  X,
  ChevronDown,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import Pagination from "../components/Pagination";
import HouseholdTable from "../components/households/HouseholdTable";
import AddHouseholdModal from "../components/households/AddHouseholdModal";
import AssignResidentModal from "../components/households/AssignResidentModal";

import {
  createHousehold,
  getHouseholds,
  searchHouseholds,
  assignResident,
  removeResident,
  getUnassignedResidents,
  getHouseholdsByApartmentPage,
} from "../services/householdService";

import { getApartments } from "../services/apartmentService";

const initialForm = {
  flatNumber: "",
  flatSize: "",
  occupancy: "",
  apartmentId: "",
};

const PAGE_SIZE = 20;

function Households() {
  const [households, setHouseholds] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [availableResidents, setAvailableResidents] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [selectedResident, setSelectedResident] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    loadHouseholds();
  }, [page, debouncedQuery, selectedApartment]);

  useEffect(() => {

    const timer = setTimeout(() => {

        setDebouncedQuery(query);

    }, 400);

    return () => clearTimeout(timer);

}, [query]);

  const loadHouseholds = async () => {
  try {
    setIsLoading(true);

    let householdPromise;

    if (selectedApartment) {

        householdPromise =
            getHouseholdsByApartmentPage(
                selectedApartment,
                page,
                PAGE_SIZE
            );

    }
    else if (debouncedQuery.trim()) {

        householdPromise =
            searchHouseholds(
                debouncedQuery,
                page,
                PAGE_SIZE
            );

    }
    else {

        householdPromise =
            getHouseholds(
                page,
                PAGE_SIZE
            );

    }

    const [householdData, apartmentData] = await Promise.all([
        householdPromise,
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

  const totalResidents = useMemo(() => {

    return households.reduce(
        (sum, household) =>
            sum + Number(household.occupancy || 0),
        0
    );

  }, [households]);

  const occupiedHouseholds = useMemo(() => {

    return households.filter(
        household => household.residentId !== null
    ).length;

}, [households]);

  const vacantHouseholds = useMemo(() => {

    return households.length - occupiedHouseholds;

}, [households, occupiedHouseholds]);

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
      await createHousehold(householdPayload);

      toast.success("Household created successfully.", {
          id: loadingToast,
      });

      setForm(initialForm);

      setShowForm(false);

      await loadHouseholds();
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

const onAssignResident = async () => {
  if (!selectedResident) {
    toast.error("Please select a resident.");
    return;
  }
  setIsAssigning(true);
  try {
    const loadingToast = toast.loading("Assigning resident...");

    await assignResident(
      selectedHousehold.id,
      selectedResident
    );

    toast.success("Resident assigned successfully.", {
      id: loadingToast,
    });

    setSelectedResident("");

    setSelectedHousehold(null); 

    setShowAssignModal(false);

    await loadHouseholds();

  } catch (error) {

    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to assign resident."
    );

  }
  finally{
    setIsAssigning(false);
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
      onSearchChange={(value)=>{
        setPage(0);
        setQuery(value);
      }}
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
          title="Occupied"
          value={occupiedHouseholds}
          description="Households with Residents on current page."
          delay={0.1}
        />

        <StatCard
          icon={Home}
          title="Vacant"
          value={vacantHouseholds}
          description="Awaiting resident Assignment on current page."
          delay={0.2}
        />

        <StatCard
          icon={Users}
          title="Residents"
          value={totalResidents}
          description="Residents on current page"
          delay={0.2}
        />
      </section>

      <AddHouseholdModal

        showForm={showForm}

        handleCancel={handleCancel}

        handleSubmit={handleSubmit}

        handleChange={handleChange}

        form={form}

        apartments={apartments}

        isSubmitting={isSubmitting}

    />

      <AssignResidentModal

        showAssignModal={showAssignModal}

        selectedHousehold={selectedHousehold}

        availableResidents={availableResidents}

        selectedResident={selectedResident}

        onResidentChange={setSelectedResident}

        onAssign={onAssignResident}

        onClose={() => setShowAssignModal(false)}

        isAssigning={isAssigning}

      />

      <section className="mg-panel">
        <div className="mg-toolbar">
          <div>
            <h2>Household Records</h2>
            <p>
              All the households are here.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="mg-empty-state">
            <Loader2 size={36} className="animate-spin" />
            <h3>Loading households</h3>
            <p>Please wait while household data is fetched.</p>
          </div>
        ) : households.length > 0 ? (
          <>
          <HouseholdTable
                households={households}

                apartments={apartments}

                selectedApartment={selectedApartment}

                setSelectedApartment={setSelectedApartment}

                handleRemoveResident={handleRemoveResident}

                openAssignResident={openAssignResident}
          />
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
            description="There is no household present."
          />
        )}
      </section>
    </AdminPageShell>
  );
}

export default Households;