package com.aquatrack.aquatrack.dto;

import com.aquatrack.aquatrack.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String firstName;

    private String lastName;

    private String email;

    private String mobileNumber;

    private String username;

    private String password;

    private Role role;
}