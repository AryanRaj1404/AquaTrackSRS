package com.aquatrack.aquatrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.enums.BillingCycleStatus;

public interface BillingCycleRepository extends JpaRepository<BillingCycle, Long> {

    @Override
    @EntityGraph(attributePaths = {
            "apartment",
            "tariffPlan",
            "tariffPlan.tiers"
    })
    Optional<BillingCycle> findById(Long id);

    List<BillingCycle> findByApartmentId(Long apartmentId);

    List<BillingCycle> findByStatus(BillingCycleStatus status);

    Optional<BillingCycle> findByApartmentIdAndStatus(
        Long apartmentId,
        BillingCycleStatus status
);
List<BillingCycle> findByApartmentIdOrderByStartDateDesc(
        Long apartmentId
);
}