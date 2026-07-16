package com.aquatrack.aquatrack.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TariffTierRequest {

    @NotNull
    private Long tariffPlanId;

    @NotNull
    private Integer tierOrder;

    private Double uptoKl;

    @NotNull
    private Double ratePerKl;
}