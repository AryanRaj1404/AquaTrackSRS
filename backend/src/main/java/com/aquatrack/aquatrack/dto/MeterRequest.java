package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;

import com.aquatrack.aquatrack.enums.MeterType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MeterRequest {

    @NotBlank(message = "Meter number is required")
    private String meterNumber;

    @NotNull(message = "Meter type is required")
    private MeterType meterType;

    @NotNull(message = "Installation date is required")
    private LocalDate installedDate;

    @NotNull(message = "Household is required")
    private Long householdId;

    public String getMeterNumber() { return meterNumber; }
    public void setMeterNumber(String meterNumber) { this.meterNumber = meterNumber; }

    public MeterType getMeterType() { return meterType; }
    public void setMeterType(MeterType meterType) { this.meterType = meterType; }

    public LocalDate getInstalledDate() { return installedDate; }
    public void setInstalledDate(LocalDate installedDate) { this.installedDate = installedDate; }

    public Long getHouseholdId() { return householdId; }
    public void setHouseholdId(Long householdId) { this.householdId = householdId; }
}