package com.aquatrack.aquatrack.billing;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class CostDistributionCalculator {

     public void distributeBulkWaterCost(

        List<HouseholdBill> bills,

        double purchasedCost,

        double purchasedRate

) {

    double totalConsumption =

            bills.stream()

                    .mapToDouble(
                            HouseholdBill::getConsumptionKl)

                    .sum();

    if (totalConsumption == 0) {

        return;

    }

    for (HouseholdBill bill : bills) {

        double bulkShare =

        bill.getConsumptionKl()

        *

        purchasedRate;

        bill.setDistributedCost(
                bulkShare);

        bill.setPurchasedRate(
                purchasedRate);

        bill.setSharedAreaCharge(0.0);

        bill.setAdjustment(0.0);

        bill.setTotalAmount(

                bill.getTariffCharge()

                +

                bill.getFixedCharge()

                +

                bulkShare

        );

    }

}
}