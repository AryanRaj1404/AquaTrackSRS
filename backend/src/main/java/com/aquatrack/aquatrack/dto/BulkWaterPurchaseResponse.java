package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;

import com.aquatrack.aquatrack.enums.PurchaseSource;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BulkWaterPurchaseResponse {

    private Long id;

    private Long apartmentId;

    private Long billingCycleId;

    private LocalDate purchaseDate;

    private PurchaseSource source;

    private Double volumeKl;

    private Double unitCost;

    private Double totalCost;

    private String supplier;
}