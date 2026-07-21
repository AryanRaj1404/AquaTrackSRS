package com.aquatrack.aquatrack.billing;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

@Component
public class CostDistributionCalculator {

    public void distributeBulkWaterCost(
            List<HouseholdBill> bills,
            double purchasedCost,
            double purchasedRate) {

        List<HouseholdBill> metered = bills.stream()
                .filter(HouseholdBill::isHasMeter)
                .collect(Collectors.toList());

        List<HouseholdBill> unmetered = bills.stream()
                .filter(b -> !b.isHasMeter())
                .collect(Collectors.toList());

        double totalFlatSize = bills.stream()
                .mapToDouble(b -> b.getFlatSize() != null ? b.getFlatSize() : 0.0)
                .sum();

        double unmeteredFlatSize = unmetered.stream()
                .mapToDouble(b -> b.getFlatSize() != null ? b.getFlatSize() : 0.0)
                .sum();

        // Portion of the bulk cost attributed to unmetered households,
        // based on their share of the apartment's total flat area.
        double unmeteredCostPool = totalFlatSize > 0
                ? purchasedCost * (unmeteredFlatSize / totalFlatSize)
                : 0.0;

        double meteredCostPool = purchasedCost - unmeteredCostPool;

        double totalMeteredConsumption = metered.stream()
                .mapToDouble(HouseholdBill::getConsumptionKl)
                .sum();

        // Metered households: split their pool by consumption share.
        for (HouseholdBill bill : metered) {
            double bulkShare = totalMeteredConsumption > 0
                    ? meteredCostPool * (bill.getConsumptionKl() / totalMeteredConsumption)
                    : (metered.isEmpty() ? 0.0 : meteredCostPool / metered.size());

            applyShare(bill, bulkShare, purchasedRate);
        }

        // Unmetered households: split their pool by flat-size share.
        for (HouseholdBill bill : unmetered) {
            double flatSize = bill.getFlatSize() != null ? bill.getFlatSize() : 0.0;
            double bulkShare = unmeteredFlatSize > 0
                    ? unmeteredCostPool * (flatSize / unmeteredFlatSize)
                    : (unmetered.isEmpty() ? 0.0 : unmeteredCostPool / unmetered.size());

            applyShare(bill, bulkShare, purchasedRate);
        }
    }

    private void applyShare(HouseholdBill bill, double bulkShare, double purchasedRate) {
        bill.setDistributedCost(bulkShare);
        bill.setPurchasedRate(purchasedRate);
        bill.setSharedAreaCharge(bill.isHasMeter() ? 0.0 : bulkShare);
        bill.setAdjustment(0.0);
        bill.setTotalAmount(
                bill.getTariffCharge()
                + bill.getFixedCharge()
                + bulkShare
        );
    }
}