import { Droplets, IndianRupee, CalendarClock, TrendingUp } from "lucide-react";
import StatCard from "../StatCard";
import SkeletonCard from "../SkeletonCard";

/**
 * Row of quick stat cards summarising the resident's household.
 * Expects the `overview` object returned by
 * residentDashboardService.getOverview().
 */
function QuickStatsRow({ overview, loading }) {
  if (loading || !overview) {
    return (
      <section className="mg-summary-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </section>
    );
  }

  return (
    <section className="mg-summary-grid">
      <StatCard
        icon={Droplets}
        title="This Cycle's Usage"
        value={`${overview.cycleUsageKl ?? 0} KL`}
        animatedValue={false}
        description="Consumed so far this cycle"
      />

      <StatCard
        icon={IndianRupee}
        title="Amount Due"
        value={`\u20B9 ${(overview.amountDue ?? 0).toLocaleString("en-IN")}`}
        animatedValue={false}
        description="Across unpaid invoices"
      />

      <StatCard
        icon={CalendarClock}
        title="Days Until Next Bill"
        value={overview.daysUntilNextBill ?? "-"}
        animatedValue
        description="Days left in current cycle"
      />

      <StatCard
        icon={TrendingUp}
        title="YTD Consumption"
        value={`${overview.ytdConsumptionKl ?? 0} KL`}
        animatedValue={false}
        description="Total usage so far this year"
      />
    </section>
  );
}

export default QuickStatsRow;
