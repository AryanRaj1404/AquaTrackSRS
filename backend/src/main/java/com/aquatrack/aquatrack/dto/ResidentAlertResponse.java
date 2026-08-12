package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.aquatrack.aquatrack.entity.UsageAlert;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResidentAlertResponse {

    private Long id;

    private UsageAlert.AlertType alertType;

    private String message;

    private Double litersConsumed;

    private Double thresholdValue;

    private Double householdAverage;

    private boolean acknowledged;

    private LocalDate triggeredOn;

    private LocalDateTime createdAt;

    public static ResidentAlertResponse from(UsageAlert alert) {

        ResidentAlertResponse dto = new ResidentAlertResponse();

        dto.setId(alert.getId());
        dto.setAlertType(alert.getAlertType());
        dto.setMessage(alert.getMessage());
        dto.setLitersConsumed(alert.getLitersConsumed());
        dto.setThresholdValue(alert.getThresholdValue());
        dto.setHouseholdAverage(alert.getHouseholdAverage());
        dto.setAcknowledged(alert.isAcknowledged());
        dto.setTriggeredOn(alert.getTriggeredOn());
        dto.setCreatedAt(alert.getCreatedAt());

        return dto;
    }
}