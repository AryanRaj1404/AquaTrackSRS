package com.aquatrack.aquatrack.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProfileUpdateRequest {
    @NotBlank(message = "Username is required")
    private String username;
    
    private String password; // optional password update
    
    private String firstName;
    private String lastName;

    @Email(message = "Email must be a valid email address")
    private String email;

    @Pattern(regexp = "^[0-9+\\-\\s]{7,15}$", message = "Phone number must be 7-15 digits, optionally with + or -")
    private String phoneNumber;
}
