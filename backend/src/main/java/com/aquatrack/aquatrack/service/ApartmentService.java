package com.aquatrack.aquatrack.service;

import java.util.List;

import com.aquatrack.aquatrack.dto.ApartmentRequest;
import com.aquatrack.aquatrack.dto.ApartmentResponse;

public interface ApartmentService {
    ApartmentResponse create(ApartmentRequest request);

    List<ApartmentResponse> getAll();

    ApartmentResponse getById(Long id);

    ApartmentResponse update(Long id, ApartmentRequest request);

    void delete(Long id);
}
