import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AlertTriangle,
  Building2,
  Droplets,
  Plus,
  Users,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";

function Dashboard() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  /*
    Backend-ready structure:
    Later, these values should come from Spring Boot APIs.

    Example:
    const apartments = await getApartments();
    const residents = await getResidents();
    const alerts = await getAlerts();

    For now, keep them empty.
    Do not add fake dummy records.
  */

  const apartments = [];
  const residents = [];
  const alerts = [];
  const recentReadings = [];

  const dashboardStats = useMemo(() => {
    return {
      totalApartments: apartments.length,
      totalResidents: residents.length,
      activeAlerts: alerts.length,
      totalReadings: recentReadings.length,
    };
  }, [apartments, residents, alerts, recentReadings]);

  const filteredResidents = useMemo(() => {
    if (!query.trim()) {
      return residents;
    }

    const keyword = query.toLowerCase();

    return residents.filter((resident) => {
      return (
        resident.firstName?.toLowerCase().includes(keyword) ||
        resident.lastName?.toLowerCase().includes(keyword) ||
        resident.email?.toLowerCase().includes(keyword) ||
        resident.mobileNumber?.toLowerCase().includes(keyword) ||
        resident.username?.toLowerCase().includes(keyword)
      );
    });
  }, [query, residents]);

  const goToAddApartment = () => {
  navigate("/apartments");
};

  return (
    <AdminPageShell
      title="Dashboard Overview"
      description="Monitor residents, apartments and water-management activities."
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="Search residents, apartments..."
      action={
        <button
          type="button"
          className="mg-primary-button"
          onClick={goToAddApartment}
        >
          <Plus size={18} />
          Add Apartment
        </button>
      }
    >
      <section className="mg-summary-grid">
        <StatCard
          icon={Building2}
          title="Total Apartments"
          value={dashboardStats.totalApartments}
          description="Registered apartments"
        />

        <StatCard
          icon={Users}
          title="Total Residents"
          value={dashboardStats.totalResidents}
          description="Registered resident accounts"
        />

        <StatCard
          icon={AlertTriangle}
          title="Active Alerts"
          value={dashboardStats.activeAlerts}
          description="Alerts requiring attention"
        />

        <StatCard
          icon={Droplets}
          title="Meter Readings"
          value={dashboardStats.totalReadings}
          description="Water usage records"
        />
      </section>

      <section className="mg-panel">
        <div className="mg-toolbar">
          <div>
            <h2>Residents Overview</h2>
            <p>
              Resident data will be displayed here after backend API
              integration.
            </p>
          </div>
        </div>

        <div className="mg-table-wrapper">
          {filteredResidents.length > 0 ? (
            <table className="mg-table">
              <thead>
                <tr>
                  <th>Resident Name</th>
                  <th>Email ID</th>
                  <th>Mobile Number</th>
                  <th>Username</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredResidents.map((resident) => (
                  <tr key={resident.id}>
                    <td>
                      <span className="mg-table-primary">
                        {resident.firstName} {resident.lastName}
                      </span>
                    </td>

                    <td>{resident.email}</td>

                    <td>{resident.mobileNumber}</td>

                    <td>{resident.username}</td>

                    <td>
                      <span className="mg-status mg-status-active">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              icon={Users}
              title="No residents found"
              description="Resident data will appear here after registration or backend API connection."
            />
          )}
        </div>
      </section>

      <section className="mg-panel" style={{ marginTop: "20px" }}>
        <div className="mg-toolbar">
          <div>
            <h2>Apartments Overview</h2>
            <p>
              Apartment data will be displayed here after the Add Apartment
              feature is connected.
            </p>
          </div>

          <button
            type="button"
            className="mg-primary-button"
            onClick={goToAddApartment}
          >
            <Plus size={18} />
            Add Apartment
          </button>
        </div>

        <div className="mg-table-wrapper">
          {apartments.length > 0 ? (
            <table className="mg-table">
              <thead>
                <tr>
                  <th>Apartment Name</th>
                  <th>Location</th>
                  <th>Total Units</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {apartments.map((apartment) => (
                  <tr key={apartment.id}>
                    <td>
                      <span className="mg-table-primary">
                        {apartment.name}
                      </span>
                    </td>

                    <td>{apartment.location}</td>

                    <td>{apartment.totalUnits}</td>

                    <td>
                      <span className="mg-status mg-status-active">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              icon={Building2}
              title="No apartments found"
              description="Click Add Apartment to create a new apartment after confirming backend fields."
            />
          )}
        </div>
      </section>
    </AdminPageShell>
  );
}

export default Dashboard;