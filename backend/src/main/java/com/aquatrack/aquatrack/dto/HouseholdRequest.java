package com.aquatrack.aquatrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class HouseholdRequest {
    @NotBlank(message = "Flat number is required")
    private String flatNumber;

    @NotNull(message = "Flat size is required")
    @Positive(message = "Flat size must be positive")
    private Double flatSize;

    @NotNull(message = "Occupancy is required")
    @Positive(message = "Occupancy must be positive")
    private Integer occupancy;

    @NotNull(message = "Apartment id is required")
    private Long apartmentId;
}