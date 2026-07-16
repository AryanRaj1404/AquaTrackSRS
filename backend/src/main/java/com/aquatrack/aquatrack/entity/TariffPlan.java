package com.aquatrack.aquatrack.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TariffPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String planName;
    
    @Column(nullable=false)
    private Double fixedCharge;
    
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
    private String description;

    @OneToMany(
        mappedBy = "tariffPlan",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<TariffTier> tiers = new ArrayList<>();
}
