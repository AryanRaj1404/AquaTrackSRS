package com.aquatrack.aquatrack.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class HouseholdResponse {
    private Long id;
    private String flatNumber;
    private Double flatSize;
    private Integer occupancy;
    private Long apartmentId;
    private String apartmentName;
}
