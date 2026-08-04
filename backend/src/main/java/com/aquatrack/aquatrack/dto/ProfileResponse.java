package com.aquatrack.aquatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ProfileResponse {

    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String username;
    private String role;
    private String provider;

    // Resident only
    private String apartmentName;
    private String flatNumber;
    private Double flatSize;
    private Integer occupancy;

}