package com.aquatrack.aquatrack.billing;

import java.util.List;

import org.springframework.stereotype.Component;

import com.aquatrack.aquatrack.entity.BulkWaterPurchase;

@Component
public class BulkWaterCostCalculator {

    public Double calculateTotalCost(
            List<BulkWaterPurchase> purchases) {

        return purchases.stream()
                .mapToDouble(BulkWaterPurchase::getTotalCost)
                .sum();
    }

    public Double calculateTotalVolume(
            List<BulkWaterPurchase> purchases) {

        return purchases.stream()
                .mapToDouble(BulkWaterPurchase::getVolumeKl)
                .sum();
    }

}