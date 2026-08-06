import { useEffect,useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

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
import { useWorkspace } from "../context/WorkspaceContext";

import {
  createHousehold,
  getHouseholds,
  searchHouseholds,
  assignResident,
  removeResident,
  getUnassignedResidents,
  getHouseholdsByApartmentPage,
} from "../services/householdService";

import { getApartments, getAllApartments } from "../services/apartmentService";

const initialForm = {
  flatNumber: "",
  flatSize: "",
  occupancy: "",
  apartmentId: "",
};

const PAGE_SIZE = 20;

function Households() {
  const { t } = useTranslation();
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
  const [isAssigning, setIsAssigning] = useState(false);
  const { workspaceId } = useWorkspace();

  useEffect(() => {
    loadHouseholds();
  }, [workspaceId, page, debouncedQuery]);

  useEffect(() => {
  if (workspaceId) {
    setForm((prev) => ({
      ...prev,
      apartmentId: String(workspaceId),
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      apartmentId: "",
    }));
  }
}, [workspaceId]);

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
    
    if (debouncedQuery.trim()) {
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
        getAllApartments(),
    ]);

    setHouseholds(householdData.content ?? []);
    setPageData(householdData);

    setApartments(
      Array.isArray(apartmentData)
          ? apartmentData
          : apartmentData.content ?? []
    );
  } catch (error) {
    console.error(error);

    setHouseholds([]);

    toast.error(t("households.toasts.loadError"));
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
      toast.error(t("households.toasts.flatNumberRequired"));
      return false;
    }

    if (!form.flatSize) {
      toast.error(t("households.toasts.flatSizeRequired"));
      return false;
    }

    if (!form.occupancy) {
      toast.error(t("households.toasts.occupancyRequired"));
      return false;
    }

    if (!form.apartmentId) {
      toast.error(t("households.toasts.apartmentRequired"));
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

    const loadingToast = toast.loading(t("households.toasts.creating"));

    try {
      await createHousehold(householdPayload);

      toast.success(t("households.toasts.createSuccess"), {
          id: loadingToast,
      });

      setForm(initialForm);

      setShowForm(false);

      await loadHouseholds();
    } catch (error) {
      console.error("Household create error:", error);

      toast.error(
        t("households.toasts.createError"),
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
    toast.error(t("households.toasts.residentsLoadError"));
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
    toast.error(t("households.toasts.selectResident"));
    return;
  }
  setIsAssigning(true);
  try {
    const loadingToast = toast.loading(t("households.toasts.assigning"));

    await assignResident(
      selectedHousehold.id,
      selectedResident
    );

    toast.success(t("households.toasts.assignSuccess"), {
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
      t("households.toasts.assignError")
    );

  }
  finally{
    setIsAssigning(false);
  }
};

const handleRemoveResident = async (household) => {

  try {

    const loadingToast = toast.loading(t("households.toasts.removing"));

    await removeResident(
      household.id,
      household.residentId
    );

    toast.success(t("households.toasts.removeSuccess"), {
      id: loadingToast,
    });

    await loadHouseholds();

  } catch (error) {

    console.error(error);

    toast.error(
      error.response?.data?.message ||
      t("households.toasts.removeError")
    );

  }

};

  const handleCancel = () => {
    setForm(initialForm);
    setShowForm(false);
  };

  return (
    <AdminPageShell
      title={t("households.pageTitle")}
      description={t("households.pageDesc")}
      searchValue={query}
      onSearchChange={(value)=>{
        setPage(0);
        setQuery(value);
      }}
      searchPlaceholder={t("households.searchPlaceholder")}
      action={
        <button
          type="button"
          className="mg-primary-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          {t("households.addHousehold")}
        </button>
      }
    >
      <section className="mg-summary-grid">
        <StatCard
          icon={Home}
          title={t("households.stats.totalTitle")}
          value={pageData?.totalElements ?? 0}
          description={t("households.stats.totalDesc")}
          delay={0}
        />

        <StatCard
          icon={Users}
          title={t("households.stats.occupiedTitle")}
          value={occupiedHouseholds}
          description={t("households.stats.occupiedDesc")}
          delay={0.1}
        />

        <StatCard
          icon={Home}
          title={t("households.stats.vacantTitle")}
          value={vacantHouseholds}
          description={t("households.stats.vacantDesc")}
          delay={0.2}
        />

        <StatCard
          icon={Users}
          title={t("households.stats.residentsTitle")}
          value={totalResidents}
          description={t("households.stats.residentsDesc")}
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

        workspaceId={workspaceId}

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
            <h2>{t("households.recordsTitle")}</h2>
            <p>
              {t("households.recordsSubtitle")}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="mg-empty-state">
            <Loader2 size={36} className="animate-spin" />
            <h3>{t("households.loading")}</h3>
            <p>{t("households.pleaseWait")}</p>
          </div>
        ) : households.length > 0 ? (
          <>
          <HouseholdTable
                households={households}

                apartments={apartments}

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
            title={t("households.noHouseholdsFound")}
            description={t("households.noHouseholdsDesc")}
          />
        )}
      </section>
    </AdminPageShell>
  );
}

export default Households;