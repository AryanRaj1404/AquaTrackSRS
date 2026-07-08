package com.aquatrack.aquatrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.Meter;

public interface MeterRepository extends JpaRepository<Meter, Long> {
    List<Meter> findByHouseholdId(Long householdId);
    Optional<Meter> findByMeterNumber(String meterNumber);
    boolean existsByMeterNumber(String meterNumber);
}