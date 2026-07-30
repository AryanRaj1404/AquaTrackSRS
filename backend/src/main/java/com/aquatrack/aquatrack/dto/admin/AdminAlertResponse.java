package com.aquatrack.aquatrack.dto.admin;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminAlertResponse {
    private Long id;
    private String title;
    private String description;
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW
    private String status;   // PENDING, RESOLVED, etc.
    private LocalDateTime time;
    private String apartmentName;
}
