package com.aquatrack.aquatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TopHouseholdConsumptionResponse {

    private Long householdId;

    private String flatNumber;

    private Double consumptionKl;
}