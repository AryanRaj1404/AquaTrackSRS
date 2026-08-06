package com.aquatrack.aquatrack.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aquatrack.aquatrack.dto.UploadCsvResponse;
import com.aquatrack.aquatrack.dto.WaterUsageLogRequest;
import com.aquatrack.aquatrack.dto.WaterUsageLogResponse;
import com.aquatrack.aquatrack.service.WaterUsageLogService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/usage-logs")
public class WaterUsageLogController {

    private final WaterUsageLogService waterUsageLogService;

    public WaterUsageLogController(WaterUsageLogService waterUsageLogService) {
        this.waterUsageLogService = waterUsageLogService;
    }

    @PostMapping
    public WaterUsageLogResponse create(
            @RequestHeader(value = "X-Workspace-Id", required = false)
            Long apartmentId,

            @Valid
            @RequestBody
            WaterUsageLogRequest request) {

        return waterUsageLogService.create(apartmentId, request);
    }

    @GetMapping
    public Page<WaterUsageLogResponse> getAll(

            @RequestHeader(value = "X-Workspace-Id", required = false)
            Long apartmentId,

            @RequestParam(required = false)
            String keyword,

            Pageable pageable) {

        return waterUsageLogService.getAll(
                apartmentId,
                keyword,
                pageable);
    }

    @GetMapping("/{id}")
    public WaterUsageLogResponse getById(
            @PathVariable Long id) {

        return waterUsageLogService.getById(id);
    }

    @GetMapping("/household/{householdId}")
    public List<WaterUsageLogResponse> getByHousehold(
            @PathVariable Long householdId) {

        return waterUsageLogService.getByHousehold(householdId);
    }

    @PutMapping("/{id}")
    public WaterUsageLogResponse update(

            @RequestHeader(value = "X-Workspace-Id", required = false)
            Long apartmentId,

            @PathVariable
            Long id,

            @Valid
            @RequestBody
            WaterUsageLogRequest request) {

        return waterUsageLogService.update(
                apartmentId,
                id,
                request);
    }

    @DeleteMapping("/{id}")
    public String delete(

            @RequestHeader(value = "X-Workspace-Id", required = false)
            Long apartmentId,

            @PathVariable
            Long id) {

        waterUsageLogService.delete(
                apartmentId,
                id);

        return "Water usage log deleted successfully";
    }

    @PostMapping("/upload-csv")
    public UploadCsvResponse uploadCsv(

            @RequestHeader(value = "X-Workspace-Id", required = false)
            Long apartmentId,

            @RequestParam("file")
            MultipartFile file,

            @RequestParam("billingCycleId")
            Long billingCycleId) {

        return waterUsageLogService.uploadCsv(
                apartmentId,
                file,
                billingCycleId);
    }
}