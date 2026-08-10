package com.aquatrack.aquatrack.service;

import java.util.List;

import com.aquatrack.aquatrack.dto.BillingCycleRequest;
import com.aquatrack.aquatrack.dto.BillingCycleResponse;

public interface BillingCycleService {

    BillingCycleResponse create(BillingCycleRequest request);

    List<BillingCycleResponse> getAll(Long apartmentId);

    BillingCycleResponse getById(Long id);

    List<BillingCycleResponse> getByApartmentId(Long apartmentId);

    BillingCycleResponse update(Long id, BillingCycleRequest request);

    void delete(Long id);
}