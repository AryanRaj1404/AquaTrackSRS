package com.aquatrack.aquatrack.service;

import com.aquatrack.aquatrack.dto.BulkWaterPurchaseRequest;
import com.aquatrack.aquatrack.dto.BulkWaterPurchaseResponse;
import org.springframework.data.domain.Page;

public interface BulkWaterPurchaseService {

    BulkWaterPurchaseResponse create(Long apartmentId, BulkWaterPurchaseRequest request);

    BulkWaterPurchaseResponse getById(Long id);

    void delete(Long id);

    BulkWaterPurchaseResponse update(
        Long apartmentId,
        Long id,
        BulkWaterPurchaseRequest request);

    Page<BulkWaterPurchaseResponse> getAll(

        Long apartmentId,

        int page,

        int size

);
}