package com.aquatrack.aquatrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.TariffPlan;
import com.aquatrack.aquatrack.entity.TariffTier;

public interface TariffTierRepository
        extends JpaRepository<TariffTier, Long> {

    List<TariffTier> findByTariffPlanOrderByTierOrderAsc(
            TariffPlan tariffPlan);

}