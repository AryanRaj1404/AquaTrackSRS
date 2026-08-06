import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import AlertsPanel from "../components/AlertsPanel";
import Charts from "../components/Charts";
import UsageComparisonChart from "../components/UsageComparisonChart";
import WaterTips from "../components/WaterTips";

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
            title={t("dashboard.overview")}
            description={t("dashboard.loadingDashboard")}
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
      title={t("dashboard.overview")}
      description={t("dashboard.registeredHouseholdsDesc")}
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder={t("dashboard.searchHouseholdsApartments")}
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
      <section className="mg-summary-grid">        <StatCard
            icon={Building2}
            title={t("dashboard.apartments")}
            value={dashboard?.totalApartments ?? 0}
            animatedValue
            description={t("dashboard.registeredApartments")}
        />

        <StatCard
            icon={Users}
            title={t("dashboard.households")}
            value={dashboard?.totalHouseholds ?? 0}
            animatedValue
            description={t("dashboard.registeredHouseholds")}
        />

        <StatCard
            icon={Users}
            title={t("dashboard.users")}
            value={dashboard?.totalUsers ?? 0}
            animatedValue
            description={t("dashboard.registeredUsers")}
        />

        <StatCard
            icon={Droplets}
            title={t("dashboard.waterConsumed")}
            value={`${Number(
                dashboard?.totalWaterConsumedKl ?? 0
            ).toFixed(2)} KL`}
            animatedValue
            description={t("dashboard.householdConsumption")}
        />
        <StatCard
            icon={Droplets}
            title={t("dashboard.bulkWater")}
            value={`${Number(dashboard?.totalBulkWaterPurchasedKl ?? 0).toFixed(2)} KL`}
            animatedValue
            description={t("dashboard.purchasedWater")}
        />

        <StatCard
            icon={Droplets}
            title={t("dashboard.remainingWater")}
            value={`${Number(dashboard?.waterLossKl ?? 0).toFixed(2)} KL`}
            animatedValue
            description={`${dashboard?.waterLossPercentage ?? 0}${t("dashboard.lossSuffix")}`}
        />

        <StatCard
            icon={IndianRupee}
            title={t("dashboard.totalRevenue")}
            value={`₹ ${Number(
                dashboard?.totalRevenue ?? 0
            ).toLocaleString("en-IN")}`}
            animatedValue
            description={t("dashboard.revenuePerformance")}
        />

        <StatCard
            icon={Wallet}
            title={t("dashboard.collection")}
            value={`${Number(dashboard?.collectionRate ?? 0).toFixed(1)}%`}
            animatedValue
            description={t("dashboard.paymentCollection")}
        />
        <StatCard
            icon={Receipt}
            title={t("dashboard.generated")}
            value={dashboard?.generatedInvoices ?? 0}
            animatedValue
            description={t("dashboard.generatedInvoices")}
        />

        <StatCard
            icon={BadgeCheck}
            title={t("dashboard.paid")}
            value={dashboard?.paidInvoices ?? 0}
            animatedValue
            description={t("dashboard.paidInvoices")}
        />

        <StatCard
            icon={Clock3}
            title={t("dashboard.pending")}
            value={dashboard?.pendingInvoices ?? 0}
            animatedValue
            description={t("dashboard.pendingInvoices")}
        />

        <StatCard
            icon={TriangleAlert}
            title={t("dashboard.overdue")}
            value={dashboard?.overdueInvoices ?? 0}
            animatedValue
            description={t("dashboard.overdueInvoices")}
        />
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

                    <td>{household.residentName ?? t("dashboard.notAssigned")}</td>

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
              title={t("dashboard.noResidentsFound")}
              description={t("dashboard.noResidentsDesc")}
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
              title={t("dashboard.noApartmentsFound")}
              description={t("dashboard.noApartmentsDesc")}
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
              title={t("dashboard.noUsageLogsFound")}
              description={t("dashboard.noUsageLogsDesc")}            />
          )}
        </div>
      </section>

      <section style={{ marginTop: "20px", display: "grid", gap: "20px" }}>
        <AlertsPanel householdId={29} />
        <Charts />
        <UsageComparisonChart />
        <WaterTips />
      </section>
    </AdminPageShell>
  );
}

export default Dashboard;