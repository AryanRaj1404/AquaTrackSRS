package com.aquatrack.aquatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private Long totalApartments;

    private Long totalHouseholds;

    private Long totalUsers;

    private Long activeBillingCycles;

    private Double totalWaterConsumedKl;

    private Double totalBulkWaterPurchasedKl;

    private Double waterLossKl;

    private Double totalRevenue;

    private Long generatedInvoices;

    private Long paidInvoices;

    private Long pendingInvoices;

    private Long overdueInvoices;

    private Long cancelledInvoices;

    private Double waterLossPercentage;

    private Double collectionRate;
}