package com.aquatrack.aquatrack.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public class WaterUsageLogRequest {

    @NotNull(message = "Household is required")
    private Long householdId;

    @NotNull(message = "Usage date is required")
    private LocalDate usageDate;

    @NotNull(message = "Liters consumed is required")
    @PositiveOrZero(message = "Liters consumed cannot be negative")
    private Double litersConsumed;

    private Long billingCycleId;

    public Long getHouseholdId() { return householdId; }
    public void setHouseholdId(Long householdId) { this.householdId = householdId; }

    public LocalDate getUsageDate() { return usageDate; }
    public void setUsageDate(LocalDate usageDate) { this.usageDate = usageDate; }

    public Double getLitersConsumed() { return litersConsumed; }
    public void setLitersConsumed(Double litersConsumed) { this.litersConsumed = litersConsumed; }

    public Long getBillingCycleId() { return billingCycleId; }
    public void setBillingCycleId(Long billingCycleId) { this.billingCycleId = billingCycleId; }
}