package com.aquatrack.aquatrack.entity;

import java.time.LocalDate;

import com.aquatrack.aquatrack.enums.PurchaseSource;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bulk_water_purchase")
public class BulkWaterPurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    @ManyToOne(optional = false)
    @JoinColumn(name = "billing_cycle_id")
    private BillingCycle billingCycle;

    @Column(nullable = false)
    private LocalDate purchaseDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PurchaseSource source;

    @Column(nullable = false)
    private Double volumeKl;

    @Column(nullable = false)
    private Double unitCost;

    @Column(nullable = false)
    private Double totalCost;

    @Column(nullable = false)
    private String supplier;
}