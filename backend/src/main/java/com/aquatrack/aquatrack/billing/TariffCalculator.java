package com.aquatrack.aquatrack.billing;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aquatrack.aquatrack.entity.TariffTier;

@Component
public class TariffCalculator {

    public TariffCalculationResult calculate(
            Double consumptionKl,
            List<TariffTier> tiers) {

        if (consumptionKl == null || consumptionKl <= 0) {
            return new TariffCalculationResult(0.0, 0.0);
        }

        tiers.sort(Comparator.comparing(TariffTier::getTierOrder));

        double remaining = consumptionKl;
        double previousLimit = 0;
        double total = 0;

        for (TariffTier tier : tiers) {

            if (remaining <= 0)
                break;

            if (tier.getUptoKl() == null) {

                total += remaining * tier.getRatePerKl();
                break;
            }

            double tierCapacity =
                    tier.getUptoKl() - previousLimit;

            double used =
                    Math.min(remaining, tierCapacity);

            total += used * tier.getRatePerKl();

            remaining -= used;

            previousLimit = tier.getUptoKl();
        }

        return new TariffCalculationResult(
                consumptionKl,
                total);
    }

}