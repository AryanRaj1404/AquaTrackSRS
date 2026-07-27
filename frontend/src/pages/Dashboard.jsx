import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dashboardService from "../services/dashboardService";
import SkeletonCard from "../components/SkeletonCard";

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
import StatCard from "../components/StatCard";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);

  const goToAddApartment = () => {
    navigate("/apartments");
  };
  
  useEffect(() => {

    const fetchDashboard = async () => {
        try {
          const dashboardData =
              await dashboardService.getDashboard();
          setDashboard(dashboardData);
        } catch (error) {
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
        </AdminPageShell>
    );
}

  return (
    <AdminPageShell
      title="Dashboard Overview"
      description="Monitor apartments, households, meters and water usage across the system."
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

    </AdminPageShell>
  );
}

export default Dashboard;