package com.aquatrack.aquatrack.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ApartmentRequest {
    
    @NotBlank(message="Apartment name is required")
    private String name;

    @NotBlank(message="Apartment address is required")
    private String address;
}
