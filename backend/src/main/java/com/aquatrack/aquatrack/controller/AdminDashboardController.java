package com.aquatrack.aquatrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.admin.AdminAlertResponse;
import com.aquatrack.aquatrack.dto.admin.AdminAlertSummaryResponse;
import com.aquatrack.aquatrack.dto.admin.ApartmentConsumptionResponse;
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
    public ResponseEntity<List<AdminAlertResponse>> getAlerts() {
        return ResponseEntity.ok(adminDashboardService.getAlerts());
    }

    @GetMapping("/alerts/summary")
    public ResponseEntity<AdminAlertSummaryResponse> getAlertSummary() {
        return ResponseEntity.ok(adminDashboardService.getAlertSummary());
    }

    @GetMapping("/charts/monthly-consumption")
    public ResponseEntity<List<MonthlyConsumptionResponse>> getMonthlyConsumption() {
        return ResponseEntity.ok(adminDashboardService.getMonthlyConsumption());
    }

    @GetMapping("/charts/apartment-consumption")
    public ResponseEntity<List<ApartmentConsumptionResponse>> getApartmentConsumption() {
        return ResponseEntity.ok(adminDashboardService.getApartmentConsumption());
    }

    @GetMapping("/charts/usage-status")
    public ResponseEntity<List<UsageStatusResponse>> getUsageStatus() {
        return ResponseEntity.ok(adminDashboardService.getUsageStatus());
    }
}
