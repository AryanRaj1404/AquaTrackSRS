package com.aquatrack.aquatrack.service;

import java.util.List;

import com.aquatrack.aquatrack.dto.HouseholdRequest;
import com.aquatrack.aquatrack.dto.HouseholdResponse;

public interface HouseholdService {
    HouseholdResponse create(HouseholdRequest request);

    List<HouseholdResponse> getAll();

    HouseholdResponse getById(Long id);

    HouseholdResponse update(Long id, HouseholdRequest request);

    void delete(Long id);

    HouseholdResponse assignResident(Long householdId, Long userId);
}
