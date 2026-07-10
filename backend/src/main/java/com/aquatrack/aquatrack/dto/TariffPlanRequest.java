package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;

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
    @Positive
    private Double ratePerUnit;

    @NotNull
    @Positive
    private Double fixedCharge;

    private LocalDate effectiveFrom;

    private LocalDate effectiveTo;

    private String description;
}