package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;

import com.aquatrack.aquatrack.enums.BillingCycleStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BillingCycleResponse {

    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalAmount;
    private BillingCycleStatus status;

    private Long apartmentId;
    private String apartmentName;

    private Long tariffPlanId;
    private String tariffPlanName;
}