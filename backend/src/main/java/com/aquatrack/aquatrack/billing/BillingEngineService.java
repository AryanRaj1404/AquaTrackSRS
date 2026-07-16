package com.aquatrack.aquatrack.billing;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.entity.BulkWaterPurchase;
import com.aquatrack.aquatrack.entity.TariffPlan;

@Service
public class BillingEngineService {

    private final TariffCalculator tariffCalculator;
    private final BulkWaterCostCalculator bulkWaterCostCalculator;
    private final CostDistributionCalculator costDistributionCalculator;

    public BillingEngineService(
            TariffCalculator tariffCalculator,
            BulkWaterCostCalculator bulkWaterCostCalculator,
            CostDistributionCalculator costDistributionCalculator) {

        this.tariffCalculator = tariffCalculator;
        this.bulkWaterCostCalculator = bulkWaterCostCalculator;
        this.costDistributionCalculator = costDistributionCalculator;
    }

    public HouseholdBill calculateHouseholdBill(
            Long householdId,
            Double consumptionKl,
            TariffPlan tariffPlan) {

        TariffCalculationResult result =
                tariffCalculator.calculate(
                        consumptionKl,
                        tariffPlan.getTiers());

        double fixedCharge = tariffPlan.getFixedCharge();

        return HouseholdBill.builder()
                .householdId(householdId)
                .consumptionKl(consumptionKl)
                .usageCharge(result.getUsageCharge())
                .tariffCharge(result.getUsageCharge())
                .distributedCost(0.0)
                .purchasedRate(0.0)
                .sharedAreaCharge(0.0)
                .fixedCharge(fixedCharge)
                .tariffCharge(result.getUsageCharge())
                .distributedCost(0.0)
                .purchasedRate(0.0)
                .sharedAreaCharge(0.0)
                .adjustment(0.0)
                .totalAmount(
                        result.getUsageCharge()
                        + fixedCharge)
                .build();
    }

    public BillingSummary summarizeBillingCycle(
            List<BulkWaterPurchase> purchases,
            List<HouseholdBill> bills) {

        double purchasedVolume =
                bulkWaterCostCalculator.calculateTotalVolume(purchases);

        double purchasedCost =
                bulkWaterCostCalculator.calculateTotalCost(purchases);

        double purchasedRate = 0;

        if (purchasedVolume > 0) {

        purchasedRate =
                purchasedCost / purchasedVolume;
        }

        double totalConsumption =
                bills.stream()
                        .mapToDouble(HouseholdBill::getConsumptionKl)
                        .sum();

        double totalCollected =
                bills.stream()
                        .mapToDouble(HouseholdBill::getTotalAmount)
                        .sum();

        double adjustmentPool = purchasedCost - totalCollected;

        costDistributionCalculator.distributeAdjustment(
                bills,
                adjustmentPool);

        return BillingSummary.builder()
                .totalPurchasedVolume(purchasedVolume)
                .totalPurchasedCost(purchasedCost)
                .totalConsumption(totalConsumption)
                .totalCollected(totalCollected)
                .adjustmentPool(adjustmentPool)
                .purchasedRate(purchasedRate)
                .build();
    }
}