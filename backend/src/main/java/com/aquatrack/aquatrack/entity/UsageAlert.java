package com.aquatrack.aquatrack.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsageAlert {

    public enum AlertType { THRESHOLD_BREACH, ANOMALY_LEAK }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertType alertType;

    @Column(nullable = false)
    private LocalDate triggeredOn;

    private Double litersConsumed;
    private Double thresholdValue;

    @Column(length = 500)
    private String message;

    private boolean acknowledged = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}