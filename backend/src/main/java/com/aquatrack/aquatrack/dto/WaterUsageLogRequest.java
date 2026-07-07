package com.aquatrack.aquatrack.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public class WaterUsageLogRequest {

    @NotNull
    private Long householdId;

    @NotNull
    private LocalDate usageDate;

    @NotNull
    @PositiveOrZero
    private Double litersConsumed;

    private Long billingCycleId; // optional

    public Long getHouseholdId() { return householdId; }
    public void setHouseholdId(Long householdId) { this.householdId = householdId; }

    public LocalDate getUsageDate() { return usageDate; }
    public void setUsageDate(LocalDate usageDate) { this.usageDate = usageDate; }

    public Double getLitersConsumed() { return litersConsumed; }
    public void setLitersConsumed(Double litersConsumed) { this.litersConsumed = litersConsumed; }

    public Long getBillingCycleId() { return billingCycleId; }
    public void setBillingCycleId(Long billingCycleId) { this.billingCycleId = billingCycleId; }
}