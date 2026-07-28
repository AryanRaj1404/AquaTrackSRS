package com.aquatrack.aquatrack.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aquatrack.aquatrack.dto.ApartmentRequest;
import com.aquatrack.aquatrack.dto.ApartmentResponse;

public interface ApartmentService {
    ApartmentResponse create(ApartmentRequest request);

    List<ApartmentResponse> getAll();

    Page<ApartmentResponse> getAll(Pageable pageable);

    ApartmentResponse getById(Long id);

    ApartmentResponse update(Long id, ApartmentRequest request);

    void delete(Long id);

    Page<ApartmentResponse> search(
    String keyword,
    Pageable pageable
);
}
