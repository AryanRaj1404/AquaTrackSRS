package com.aquatrack.aquatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class HouseholdResponse {
    private Long id;
    private String flatNumber;
    private Double flatSize;
    private Integer occupancy;
    private Long residentId;
    private String residentEmail;
    private Long apartmentId;
    private String apartmentName;
}
