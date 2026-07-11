import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
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

  const [apartments, setApartments] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [meters, setMeters] = useState([]);
  const [recentReadings, setRecentReadings] = useState([]);

  const dashboardStats = useMemo(() => ({
    totalApartments: apartments.length,
    totalHouseholds: households.length,
    totalMeters: meters.length,
    totalUsageLogs: recentReadings.length,
  }), [apartments, households, meters, recentReadings]);

  const filteredHouseholds = useMemo(() => {
    if (!query.trim()) {
      return households;
    }

    const keyword = query.toLowerCase();

    return households.filter((household) => {
      return (
        household.flatNumber?.toLowerCase().includes(keyword)
      );
    });
  }, [query, households]);

  const goToAddApartment = () => {
    navigate("/apartments");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [
          apartmentRes,
          householdRes,
          meterRes,
          usageRes,
        ] = await Promise.all([
          axios.get("http://localhost:8080/apartments", config),
          axios.get("http://localhost:8080/households", config),
          axios.get("http://localhost:8080/meters", config),
          axios.get("http://localhost:8080/usage-logs", config),
        ]);

        setApartments(apartmentRes.data);
        setHouseholds(householdRes.data);
        setMeters(meterRes.data);

        setRecentReadings(
          usageRes.data
            .sort(
              (a, b) =>
                new Date(b.usageDate) -
                new Date(a.usageDate)
            )
            .slice(0, 5)
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminPageShell
      title="Dashboard Overview"
      description="Monitor apartments, households, meters and water usage across the system."
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="Search households or apartments..."
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
          title="Total Households"
          value={dashboardStats.totalHouseholds}
          description="Registered households"
        />

        <StatCard
          icon={Building2}
          title="Total Meters"
          value={dashboardStats.totalMeters}
          description="Installed water meters"
        />

        <StatCard
          icon={Droplets}
          title="Water Usage Logs"
          value={dashboardStats.totalUsageLogs}
          description="Recorded usage entries"
        />
      </section>

      <section className="mg-panel">
        <div className="mg-toolbar">
          <div>
            <h2>Registered Households</h2>
            <p>
              Household information will appear here after backend API
              integration.
            </p>
          </div>
        </div>

        <div className="mg-table-wrapper">
          {filteredHouseholds.length > 0 ? (
            <table className="mg-table">
              <thead>
                <tr>
                  <th>Flat Number</th>
                  <th>Apartment</th>
                  <th>Resident</th>
                  <th>Occupancy</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredHouseholds.map((household) => (
                  <tr key={household.id}>
                    <td>
                      <span className="mg-table-primary">
                        {household.flatNumber}
                      </span>
                    </td>

                    <td>{household.apartmentName}</td>

                    <td>{household.residentName ?? "Not Assigned"}</td>

                    <td>{household.occupancy}</td>

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
            <h2>Registered Apartments</h2>
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
                  <th>Apartment</th>
                  <th>Address</th>
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

                      <td>{apartment.address}</td>

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
      <section className="mg-panel" style={{ marginTop: "20px" }}>
        <div className="mg-toolbar">
          <div>
            <h2>Recent Water Usage Logs</h2>
            <p>
              Latest water usage entries recorded in the system.
            </p>
          </div>
        </div>

        <div className="mg-table-wrapper">
          {recentReadings.length > 0 ? (
            <table className="mg-table">
              <thead>
                <tr>
                  <th>Apartment</th>
                  <th>Flat</th>
                  <th>Usage Date</th>
                  <th>Liters</th>
                  <th>Source</th>
                </tr>
              </thead>

              <tbody>
                {recentReadings.map((reading) => (
                  <tr key={reading.id}>
                    <td>{reading.apartmentName}</td>

                    <td>
                      <span className="mg-table-primary">
                        {reading.flatNumber}
                      </span>
                    </td>

                    <td>{reading.usageDate}</td>

                    <td>{reading.litersConsumed} L</td>

                    <td>{reading.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              icon={Droplets}
              title="No water usage logs found"
              description="Water usage records will appear here after they are added."
            />
          )}
        </div>
      </section>
    </AdminPageShell>
  );
}

export default Dashboard;