package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;

public class WaterUsageLogResponse {

    private Long id;
    private Long householdId;
    private LocalDate usageDate;
    private Double litersConsumed;
    private String source;
    private Long billingCycleId;

    public WaterUsageLogResponse(Long id, Long householdId, LocalDate usageDate,
                                  Double litersConsumed, String source, Long billingCycleId) {
        this.id = id;
        this.householdId = householdId;
        this.usageDate = usageDate;
        this.litersConsumed = litersConsumed;
        this.source = source;
        this.billingCycleId = billingCycleId;
    }

    public Long getId() { return id; }
    public Long getHouseholdId() { return householdId; }
    public LocalDate getUsageDate() { return usageDate; }
    public Double getLitersConsumed() { return litersConsumed; }
    public String getSource() { return source; }
    public Long getBillingCycleId() { return billingCycleId; }
}