package com.aquatrack.aquatrack.service;

import java.util.List;

import com.aquatrack.aquatrack.dto.BulkWaterPurchaseRequest;
import com.aquatrack.aquatrack.dto.BulkWaterPurchaseResponse;

public interface BulkWaterPurchaseService {

    BulkWaterPurchaseResponse create(BulkWaterPurchaseRequest request);

    List<BulkWaterPurchaseResponse> getAll();

    BulkWaterPurchaseResponse getById(Long id);

    void delete(Long id);
}