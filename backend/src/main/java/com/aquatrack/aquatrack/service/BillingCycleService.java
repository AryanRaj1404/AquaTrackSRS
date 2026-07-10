package com.aquatrack.aquatrack.service;

import java.util.List;

import com.aquatrack.aquatrack.dto.BillingCycleRequest;
import com.aquatrack.aquatrack.dto.BillingCycleResponse;

public interface BillingCycleService {

    BillingCycleResponse create(BillingCycleRequest request);

    List<BillingCycleResponse> getAll();

    BillingCycleResponse getById(Long id);

    List<BillingCycleResponse> getByHousehold(Long householdId);

    BillingCycleResponse update(Long id, BillingCycleRequest request);

    void delete(Long id);
}