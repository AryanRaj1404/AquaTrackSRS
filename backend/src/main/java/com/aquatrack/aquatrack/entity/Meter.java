package com.aquatrack.aquatrack.entity;

import java.time.LocalDate;

import com.aquatrack.aquatrack.enums.MeterType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Meter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String meterNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeterType meterType;

    private LocalDate installedDate;

    @Column(nullable = false)
    private Boolean active = true;

    @ManyToOne(optional=false)
    @JoinColumn(name = "household_id", nullable=false)
    private Household household;
}