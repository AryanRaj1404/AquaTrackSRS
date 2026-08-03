package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResidentOverviewResponse {

    private Long householdId;
    private String flatNumber;
    private String apartmentName;

    private String meterNumber;
    private String meterType;

    // Current billing cycle summary (nullable if no OPEN cycle)
    private Long currentCycleId;
    private LocalDate cycleStartDate;
    private LocalDate cycleEndDate;
    private String cycleStatus;
    private Long daysRemaining;
    private Double cycleConsumptionKl;
    private Double estimatedCost;
    private String tariffPlanName;

    // Quick stats
    private Double cycleUsageKl;
    private Double amountDue;
    private Long daysUntilNextBill;
    private Double ytdConsumptionKl;
}