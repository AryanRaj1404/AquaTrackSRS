package com.aquatrack.aquatrack.dto.admin;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentConsumptionResponse {
    private String apartmentName;
    private BigDecimal totalConsumption;
}
