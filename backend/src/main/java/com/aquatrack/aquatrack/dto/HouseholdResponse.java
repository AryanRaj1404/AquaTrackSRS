package com.aquatrack.aquatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdResponse {

    private Long id;
    private String flatNumber;
    private Double flatSize;
    private Integer occupancy;

    private Long apartmentId;
    private String apartmentName;

    private Long residentId;
    private String residentUsername;
    private String residentName;
}