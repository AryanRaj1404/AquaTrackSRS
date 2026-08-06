  import { useEffect, useMemo, useState } from "react";
  import toast from "react-hot-toast";
  import { useTranslation } from "react-i18next";

  import {
    Building2,
    CheckCircle2,
    Plus,
  } from "lucide-react";

  import AdminPageShell from "../components/AdminPageShell";
  import StatCard from "../components/StatCard";
  import Pagination from "../components/Pagination";
  import AddApartmentModal from "../components/apartments/AddApartmentModal";
  import ApartmentTable from "../components/apartments/ApartmentTable"; 
  import ApartmentOverviewModal from "../components/apartments/ApartmentOverviewModal";

  import {
    createApartment,
    getApartments,
    searchApartments,
  } from "../services/apartmentService";
  import dashboardService from "../services/dashboardService";
  import { getApartmentOverview } from "../services/apartmentService";
  const initialForm = {
    apartmentName: "",
    address: ""
  };

  function Apartments() {
    const { t } = useTranslation();
    const [apartments, setApartments] = useState([]);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [dashboardStats, setDashboardStats] = useState({
        totalApartments: 0,
        toatalHouseholds: 0,
        totalUsers: 0,
    });
    const [showHouseholdsModal, setShowHouseholdsModal] = useState(false);
    const [overview, setOverview] = useState(null);
    const [loadingOverview, setLoadingOverview] = useState(false);

      const openOverview = async (apartment) => {
  setSelectedApartment(apartment);
  setOverview(null);
  setShowHouseholdsModal(true);
  setLoadingOverview(true);

  try {
    const data = await getApartmentOverview(apartment.id);
    setOverview(data);
  } catch (err) {
    console.error(err);
    toast.error("Unable to load apartment overview.");
  } finally {
    setLoadingOverview(false);
  }
};

    const PAGE_SIZE = 20;
    const SEARCH_DELAY = 300;

    const [page, setPage] = useState(0);

    const [pageData, setPageData] = useState({
        totalElements: 0,
        totalPages: 1,
        last: true,
    });

    useEffect(() => {

      loadApartments();

    }, [page, debouncedQuery]);

    useEffect(() => {

    const timer = setTimeout(() => {

        setDebouncedQuery(query.trim());

    }, SEARCH_DELAY);

    return () => clearTimeout(timer);

}, [query]);

useEffect(() => {

    setPage(0);

}, [query]);

    useEffect(() => {

        loadDashboardStats();

    }, []);

    const loadApartments = async () => {
      try {
        setIsLoading(true);
        
        const apartmentPage = debouncedQuery.trim()

        ? await searchApartments(
              debouncedQuery,
              page,
              PAGE_SIZE
          )

        : await getApartments(
              page,
              PAGE_SIZE
          );

        setApartments(apartmentPage.content);

    setPageData(apartmentPage);

      } catch (error) {
        console.error("Apartment fetch error:", error);

        setApartments([]);

        toast.error(
          t("apartments.toasts.loadError")
        );
      } finally {
        setIsLoading(false);
      }
    };

    const loadDashboardStats = async () => {
        try {
            const data = await dashboardService.getDashboard();
            setDashboardStats(data);
        } catch (error) {
            console.error("Dashboard stats error:", error);
        }
    };

    

    const handleChange = (event) => {
      const { name, value } = event.target;

      setForm((previous) => ({
        ...previous,
        [name]: value,
      }));
    };

    const validateForm = () => {
      if (!form.apartmentName.trim()) {
        toast.error(t("apartments.toasts.nameRequired"));
        return false;
      }

      if (!form.address.trim()) {
        toast.error(t("apartments.toasts.addressRequired"));
        return false;
      }

      return true;
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      if (!validateForm()) {
        return;
      }

      const apartmentPayload = {
        name: form.apartmentName.trim(),
        address: form.address.trim(),
      };

      setIsSubmitting(true);

      const loadingToast = toast.loading(t("apartments.toasts.registering"));

      try {
        await createApartment(apartmentPayload);

        await Promise.all([
          loadApartments(),
          loadDashboardStats(),
        ])

        toast.success(t("apartments.toasts.createSuccess"), {
          id: loadingToast,
        });

        setForm(initialForm);
        setShowForm(false);
      } catch (error) {
        console.error("Apartment create error:", error);

        toast.error(
          t("apartments.toasts.createError"),
          {
            id: loadingToast,
          }
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleCancel = () => {
      setForm(initialForm);
      setShowForm(false);
    };

    return (
      <AdminPageShell
        title={t("apartments.pageTitle")}
        description={t("apartments.pageDesc")}
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder={t("apartments.searchApartments")}
        action={
          <button
            type="button"
            className="mg-primary-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            {t("apartments.registerApartment")}
          </button>
        }
      >
        <section className="mg-summary-grid">
          <StatCard
            icon={Building2}
            title={t("apartments.totalApartments")}
            value={dashboardStats.totalApartments}
            description={t("apartments.registeredComplexes")}
            delay={0}
          />

          <StatCard
            icon={Building2}
            title={t("apartments.totalHouseholds")}
            value={dashboardStats.totalHouseholds}
            description={t("apartments.totalHouseholds")}
            delay={0.1}
          />

          <StatCard
            icon={CheckCircle2}
            title={t("apartments.residents")}
            value={dashboardStats.totalUsers}
            description={t("apartments.registeredResidents")}
            delay={0.2}
          />

          <StatCard
            icon={Building2}
            title={t("apartments.householdsPerApartment")}
            value={
                    dashboardStats.totalApartments > 0            
                          ? (
                                dashboardStats.totalHouseholds /
                                dashboardStats.totalApartments
                            ).toFixed(1)
                          : "0"
                  }
            description={t("apartments.averageHouseholds")}
            delay={0.3}
          />
        </section>

        <AddApartmentModal
          showForm={showForm}
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />

        <section className="mg-panel">

          <ApartmentTable
            isLoading={isLoading}
            apartments={apartments}
            onViewOverview={openOverview}
          />

          {!isLoading && apartments.length > 0 && (

            <Pagination
              page={page}
              pageData={pageData}
              pageSize={PAGE_SIZE}
              currentCount={apartments.length}
              label={t("apartments.recordsLabel")}
              onPrevious={() => setPage(page - 1)}
              onNext={() => setPage(page + 1)}
              onPageChange={setPage}
            />

          )}

        </section>

        <ApartmentOverviewModal
            showHouseholdsModal={showHouseholdsModal}
            selectedApartment={selectedApartment}
            overview={overview}
            loading={loadingOverview}
            onClose={() => {
                setShowHouseholdsModal(false);
                setOverview(null);
                setSelectedApartment(null);
            }}
        />
        
      </AdminPageShell>
    );
  }

  export default Apartments;