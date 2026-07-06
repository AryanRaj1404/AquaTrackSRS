package com.aquatrack.aquatrack.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.WaterUsageLogRequest;
import com.aquatrack.aquatrack.dto.WaterUsageLogResponse;
import com.aquatrack.aquatrack.service.WaterUsageLogService;

@RestController
@RequestMapping("/usage-logs")
public class WaterUsageLogController {

    private final WaterUsageLogService waterUsageLogService;

    public WaterUsageLogController(WaterUsageLogService waterUsageLogService) {
        this.waterUsageLogService = waterUsageLogService;
    }

    @PostMapping
    public WaterUsageLogResponse create(@Valid @RequestBody WaterUsageLogRequest request) {
        return waterUsageLogService.create(request);
    }

    @GetMapping
    public List<WaterUsageLogResponse> getAll() {
        return waterUsageLogService.getAll();
    }

    @GetMapping("/{id}")
    public WaterUsageLogResponse getById(@PathVariable Long id) {
        return waterUsageLogService.getById(id);
    }

    @GetMapping("/household/{householdId}")
    public List<WaterUsageLogResponse> getByHousehold(@PathVariable Long householdId) {
        return waterUsageLogService.getByHousehold(householdId);
    }

    @PutMapping("/{id}")
    public WaterUsageLogResponse update(@PathVariable Long id, @Valid @RequestBody WaterUsageLogRequest request) {
        return waterUsageLogService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        waterUsageLogService.delete(id);
        return "Usage log deleted successfully";
    }
}
