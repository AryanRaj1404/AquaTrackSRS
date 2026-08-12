package com.aquatrack.aquatrack.repository;

import com.aquatrack.aquatrack.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aquatrack.aquatrack.enums.HouseholdJoinRequestStatus;

import java.util.List;
import java.util.Optional;

public interface HouseholdJoinRequestRepository
        extends JpaRepository<HouseholdJoinRequest, Long> {

    Optional<HouseholdJoinRequest> findByUserAndStatus(
            User user,
            HouseholdJoinRequestStatus status
    );

    List<HouseholdJoinRequest> findByStatus(
            HouseholdJoinRequestStatus status
    );

    boolean existsByUserAndStatus(
            User user,
            HouseholdJoinRequestStatus status
    );
}