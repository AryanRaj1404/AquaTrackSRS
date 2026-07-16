package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TariffPlanRequest {

    @NotBlank
    private String planName;

    @NotNull
    private List<TariffTierRequest> tiers;

    @NotNull
    @Positive
    private Double fixedCharge;

    private LocalDate effectiveFrom;

    private LocalDate effectiveTo;

    private String description;
}