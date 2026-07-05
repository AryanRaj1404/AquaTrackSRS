package com.aquatrack.aquatrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.WaterUsageLog;

public interface WaterUsageLogRepository extends JpaRepository<WaterUsageLog, Long>{
    List<WaterUsageLog> findByHouseholdId(Long householdId);
    List<WaterUsageLog> findByBillingCycleId(Long billingCycleId);
}
