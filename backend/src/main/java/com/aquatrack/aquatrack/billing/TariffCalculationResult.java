package com.aquatrack.aquatrack.billing;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TariffCalculationResult {

    private Double consumptionKl;

    private Double usageCharge;
}