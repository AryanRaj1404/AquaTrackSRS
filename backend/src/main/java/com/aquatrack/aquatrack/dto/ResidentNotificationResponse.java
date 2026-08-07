package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResidentNotificationResponse {

    private Long id;
    private String alertType;
    private String message;
    private LocalDate triggeredOn;
    private LocalDateTime createdAt;
    private boolean read;
    private Double litersConsumed;
    private Double thresholdValue;
}
