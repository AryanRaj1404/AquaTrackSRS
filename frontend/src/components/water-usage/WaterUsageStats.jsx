import {
    Droplets,
    Home,
    ClipboardList,
    BarChart3,
} from "lucide-react";

import StatCard from "../StatCard";

function WaterUsageStats({

    totalUsage,

    displayedHouseholds,

    totalLogs,

    averageUsage,

}) {

    return (

        <section className="mg-summary-grid">

            <StatCard
                icon={Droplets}
                title="Total Usage"
                value={`${totalUsage.toFixed(0)} L`}
                description="Total recorded consumption"
                delay={0}
            />

            <StatCard
                icon={Home}
                title="Households"
                value={displayedHouseholds}
                description="Households in current view"
                delay={0.1}
            />

            <StatCard
                icon={ClipboardList}
                title="Readings"
                value={totalLogs}
                description="Usage records"
                delay={0.2}
            />

            <StatCard
                icon={BarChart3}
                title="Average Consumption"
                value={`${averageUsage.toFixed(0)} L`}
                description="Per recorded reading"
                delay={0.3}
            />

        </section>

    );

}

export default WaterUsageStats;