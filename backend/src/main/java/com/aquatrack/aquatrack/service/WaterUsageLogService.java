package com.aquatrack.aquatrack.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.aquatrack.aquatrack.dto.UploadCsvResponse;
import com.aquatrack.aquatrack.dto.WaterUsageLogRequest;
import com.aquatrack.aquatrack.dto.WaterUsageLogResponse;

public interface WaterUsageLogService {

    WaterUsageLogResponse create(
            Long apartmentId,
            WaterUsageLogRequest request
    );

    Page<WaterUsageLogResponse> getAll(
            Long apartmentId,
            String keyword,
            Pageable pageable
    );

    WaterUsageLogResponse getById(Long id);

    List<WaterUsageLogResponse> getByHousehold(Long householdId);

    WaterUsageLogResponse update(
            Long apartmentId,
            Long id,
            WaterUsageLogRequest request
    );

    void delete(
            Long apartmentId,
            Long id
    );

    UploadCsvResponse uploadCsv(
            Long apartmentId,
            MultipartFile file,
            Long billingCycleId
    );
}