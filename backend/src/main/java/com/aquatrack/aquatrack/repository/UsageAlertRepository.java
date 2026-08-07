package com.aquatrack.aquatrack.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    long countByAlertType(UsageAlert.AlertType alertType);
    long countByAcknowledgedFalse();
    long countByAcknowledgedTrue();

    Page<UsageAlert> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<UsageAlert> findByAcknowledged(
            boolean acknowledged,
            Pageable pageable
    );

    Page<UsageAlert> findByAlertType(
            UsageAlert.AlertType alertType,
            Pageable pageable
    );

    List<UsageAlert> findTop5ByAcknowledgedFalseOrderByCreatedAtDesc();

    List<UsageAlert> findByHousehold_Apartment_IdOrderByCreatedAtDesc(
        Long apartmentId
);

List<UsageAlert> findTop5ByHousehold_Apartment_IdAndAcknowledgedFalseOrderByCreatedAtDesc(
        Long apartmentId
);

long countByHousehold_Apartment_IdAndAlertType(
        Long apartmentId,
        UsageAlert.AlertType alertType
);

long countByHousehold_Apartment_IdAndAcknowledgedFalse(
        Long apartmentId
);

long countByHousehold_Apartment_IdAndAcknowledgedTrue(
        Long apartmentId
);

long countByHousehold_Apartment_Id(
        Long apartmentId
);

    Page<UsageAlert> findByHousehold_Apartment_IdAndAcknowledged(
            Long apartmentId,
            boolean acknowledged,
            Pageable pageable
    );

    Page<UsageAlert> findByHousehold_Apartment_IdAndAlertType(
            Long apartmentId,
            UsageAlert.AlertType alertType,
            Pageable pageable
    );

        Page<UsageAlert> findByHousehold_Apartment_IdOrderByCreatedAtDesc(
                Long apartmentId,
                Pageable pageable
        );


}