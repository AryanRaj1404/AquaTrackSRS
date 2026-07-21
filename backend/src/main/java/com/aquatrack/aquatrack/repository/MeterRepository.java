package com.aquatrack.aquatrack.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.Meter;
public interface MeterRepository extends JpaRepository<Meter, Long> {
    boolean existsByMeterNumber(String meterNumber);
    boolean existsByMeterNumberAndIdNot(String meterNumber, Long id);
    List<Meter> findByHouseholdId(Long householdId);
    boolean existsByHouseholdIdAndActiveTrue(Long householdId);
}