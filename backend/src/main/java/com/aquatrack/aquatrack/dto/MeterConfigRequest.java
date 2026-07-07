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
public class MeterConfigRequest {
    @NotBlank(message = "Meter serial number is required")
    private String meterSerialNumber;

    @NotBlank(message = "Meter status is required")
    private String meterStatus;
}
