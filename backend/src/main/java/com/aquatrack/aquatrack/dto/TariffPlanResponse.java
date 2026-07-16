package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TariffPlanResponse {

    private Long id;
    private String planName;
    private List<TariffTierResponse> tiers;
    private Double fixedCharge;
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
    private String description;
}