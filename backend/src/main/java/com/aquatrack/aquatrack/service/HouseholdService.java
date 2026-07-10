package com.aquatrack.aquatrack.service;

import java.util.List;

import com.aquatrack.aquatrack.dto.HouseholdRequest;
import com.aquatrack.aquatrack.dto.HouseholdResponse;
import com.aquatrack.aquatrack.dto.ResidentResponse;

public interface HouseholdService {
    HouseholdResponse create(HouseholdRequest request);

    List<HouseholdResponse> getAll();

    HouseholdResponse getById(Long id);

    HouseholdResponse update(Long id, HouseholdRequest request);

    void delete(Long id);

    HouseholdResponse assignResident(Long householdId, Long userId);

    HouseholdResponse removeResident(Long householdId, Long userId);

    List<ResidentResponse> getUnassignedResidents();
}
