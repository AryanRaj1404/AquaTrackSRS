package com.aquatrack.aquatrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Pattern(
        regexp = "^$|^[0-9]{10}$",
        message = "Mobile number must contain exactly 10 digits"
    )
    private String mobileNumber;
}