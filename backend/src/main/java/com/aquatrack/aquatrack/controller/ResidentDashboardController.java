package com.aquatrack.aquatrack.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.ResidentComparisonResponse;
import com.aquatrack.aquatrack.dto.ResidentNotificationResponse;
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

    // Household's usage alerts (threshold breach / anomaly leak), newest first
    @GetMapping("/notifications")
    public ResponseEntity<List<ResidentNotificationResponse>> getNotifications() {

        return ResponseEntity.ok(
                residentDashboardService.getNotifications());
    }

    // Count of unread notifications, for the bell badge
    @GetMapping("/notifications/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadNotificationCount() {

        return ResponseEntity.ok(
                Map.of("count", residentDashboardService.getUnreadNotificationCount()));
    }

    // Mark a single notification as read
    @PostMapping("/notifications/{alertId}/read")
    public ResponseEntity<ResidentNotificationResponse> markNotificationRead(
            @PathVariable Long alertId) {

        return ResponseEntity.ok(
                residentDashboardService.markNotificationRead(alertId));
    }

    // Mark every notification as read
    @PostMapping("/notifications/read-all")
    public ResponseEntity<Void> markAllNotificationsRead() {

        residentDashboardService.markAllNotificationsRead();

        return ResponseEntity.noContent().build();
    }
}