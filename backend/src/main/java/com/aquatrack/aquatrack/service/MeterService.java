package com.aquatrack.aquatrack.service;

import java.util.List;

import com.aquatrack.aquatrack.dto.MeterRequest;
import com.aquatrack.aquatrack.dto.MeterResponse;

public interface MeterService {
    MeterResponse create(MeterRequest request);
    List<MeterResponse> getAll();
    MeterResponse getById(Long id);
    List<MeterResponse> getByHousehold(Long householdId);
    MeterResponse update(Long id, MeterRequest request);
    void delete(Long id);
}