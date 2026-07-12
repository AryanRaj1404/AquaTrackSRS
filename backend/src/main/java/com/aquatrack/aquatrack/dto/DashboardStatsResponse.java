package com.aquatrack.aquatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private long apartments;
    private long households;
    private long residents;
    private double waterUsage;
}