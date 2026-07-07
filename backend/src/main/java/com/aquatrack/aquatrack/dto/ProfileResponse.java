package com.aquatrack.aquatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProfileResponse {
    private Long id;
    private String username;
    private String role;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Long householdId;
    private String flatNumber;
}
