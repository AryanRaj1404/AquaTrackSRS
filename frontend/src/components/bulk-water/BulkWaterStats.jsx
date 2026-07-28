import {
    Truck,
    Droplets,
    IndianRupee,
    Calendar,
} from "lucide-react";

import StatCard from "../StatCard";

function BulkWaterStats({

    totalPurchases,

    totalVolume,

    totalCost,

    averageRate,

}) {

    return (

        <section className="mg-summary-grid">

            <StatCard
                icon={Truck}
                title="Purchases"
                value={totalPurchases}
                description="Purchases recorded"
                delay={0}
            />

            <StatCard
                icon={Droplets}
                title="Volume"
                value={`${totalVolume.toFixed(2)} KL`}
                description="Purchased water"
                delay={0.1}
            />

            <StatCard
                icon={IndianRupee}
                title="Total Cost"
                value={`₹ ${totalCost.toLocaleString("en-IN")}`}
                description="Total expenditure"
                delay={0.2}
            />

            <StatCard
                icon={Calendar}
                title="Average Rate"
                value={`₹ ${averageRate.toFixed(2)}/KL`}
                description="Average purchase rate"
                delay={0.3}
            />

        </section>

    );

}

export default BulkWaterStats;