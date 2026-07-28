package com.aquatrack.aquatrack.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aquatrack.aquatrack.dto.UploadCsvResponse;
import com.aquatrack.aquatrack.dto.WaterUsageLogRequest;
import com.aquatrack.aquatrack.dto.WaterUsageLogResponse;

public interface WaterUsageLogService {
    WaterUsageLogResponse create(WaterUsageLogRequest request);
    Page<WaterUsageLogResponse> getAll(
        String keyword,
        Pageable pageable
);
    WaterUsageLogResponse getById(Long id);
    List<WaterUsageLogResponse> getByHousehold(Long householdId);
    WaterUsageLogResponse update(Long id, WaterUsageLogRequest request);
    void delete(Long id);
    UploadCsvResponse uploadCsv(MultipartFile file, Long billingCycleId);
}