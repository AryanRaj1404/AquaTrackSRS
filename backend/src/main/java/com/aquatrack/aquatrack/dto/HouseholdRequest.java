package com.aquatrack.aquatrack.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class HouseholdRequest {
    private String flatNumber;
    private Double flatSize;
    private Integer occupancy;
    private Long apartmentId;
}
