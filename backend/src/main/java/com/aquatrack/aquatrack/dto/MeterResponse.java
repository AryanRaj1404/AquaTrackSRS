package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;

public class MeterResponse {

    private Long id;
    private String meterNumber;
    private String meterType;
    private LocalDate installedDate;
    private Boolean active;
    private Long householdId;
    private String flatNumber;

    public MeterResponse(Long id, String meterNumber, String meterType, LocalDate installedDate,
                          Boolean active, Long householdId, String flatNumber) {
        this.id = id;
        this.meterNumber = meterNumber;
        this.meterType = meterType;
        this.installedDate = installedDate;
        this.active = active;
        this.householdId = householdId;
        this.flatNumber = flatNumber;
    }

    public Long getId() { return id; }
    public String getMeterNumber() { return meterNumber; }
    public String getMeterType() { return meterType; }
    public LocalDate getInstalledDate() { return installedDate; }
    public Boolean getActive() { return active; }
    public Long getHouseholdId() { return householdId; }
    public String getFlatNumber() { return flatNumber; }
}