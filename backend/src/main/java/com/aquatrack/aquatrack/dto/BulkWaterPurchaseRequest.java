package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;

import com.aquatrack.aquatrack.enums.PurchaseSource;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BulkWaterPurchaseRequest {

    @NotNull
    private Long apartmentId;

    @NotNull
    private Long billingCycleId;

    @NotNull
    private LocalDate purchaseDate;

    @NotNull
    private PurchaseSource source;

    @NotNull
    @Positive
    private Double volumeKl;

    @NotNull
    @Positive
    private Double unitCost;

    @NotBlank
    private String supplier;
}