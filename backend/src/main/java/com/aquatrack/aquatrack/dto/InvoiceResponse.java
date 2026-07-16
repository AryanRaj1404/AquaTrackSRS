package com.aquatrack.aquatrack.dto;

import java.time.LocalDate;

import com.aquatrack.aquatrack.enums.InvoiceStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class InvoiceResponse {

    private Long id;

    private String invoiceNumber;

    private Long householdId;

    private String flatNumber;

    private Long apartmentId;

    private String apartmentName;

    private Long billingCycleId;

    private Double consumptionKl;

    private Double usageCharge;

    private Double fixedCharge;

    private Double tariffCharge;

    private Double distributedCost;

    private Double purchasedRate;

    private Double sharedAreaCharge;

    private Double adjustment;

    private Double totalAmount;

    private InvoiceStatus status;

    private LocalDate generatedDate;
}