package com.aquatrack.aquatrack.service;
import java.util.List;

import com.aquatrack.aquatrack.dto.AdminDashboardResponse;
import com.aquatrack.aquatrack.dto.MonthlyConsumptionResponse;
import com.aquatrack.aquatrack.dto.MonthlyRevenueResponse;
import com.aquatrack.aquatrack.dto.TopHouseholdConsumptionResponse;
import com.aquatrack.aquatrack.dto.WaterLossAnalyticsResponse;

public interface DashboardService {

    AdminDashboardResponse getAdminDashboard();

    List<MonthlyRevenueResponse> getMonthlyRevenue();

    List<MonthlyConsumptionResponse> getMonthlyConsumption();

    List<TopHouseholdConsumptionResponse> getTopHouseholds();

    List<WaterLossAnalyticsResponse> getWaterLossAnalytics();

}