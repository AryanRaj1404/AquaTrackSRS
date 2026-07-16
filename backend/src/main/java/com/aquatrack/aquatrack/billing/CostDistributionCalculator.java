package com.aquatrack.aquatrack.billing;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class CostDistributionCalculator {

    public void distributeAdjustment(
            List<HouseholdBill> bills,
            double adjustmentPool) {

        double totalConsumption = bills.stream()
                .mapToDouble(HouseholdBill::getConsumptionKl)
                .sum();

        if (totalConsumption == 0)
            return;

        for (HouseholdBill bill : bills) {

        double percentage =
                bill.getConsumptionKl() / totalConsumption;

        double distributedCost =
                adjustmentPool * percentage;

        bill.setDistributedCost(distributedCost);

        // No manual adjustment yet
        bill.setAdjustment(0.0);

        bill.setSharedAreaCharge(0.0);

        bill.setTotalAmount(

                bill.getTariffCharge()

                + bill.getFixedCharge()

                + distributedCost

                + bill.getSharedAreaCharge()

                + bill.getAdjustment()
        );
        }
    }
}