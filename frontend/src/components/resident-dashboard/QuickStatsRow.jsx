import { Droplets, IndianRupee, CalendarClock, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatCard from "../StatCard";
import SkeletonCard from "../SkeletonCard";

export default function QuickStatsRow({ overview, loading }) {
  const { t } = useTranslation();

  if (loading || !overview) {
    return (
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Droplets}
        title={t("residentDashboard.quickStats.cycleUsageTitle")}
        value={`${overview.cycleUsageKl ?? 0} KL`}
        animatedValue={false}
        description={t("residentDashboard.quickStats.cycleUsageDescription")}
      />

      <StatCard
        icon={IndianRupee}
        title={t("residentDashboard.quickStats.amountDueTitle")}
        value={`₹ ${(overview.amountDue ?? 0).toLocaleString("en-IN")}`}
        animatedValue={false}
        description={t("residentDashboard.quickStats.amountDueDescription")}
      />

      <StatCard
        icon={CalendarClock}
        title={t("residentDashboard.quickStats.daysUntilBillTitle")}
        value={overview.daysUntilNextBill ?? "-"}
        animatedValue
        description={t("residentDashboard.quickStats.daysUntilBillDescription")}
      />

      <StatCard
        icon={TrendingUp}
        title={t("residentDashboard.quickStats.ytdConsumptionTitle")}
        value={`${overview.ytdConsumptionKl ?? 0} KL`}
        animatedValue={false}
        description={t("residentDashboard.quickStats.ytdConsumptionDescription")}
      />
    </section>
  );
}