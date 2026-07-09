package com.aquatrack.aquatrack.entity;

import java.time.LocalDate;

import com.aquatrack.aquatrack.enums.UsageSource;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WaterUsageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate usageDate;
    private Double litersConsumed;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private UsageSource source;

    @ManyToOne(optional=false)
    @JoinColumn(name = "household_id", nullable=false)
    private Household household;

    @ManyToOne
    @JoinColumn(name = "billing_cycle_id")
    private BillingCycle billingCycle;
}
