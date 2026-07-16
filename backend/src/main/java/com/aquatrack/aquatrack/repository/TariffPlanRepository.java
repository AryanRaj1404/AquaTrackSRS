package com.aquatrack.aquatrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.TariffPlan;

public interface TariffPlanRepository extends JpaRepository<TariffPlan, Long> {

    @Override
    @EntityGraph(attributePaths = "tiers")
    Optional<TariffPlan> findById(Long id);

    @Override
    @EntityGraph(attributePaths = "tiers")
    List<TariffPlan> findAll();

}