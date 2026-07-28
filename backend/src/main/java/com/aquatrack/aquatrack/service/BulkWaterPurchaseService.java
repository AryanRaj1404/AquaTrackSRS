package com.aquatrack.aquatrack.service;

import com.aquatrack.aquatrack.dto.BulkWaterPurchaseRequest;
import com.aquatrack.aquatrack.dto.BulkWaterPurchaseResponse;
import org.springframework.data.domain.Page;

public interface BulkWaterPurchaseService {

    BulkWaterPurchaseResponse create(BulkWaterPurchaseRequest request);

    BulkWaterPurchaseResponse getById(Long id);

    void delete(Long id);

    BulkWaterPurchaseResponse update(
        Long id,
        BulkWaterPurchaseRequest request);

    Page<BulkWaterPurchaseResponse> getAll(

        int page,

        int size

);
}