package com.aquatrack.aquatrack.service;

import java.util.List;

import com.aquatrack.aquatrack.dto.TariffPlanRequest;
import com.aquatrack.aquatrack.dto.TariffPlanResponse;

public interface TariffPlanService {

    TariffPlanResponse create(TariffPlanRequest request);

    List<TariffPlanResponse> getAll();

    TariffPlanResponse getById(Long id);

    TariffPlanResponse update(Long id, TariffPlanRequest request);

    void delete(Long id);
}