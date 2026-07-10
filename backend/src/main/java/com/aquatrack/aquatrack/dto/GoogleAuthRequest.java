package com.aquatrack.aquatrack.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleAuthRequest {

    @NotBlank(message="Gooagle ID Token is required")
    private String idToken;

}