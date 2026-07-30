import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CountUp } from "react-countup";
import dashboardService from "../services/dashboardService";
import api from "../services/api";
import SkeletonCard from "../components/SkeletonCard";
import SkeletonTable from "../components/SkeletonTable";

import {
  BadgeCheck,
  Building2,
  Clock3,
  Droplets,
  IndianRupee,
  Plus,
  Receipt,
  TriangleAlert,
  Users,
  Wallet,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import AdminAlertPanel from "../components/AdminAlertPanel";
import AdminDashboardCharts from "../components/AdminDashboardCharts";

function Dashboard() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const [dashboard, setDashboard] = useState(null);

  const [households, setHouseholds] = useState([]);

  const [apartments, setApartments] = useState([]);

  const [recentReadings, setRecentReadings] = useState([]);

  

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

    const fetchDashboard = async () => {

        try {

            const [

                dashboardData,

                apartmentsData,

                householdsData,

                usageData

            ] = await Promise.all([

                dashboardService.getDashboard(),

                api.get("/apartments"),

                api.get("/households"),

                api.get("/usage-logs")

            ]);

            setDashboard(dashboardData);

            setApartments(apartmentsData.data);

            setHouseholds(householdsData.data);

            setRecentReadings(

                usageData.data

                    .sort(

                        (a, b) =>

                            new Date(b.usageDate)

                            -

                            new Date(a.usageDate)

                    )

                    .slice(0, 5)

            );

        }

        catch (error) {

            console.error(error);

        }

    };

    fetchDashboard();

}, []);

  if (!dashboard) {
    return (
        <AdminPageShell
            title="Dashboard Overview"
            description="Loading dashboard..."
        >
            <section className="mg-summary-grid">
                {Array.from({ length: 12 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </section>

            <section className="mg-panel">
                <SkeletonTable />
            </section>
        </AdminPageShell>
    );
}

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
            title="Apartments"
            value={dashboard?.totalApartments ?? 0}
            animatedValue
            description="Registered apartments"
        />

        <StatCard
            icon={Users}
            title="Households"
            value={dashboard?.totalHouseholds ?? 0}
            animatedValue
            description="Registered households"
        />

        <StatCard
            icon={Users}
            title="Users"
            value={dashboard?.totalUsers ?? 0}
            animatedValue
            description="Registered users"
        />

        <StatCard
            icon={Droplets}
            title="Water Consumed"
            value={`${Number(
                dashboard?.totalWaterConsumedKl ?? 0
            ).toFixed(2)} KL`}
            animatedValue
            description="Household consumption"
        />
        <StatCard
            icon={Droplets}
            title="Bulk Water"
            value={`${Number(dashboard?.totalBulkWaterPurchasedKl ?? 0).toFixed(2)} KL`}
            animatedValue
            description="Purchased water"
        />

        <StatCard
            icon={Droplets}
            title="Remaining Water"
            value={`${Number(dashboard?.waterLossKl ?? 0).toFixed(2)} KL`}
            animatedValue
            description={`${dashboard?.waterLossPercentage ?? 0}% loss`}
        />

        <StatCard
            icon={IndianRupee}
            title="Revenue"
            value={`₹ ${Number(
                dashboard?.totalRevenue ?? 0
            ).toLocaleString("en-IN")}`}
            animatedValue
            description="Invoice value"
        />

        <StatCard
            icon={Wallet}
            title="Collection"
            value={`${Number(dashboard?.collectionRate ?? 0).toFixed(1)}%`}
            animatedValue
            description="Payment collection"
        />
        <StatCard
            icon={Receipt}
            title="Generated"
            value={dashboard?.generatedInvoices ?? 0}
            animatedValue
            description="Generated invoices"
        />

        <StatCard
            icon={BadgeCheck}
            title="Paid"
            value={dashboard?.paidInvoices ?? 0}
            animatedValue
            description="Paid invoices"
        />

        <StatCard
            icon={Clock3}
            title="Pending"
            value={dashboard?.pendingInvoices ?? 0}
            animatedValue
            description="Pending invoices"
        />

        <StatCard
            icon={TriangleAlert}
            title="Overdue"
            value={dashboard?.overdueInvoices ?? 0}
            animatedValue
            description="Overdue invoices"
        />
      </section>

      <section className="mt-6 mb-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AdminDashboardCharts />
        </div>
        <div className="xl:col-span-1 h-full">
          <AdminAlertPanel />
        </div>
      </section>

      <section className="mg-panel">
        <div className="mg-toolbar">
          <div>
            <h2>Registered Households</h2>
            <p>
              View all registered households and their current occupancy.
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
                  <tr className="hover:bg-slate-50 transition-colors"
                  key={household.id}>
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
              All Apartment data is displayed below.
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
                    <tr className="hover:bg-slate-50 transition-colors"
                    key={apartment.id}>
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
                  <tr className="hover:bg-slate-50 transition-colors"
                  key={reading.id}>
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