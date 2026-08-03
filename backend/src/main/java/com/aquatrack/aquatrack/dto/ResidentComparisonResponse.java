package com.aquatrack.aquatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResidentComparisonResponse {

    private String cycleLabel;
    private Double householdConsumptionKl;
    private Double buildingAverageKl;
    private int householdsCompared;
}