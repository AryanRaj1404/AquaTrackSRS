package com.aquatrack.aquatrack.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.UsageAlert;

public interface UsageAlertRepository extends JpaRepository<UsageAlert, Long> {
    List<UsageAlert> findByHouseholdIdOrderByCreatedAtDesc(Long householdId);
    boolean existsByHouseholdIdAndAlertTypeAndTriggeredOn(Long householdId, UsageAlert.AlertType alertType, LocalDate triggeredOn);
    
    long countByAlertType(UsageAlert.AlertType alertType);
    long countByAcknowledgedFalse();
    long countByAcknowledgedTrue();
}