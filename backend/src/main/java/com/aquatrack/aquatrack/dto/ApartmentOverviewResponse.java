package com.aquatrack.aquatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentOverviewResponse {

    private Long id;

    private String name;

    private String address;

    private long householdCount;

    private long residentCount;

    private long occupiedHouseholds;

    private long vacantHouseholds;

    private double averageOccupancy;
}