package com.aquatrack.aquatrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.ResidentComparisonResponse;
import com.aquatrack.aquatrack.dto.ResidentOverviewResponse;
import com.aquatrack.aquatrack.dto.ResidentTrendPoint;
import com.aquatrack.aquatrack.service.ResidentDashboardService;

@RestController
@RequestMapping("/api/resident-dashboard")
public class ResidentDashboardController {

    private final ResidentDashboardService residentDashboardService;

    public ResidentDashboardController(
            ResidentDashboardService residentDashboardService) {

        this.residentDashboardService = residentDashboardService;
    }

    // Household/meter info + current billing cycle summary + quick stats
    @GetMapping("/overview")
    public ResponseEntity<ResidentOverviewResponse> getOverview() {

        return ResponseEntity.ok(
                residentDashboardService.getOverview());
    }

    // Last 30 days of consumption, for the daily trend chart
    @GetMapping("/consumption/daily")
    public ResponseEntity<List<ResidentTrendPoint>> getDailyTrend() {

        return ResponseEntity.ok(
                residentDashboardService.getDailyTrend());
    }

    // Last 12 months of consumption, for the monthly trend chart
    @GetMapping("/consumption/monthly")
    public ResponseEntity<List<ResidentTrendPoint>> getMonthlyTrend() {

        return ResponseEntity.ok(
                residentDashboardService.getMonthlyTrend());
    }

    // Household usage vs building/apartment average for the current cycle
    @GetMapping("/comparison")
    public ResponseEntity<ResidentComparisonResponse> getComparison() {

        return ResponseEntity.ok(
                residentDashboardService.getBuildingComparison());
    }
}