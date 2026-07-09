package com.aquatrack.aquatrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.enums.BillingCycleStatus;

public interface BillingCycleRepository extends JpaRepository<BillingCycle, Long>{
    List<BillingCycle> findByHouseholdId(Long householdId);
    List<BillingCycle> findByStatus(BillingCycleStatus status);
}
