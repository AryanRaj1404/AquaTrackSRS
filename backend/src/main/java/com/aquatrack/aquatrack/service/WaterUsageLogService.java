package com.aquatrack.aquatrack.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.aquatrack.aquatrack.dto.UploadCsvResponse;
import com.aquatrack.aquatrack.dto.WaterUsageLogRequest;
import com.aquatrack.aquatrack.dto.WaterUsageLogResponse;

public interface WaterUsageLogService {
    WaterUsageLogResponse create(WaterUsageLogRequest request);
    List<WaterUsageLogResponse> getAll();
    WaterUsageLogResponse getById(Long id);
    List<WaterUsageLogResponse> getByHousehold(Long householdId);
    WaterUsageLogResponse update(Long id, WaterUsageLogRequest request);
    void delete(Long id);
    UploadCsvResponse uploadCsv(MultipartFile file, Long billingCycleId);
}