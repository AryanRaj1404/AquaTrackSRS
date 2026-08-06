import {
    Droplets,
    Home,
    ClipboardList,
    BarChart3,
} from "lucide-react";

import StatCard from "../StatCard";
import { useTranslation } from "react-i18next";

function WaterUsageStats({

    totalUsage,

    displayedHouseholds,

    totalLogs,

    averageUsage,

}) {

    const { t } = useTranslation();

    return (

        <section className="mg-summary-grid">

            <StatCard
                icon={Droplets}
                title={t("waterUsage.stats.totalUsageTitle")}
                value={`${totalUsage.toFixed(0)} L`}
                description={t("waterUsage.stats.totalUsageDesc")}
                delay={0}
            />

            <StatCard
                icon={Home}
                title={t("waterUsage.stats.householdsTitle")}
                value={displayedHouseholds}
                description={t("waterUsage.stats.householdsDesc")}
                delay={0.1}
            />

            <StatCard
                icon={ClipboardList}
                title={t("waterUsage.stats.readingsTitle")}
                value={totalLogs}
                description={t("waterUsage.stats.readingsDesc")}
                delay={0.2}
            />

            <StatCard
                icon={BarChart3}
                title={t("waterUsage.stats.avgTitle")}
                value={`${averageUsage.toFixed(0)} L`}
                description={t("waterUsage.stats.avgDesc")}
                delay={0.3}
            />

        </section>

    );

}

export default WaterUsageStats;