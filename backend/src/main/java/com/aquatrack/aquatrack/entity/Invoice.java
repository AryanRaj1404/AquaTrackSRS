package com.aquatrack.aquatrack.entity;

import java.time.LocalDate;

import com.aquatrack.aquatrack.enums.InvoiceStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "invoice")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String invoiceNumber;

    @ManyToOne(optional = false)
    @JoinColumn(name = "household_id")
    private Household household;

    @ManyToOne(optional = false)
    @JoinColumn(name = "billing_cycle_id")
    private BillingCycle billingCycle;

    @Column(nullable = false)
    private Double consumptionKl;

    @Column(nullable = false)
    private Double usageCharge;

    @Column(nullable = false)
    private Double fixedCharge;

    @Column(nullable = false)
    private Double adjustment;

    @Column(nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status;

    @Column(nullable = false)
    private LocalDate generatedDate;

    private Double tariffCharge;      // Result from tiered tariff calculation

    private Double distributedCost;   // Share of apartment purchase cost

    private Double purchasedRate;     // Optional snapshot (future analytics)

    private Double sharedAreaCharge;  // Currently 0, reserved for future
}