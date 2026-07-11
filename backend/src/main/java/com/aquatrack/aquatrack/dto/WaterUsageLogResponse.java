package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;

public class WaterUsageLogResponse {

    private Long id;
    private Long householdId;
    private String flatNumber;
    private String apartmentName;

    private LocalDate usageDate;
    private Double litersConsumed;

    private String source;

    private Long billingCycleId;

    public WaterUsageLogResponse(Long id, Long householdId, String flatNumber,String apartmentName, LocalDate usageDate,
                                  Double litersConsumed, String source, Long billingCycleId) {
        this.id = id;
        this.householdId = householdId;
        this.flatNumber = flatNumber;
        this.apartmentName = apartmentName;
        this.usageDate = usageDate;
        this.litersConsumed = litersConsumed;
        this.source = source;
        this.billingCycleId = billingCycleId;
    }

    public Long getId() { return id; }
    public Long getHouseholdId() { return householdId; }
    public String getFlatNumber(){ return flatNumber;}
    public String getApartmentName(){ return apartmentName; }
    public LocalDate getUsageDate() { return usageDate; }
    public Double getLitersConsumed() { return litersConsumed; }
    public String getSource() { return source; }
    public Long getBillingCycleId() { return billingCycleId; }
}