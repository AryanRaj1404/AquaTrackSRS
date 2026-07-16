package com.aquatrack.aquatrack.service;

import java.util.List;

import com.aquatrack.aquatrack.dto.TariffTierRequest;
import com.aquatrack.aquatrack.dto.TariffTierResponse;

public interface TariffTierService {

    TariffTierResponse create(TariffTierRequest request);

    List<TariffTierResponse> getAll();

    TariffTierResponse getById(Long id);

    TariffTierResponse update(Long id, TariffTierRequest request);

    void delete(Long id);
}