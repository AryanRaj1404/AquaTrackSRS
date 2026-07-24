  import { useEffect, useMemo, useState } from "react";
  import toast from "react-hot-toast";

  import {
    Building2,
    CheckCircle2,
    Loader2,
    Plus,
    Save,
    X,
  } from "lucide-react";

  import AdminPageShell from "../components/AdminPageShell";
  import EmptyState from "../components/EmptyState";
  import StatCard from "../components/StatCard";
  import {
    createApartment,
    getApartments,
  } from "../services/apartmentService";
  import { getHouseholdsByApartment } from "../services/householdService";
  import dashboardService from "../services/dashboardService";
  const initialForm = {
    apartmentName: "",
    address: ""
  };

  function Apartments() {
    const [apartments, setApartments] = useState([]);
    const [query, setQuery] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [households, setHouseholds] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        totalApartments: 0,
        toatalHouseholds: 0,
        totalUsers: 0,
    });
    const [showHouseholdsModal, setShowHouseholdsModal] = useState(false);

    useEffect(() => {
      loadApartments();
      loadDashboardStats();
    }, []);

    const loadApartments = async () => {
      try {
        setIsLoading(true);

        const data = await getApartments();

        setApartments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Apartment fetch error:", error);

        setApartments([]);

        toast.error(
          "Unable to load apartments."
        );
      } finally {
        setIsLoading(false);
      }
    };

    const loadDashboardStats = async () => {
        try {
            const data = await dashboardService.getDashboard();
            console.log(data);
            setDashboardStats(data);
        } catch (error) {
            console.error("Dashboard stats error:", error);
        }
    };

    const filteredApartments = useMemo(() => {
      if (!query.trim()) {
        return apartments;
      }

      const keyword = query.toLowerCase();

      return apartments.filter((apartment) => {
        return (
          apartment.name?.toLowerCase().includes(keyword) ||
          apartment.address?.toLowerCase().includes(keyword)
        );
      });
    }, [apartments, query]);

    const handleChange = (event) => {
      const { name, value } = event.target;

      setForm((previous) => ({
        ...previous,
        [name]: value,
      }));
    };

    const validateForm = () => {
      if (!form.apartmentName.trim()) {
        toast.error("Apartment name is required.");
        return false;
      }

      if (!form.address.trim()) {
        toast.error("Address is required.");
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

      const loadingToast = toast.loading("Registering apartment...");

      try {
        const savedApartment = await createApartment(apartmentPayload);

        setApartments((previous) => [savedApartment, ...previous]);

        await loadDashboardStats();

        toast.success("Apartment created successfully.", {
          id: loadingToast,
        });

        setForm(initialForm);
        setShowForm(false);
      } catch (error) {
        console.error("Apartment create error:", error);

        toast.error(
          "Failed to register apartment.Please try again.",
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

    const handleViewHouseholds = async (apartment) => {

      try {

          const data = await getHouseholdsByApartment(apartment.id);

          setSelectedApartment(apartment);
          setHouseholds(data);

          setShowHouseholdsModal(true);

      } catch (error) {

          toast.error("Unable to load households.");

          console.error(error);
      }
    };

    return (
      <AdminPageShell
        title="Apartment Management"
        description="Manage apartment complexes and organize households."
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search apartments..."
        action={
          <button
            type="button"
            className="mg-primary-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Register Apartment
          </button>
        }
      >
        <section className="mg-summary-grid">
          <StatCard
            icon={Building2}
            title="Total Apartments"
            value={dashboardStats.totalApartments}
            description="Registered apartment complexes"
            delay={0}
          />

          <StatCard
            icon={Building2}
            title="Total Households"
            value={dashboardStats.totalHouseholds}
            description="Registered households"
            delay={0.1}
          />

          <StatCard
            icon={CheckCircle2}
            title="Residents"
            value={dashboardStats.totalUsers}
            description="Registered residents"
            delay={0.2}
          />

          <StatCard
            icon={Building2}
            title="Latest Apartment"
            value={
              apartments.length > 0
                ? apartments[0].name
                : "-"
            }
            description={
              apartments.length > 0
                ? apartments[0].address
                : "No apartments yet"
            }
            delay={0.3}
          />
        </section>

        {showForm && (
          <section className="mg-panel" style={{ marginBottom: "20px" }}>
            <div className="mg-toolbar">
              <div>
                <h2>Register Apartment</h2>
                <p>
                  Enter the apartment details below.
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
                <div className="mg-form-group mg-form-group-full">
                  <label htmlFor="apartmentName">Apartment Name</label>

                  <input
                    id="apartmentName"
                    name="apartmentName"
                    type="text"
                    value={form.apartmentName}
                    onChange={handleChange}
                    placeholder="Example: Green Valley Apartments"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mg-form-group">
                  <label htmlFor="address">Address</label>

                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Sector-62, Noida"
                    disabled={isSubmitting}
                  />
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
                  {isSubmitting ? "Registering..." : "Register Apartment"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mg-panel">
          <div className="mg-toolbar">
            <div>
              <h2>Apartment Records</h2>
              <p>
                All registered apartment complexes are listed below.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="mg-empty-state">
              <Loader2 size={36} className="animate-spin" />
              <h3>Loading apartments</h3>
              <p>Please wait while apartment data is fetched.</p>
            </div>
          ) : filteredApartments.length > 0 ? (
            <div className="mg-table-wrapper">
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
                  {filteredApartments.map((apartment) => (
                    <tr key={apartment.id || apartment.name}>
                      <td>
                        <span className="mg-table-primary">
                          {apartment.name}
                        </span>
                      </td>
                      <td>{apartment.address}</td>
                        <td>
                          <span className="mg-badge">Coming Soon</span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="mg-secondary-button"
                            onClick={() =>
                              handleViewHouseholds(apartment)
                            }
                          >
                            View
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
              title="No apartments found"
              description="Create your first apartment to begin managing households."
            />
          )}
        </section>

        {showHouseholdsModal && (
      <div
          className="mg-modal-overlay"
          onClick={() => setShowHouseholdsModal(false)}
      >
          <div
              className="mg-modal"
              onClick={(e) => e.stopPropagation()}
          >

              <div className="mg-modal-header">

                  <h2>
                      Households
                  </h2>

                  <button
                      className="mg-close-button"
                      onClick={() => setShowHouseholdsModal(false)}
                  >
                      ✕
                  </button>

              </div>

              <p className="mg-modal-subtitle">

                  {selectedApartment?.name}

              </p>

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

                          <td colSpan="4">

                              No households found.

                          </td>

                      </tr>

                  ) : (

                      households.map((household) => (

                          <tr key={household.id}>

                              <td>{household.flatNumber}</td>

                              <td>

                                  {household.residentName ?? "Not Assigned"}

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

          </div>
      </div>
  )}
      </AdminPageShell>
    );
  }

  export default Apartments;