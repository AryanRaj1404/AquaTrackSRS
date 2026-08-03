package com.aquatrack.aquatrack.service;

import java.util.List;

import com.aquatrack.aquatrack.dto.ResidentComparisonResponse;
import com.aquatrack.aquatrack.dto.ResidentOverviewResponse;
import com.aquatrack.aquatrack.dto.ResidentTrendPoint;


public interface ResidentDashboardService {

    ResidentOverviewResponse getOverview();

    List<ResidentTrendPoint> getDailyTrend();

    List<ResidentTrendPoint> getMonthlyTrend();

    ResidentComparisonResponse getBuildingComparison();
}