package com.aquatrack.aquatrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.admin.AdminAlertResponse;
import com.aquatrack.aquatrack.dto.admin.AdminAlertSummaryResponse;
import com.aquatrack.aquatrack.dto.admin.ApartmentConsumptionResponse;
import com.aquatrack.aquatrack.dto.admin.ConsumptionTrendResponse;
import com.aquatrack.aquatrack.dto.admin.MonthlyConsumptionResponse;
import com.aquatrack.aquatrack.dto.admin.UsageStatusResponse;
import com.aquatrack.aquatrack.service.AdminDashboardService;

@RestController
@RequestMapping("/api/admin/dashboard")
// @PreAuthorize("hasRole('ADMIN')") // TODO: Enable once Spring Security role system is fully active for Admin APIs
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<AdminAlertResponse>> getAlerts(
        @RequestHeader(
                value = "X-Workspace-Id",
                required = false
        )
        Long apartmentId
    ) {
        return ResponseEntity.ok(adminDashboardService.getAlerts(apartmentId));
    }

    @GetMapping("/alerts/summary")
    public ResponseEntity<AdminAlertSummaryResponse> getAlertSummary(
        @RequestHeader(
                value = "X-Workspace-Id",
                required = false
        )
        Long apartmentId
    ) {
        return ResponseEntity.ok(adminDashboardService.getAlertSummary(apartmentId));
    }

    @GetMapping("/charts/monthly-consumption")
    public ResponseEntity<List<MonthlyConsumptionResponse>> getMonthlyConsumption(
        @RequestHeader(
                value = "X-Workspace-Id",
                required = false
        )
        Long apartmentId
    ) {
        return ResponseEntity.ok(adminDashboardService.getMonthlyConsumption(apartmentId));
    }

    @GetMapping("/charts/apartment-consumption")
    public ResponseEntity<List<ApartmentConsumptionResponse>> getApartmentConsumption(
        @RequestHeader(
                value = "X-Workspace-Id",
                required = false
        )
        Long apartmentId
    ) {
        return ResponseEntity.ok(adminDashboardService.getApartmentConsumption(apartmentId));
    }

    @GetMapping("/charts/usage-status")
    public ResponseEntity<List<UsageStatusResponse>> getUsageStatus(
        @RequestHeader(
                value = "X-Workspace-Id",
                required = false
        )
        Long apartmentId
    ) {
        return ResponseEntity.ok(adminDashboardService.getUsageStatus(apartmentId));
    }

    @GetMapping("/charts/consumption")
    public ResponseEntity<List<ConsumptionTrendResponse>> getConsumptionChart(
            @RequestHeader(
                value = "X-Workspace-Id",
                required = false
            )
            Long apartmentId,
            @RequestParam String mode,
            @RequestParam String range
            
    )
    {
        return ResponseEntity.ok(
                adminDashboardService.getConsumptionChart(apartmentId,mode, range)
        );
    }
}