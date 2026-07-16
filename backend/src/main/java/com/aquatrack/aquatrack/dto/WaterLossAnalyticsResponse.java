package com.aquatrack.aquatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class WaterLossAnalyticsResponse {

    private Long billingCycleId;

    private String period;

    private Double purchasedKl;

    private Double consumedKl;

    private Double lossKl;

    private Double lossPercentage;
}