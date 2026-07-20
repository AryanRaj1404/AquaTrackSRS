package com.aquatrack.aquatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TariffTierResponse {

    private Long id;

    private Integer tierOrder;

    private Double uptoKl;

    private Double ratePerKl;
}