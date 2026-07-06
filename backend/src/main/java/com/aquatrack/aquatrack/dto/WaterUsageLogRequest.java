package com.aquatrack.aquatrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class WaterUsageLogRequest {
    @NotNull(message = "Household id is required")
    private Long householdId;

    @NotNull(message = "Usage date is required")
    private LocalDate usageDate;

    @NotNull(message = "Liters consumed is required")
    @PositiveOrZero(message = "Liters consumed cannot be negative")
    private Double litersConsumed;

    @NotBlank(message = "Source is required")
    private String source;

    private Long billingCycleId;
}
