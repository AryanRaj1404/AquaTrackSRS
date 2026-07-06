package com.aquatrack.aquatrack.dto;

import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class WaterUsageLogResponse {
    private Long id;
    private Long householdId;
    private String flatNumber;
    private LocalDate usageDate;
    private Double litersConsumed;
    private String source;
    private Long billingCycleId;
}
