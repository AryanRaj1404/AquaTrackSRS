package com.aquatrack.aquatrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.AdminDashboardResponse;
import com.aquatrack.aquatrack.dto.MonthlyConsumptionResponse;
import com.aquatrack.aquatrack.dto.MonthlyRevenueResponse;
import com.aquatrack.aquatrack.dto.TopHouseholdConsumptionResponse;
import com.aquatrack.aquatrack.dto.WaterLossAnalyticsResponse;
import com.aquatrack.aquatrack.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService) {

        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {

        return ResponseEntity.ok(
                dashboardService.getAdminDashboard());
    }

    @GetMapping("/analytics/monthly-revenue")
    public ResponseEntity<List<MonthlyRevenueResponse>> getMonthlyRevenue() {

        return ResponseEntity.ok(
                dashboardService.getMonthlyRevenue());
    }

    @GetMapping("/analytics/monthly-consumption")
    public ResponseEntity<List<MonthlyConsumptionResponse>>
    getMonthlyConsumption() {

        return ResponseEntity.ok(
                dashboardService.getMonthlyConsumption());
    }

    @GetMapping("/analytics/top-households")
    public ResponseEntity<List<TopHouseholdConsumptionResponse>>
    getTopHouseholds() {

        return ResponseEntity.ok(
                dashboardService.getTopHouseholds());
    }

    @GetMapping("/analytics/water-loss")
    public ResponseEntity<List<WaterLossAnalyticsResponse>>
    getWaterLossAnalytics() {

        return ResponseEntity.ok(
                dashboardService.getWaterLossAnalytics());
    }
}