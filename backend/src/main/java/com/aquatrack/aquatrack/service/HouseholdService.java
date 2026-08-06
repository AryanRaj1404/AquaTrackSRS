package com.aquatrack.aquatrack.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aquatrack.aquatrack.dto.HouseholdRequest;
import com.aquatrack.aquatrack.dto.HouseholdResponse;
import com.aquatrack.aquatrack.dto.ResidentResponse;

public interface HouseholdService {
    HouseholdResponse create(HouseholdRequest request);

    List<HouseholdResponse> getAll();

    Page<HouseholdResponse> getAll(Long apartmentId, Pageable pageable);

    HouseholdResponse getById(Long id);

    HouseholdResponse update(Long id, HouseholdRequest request);

    void delete(Long id);

    HouseholdResponse assignResident(Long householdId, Long userId);

    HouseholdResponse removeResident(Long householdId, Long userId);

    List<ResidentResponse> getUnassignedResidents();

    List<HouseholdResponse> getByApartment(Long apartmentId);

    Page<HouseholdResponse> getByApartment(
        Long apartmentId,
        Pageable pageable
);

    Page<HouseholdResponse> search(
        Long apartmentId,
        String keyword,
        Pageable pageable
    );
}
