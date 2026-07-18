package com.aquatrack.aquatrack.billing;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BillingSummary {

    private Double totalPurchasedVolume;

    private Double totalPurchasedCost;

    private Double totalConsumption;

    private Double totalCollected;

    private Double purchasedRate;
}