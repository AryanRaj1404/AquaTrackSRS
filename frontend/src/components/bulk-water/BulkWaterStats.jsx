import {
    Truck,
    Droplets,
    IndianRupee,
    Calendar,
} from "lucide-react";

import StatCard from "../StatCard";
import { useTranslation } from "react-i18next";

function BulkWaterStats({

    totalPurchases,

    totalVolume,

    totalCost,

    averageRate,

}) {

    const { t } = useTranslation();

    return (

        <section className="mg-summary-grid">

            <StatCard
                icon={Truck}
                title={t("bulkWaterPurchases.stats.purchasesTitle")}
                value={totalPurchases}
                description={t("bulkWaterPurchases.stats.purchasesDesc")}
                delay={0}
            />

            <StatCard
                icon={Droplets}
                title={t("bulkWaterPurchases.stats.volumeTitle")}
                value={`${totalVolume.toFixed(2)} KL`}
                description={t("bulkWaterPurchases.stats.volumeDesc")}
                delay={0.1}
            />

            <StatCard
                icon={IndianRupee}
                title={t("bulkWaterPurchases.stats.costTitle")}
                value={`₹ ${totalCost.toLocaleString("en-IN")}`}
                description={t("bulkWaterPurchases.stats.costDesc")}
                delay={0.2}
            />

            <StatCard
                icon={Calendar}
                title={t("bulkWaterPurchases.stats.rateTitle")}
                value={`₹ ${averageRate.toFixed(2)}/KL`}
                description={t("bulkWaterPurchases.stats.rateDesc")}
                delay={0.3}
            />

        </section>

    );

}

export default BulkWaterStats;