package com.aquatrack.aquatrack.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Household {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String flatNumber;

    @Column(nullable=false)
    private Double flatSize;

    @Column(nullable=false)
    private Integer occupancy;

    @ManyToOne(optional=false)
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    @OneToMany(mappedBy = "household")
    private List<Meter> meters;
}