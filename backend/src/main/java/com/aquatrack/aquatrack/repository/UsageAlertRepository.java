package com.aquatrack.aquatrack.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.UsageAlert;

public interface UsageAlertRepository extends JpaRepository<UsageAlert, Long> {
    List<UsageAlert> findByHouseholdIdOrderByCreatedAtDesc(Long householdId);

    List<UsageAlert> findByHouseholdIdAndCreatedAtAfterOrderByCreatedAtDesc(
        Long householdId,
        LocalDateTime createdAt
);

List<UsageAlert> findByCreatedAtAfterOrderByCreatedAtDesc(
        LocalDateTime createdAt
);
    boolean existsByHouseholdIdAndAlertTypeAndTriggeredOn(Long householdId, UsageAlert.AlertType alertType, LocalDate triggeredOn);
}