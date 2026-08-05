package com.aquatrack.aquatrack.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.AdminDashboardResponse;
import com.aquatrack.aquatrack.dto.MonthlyConsumptionResponse;
import com.aquatrack.aquatrack.dto.MonthlyRevenueResponse;
import com.aquatrack.aquatrack.dto.TopHouseholdConsumptionResponse;
import com.aquatrack.aquatrack.dto.WaterLossAnalyticsResponse;
import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.enums.BillingCycleStatus;
import com.aquatrack.aquatrack.enums.InvoiceStatus;
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.BillingCycleRepository;
import com.aquatrack.aquatrack.repository.BulkWaterPurchaseRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.InvoiceRepository;
import com.aquatrack.aquatrack.repository.UserRepository;
import com.aquatrack.aquatrack.repository.WaterUsageLogRepository;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ApartmentRepository apartmentRepository;
    private final HouseholdRepository householdRepository;
    private final UserRepository userRepository;
    private final BillingCycleRepository billingCycleRepository;
    private final WaterUsageLogRepository waterUsageLogRepository;
    private final BulkWaterPurchaseRepository bulkWaterPurchaseRepository;
    private final InvoiceRepository invoiceRepository;

    public DashboardServiceImpl(
            ApartmentRepository apartmentRepository,
            HouseholdRepository householdRepository,
            UserRepository userRepository,
            BillingCycleRepository billingCycleRepository,
            WaterUsageLogRepository waterUsageLogRepository,
            BulkWaterPurchaseRepository bulkWaterPurchaseRepository,
            InvoiceRepository invoiceRepository) {

        this.apartmentRepository = apartmentRepository;
        this.householdRepository = householdRepository;
        this.userRepository = userRepository;
        this.billingCycleRepository = billingCycleRepository;
        this.waterUsageLogRepository = waterUsageLogRepository;
        this.bulkWaterPurchaseRepository = bulkWaterPurchaseRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @Override
        public List<MonthlyRevenueResponse> getMonthlyRevenue() {

        return invoiceRepository.getMonthlyRevenue()
                .stream()
                .map(obj -> new MonthlyRevenueResponse(

                        (String) obj[0],

                        ((Number) obj[1]).doubleValue()

                ))
                .toList();
        }
        @Override
        public List<MonthlyConsumptionResponse> getMonthlyConsumption() {

        return waterUsageLogRepository
                .getMonthlyConsumption()
                .stream()
                .map(obj -> new MonthlyConsumptionResponse(

                        (String) obj[0],

                        ((Number) obj[1]).doubleValue()

                ))
                .toList();
        }

        @Override
        public List<TopHouseholdConsumptionResponse> getTopHouseholds() {

        return waterUsageLogRepository
                .getTopHouseholds()
                .stream()
                .limit(5)
                .map(obj -> new TopHouseholdConsumptionResponse(

                        ((Number) obj[0]).longValue(),

                        (String) obj[1],

                        ((Number) obj[2]).doubleValue()

                ))
                .toList();
        }

        @Override
        public List<WaterLossAnalyticsResponse> getWaterLossAnalytics() {

        List<BillingCycle> billingCycles =
                billingCycleRepository.findAll();

        List<WaterLossAnalyticsResponse> response =
                new ArrayList<>();

        for (BillingCycle billingCycle : billingCycles) {

                double purchased =
                        bulkWaterPurchaseRepository
                                .findByBillingCycle(billingCycle)
                                .stream()
                                .mapToDouble(p -> p.getVolumeKl())
                                .sum();

                double consumed =
                        waterUsageLogRepository
                                .findByBillingCycleId(
                                        billingCycle.getId())
                                .stream()
                                .mapToDouble(log ->
                                        log.getLitersConsumed() / 1000.0)
                                .sum();

                double loss = purchased - consumed;

                double percentage = purchased == 0
                        ? 0
                        : (loss * 100.0 / purchased);

                response.add(

                        new WaterLossAnalyticsResponse(

                                billingCycle.getId(),

                                billingCycle.getStartDate()
                                        + " to "
                                        + billingCycle.getEndDate(),

                                purchased,

                                consumed,

                                loss,

                                percentage
                        )
                );
        }

        return response;
        }


    @Override
    public AdminDashboardResponse getAdminDashboard(Long apartmentId) {

        long apartments =
                apartmentId == null
                        ? apartmentRepository.count()
                        : 1;

        long households =
                apartmentId == null

                        ? householdRepository.count()

                        : householdRepository
                                .countByApartmentId(apartmentId);

        long users =
        apartmentId == null
                ? userRepository.count()
                : userRepository.countByApartmentId(apartmentId);

        long activeBillingCycles =
                billingCycleRepository
                        .findByStatus(BillingCycleStatus.OPEN)
                        .size();

        double consumedKl =
        (
            apartmentId == null
            ? waterUsageLogRepository
                    .getTotalWaterConsumedLiters()
            : waterUsageLogRepository
                    .getTotalWaterConsumedLiters(apartmentId)
        ) / 1000.0;

        double purchasedKl =
        apartmentId == null
        ? bulkWaterPurchaseRepository
                .getTotalBulkWaterPurchasedKl()
        : bulkWaterPurchaseRepository
                .getTotalBulkWaterPurchasedKl(apartmentId);

        double revenue =
        apartmentId == null
        ? invoiceRepository.getTotalRevenue()
        : invoiceRepository.getTotalRevenue(apartmentId);

        long generated =
        apartmentId == null
        ? invoiceRepository.countByStatus(InvoiceStatus.GENERATED)
        : invoiceRepository.countByStatusAndApartmentId(
                InvoiceStatus.GENERATED,
                apartmentId);

        long sent =
                apartmentId == null
                ? invoiceRepository.countByStatus(InvoiceStatus.SENT)
                : invoiceRepository.countByStatusAndApartmentId(
                        InvoiceStatus.SENT,
                        apartmentId);

        long paid =
                apartmentId == null
                ? invoiceRepository.countByStatus(InvoiceStatus.PAID)
                : invoiceRepository.countByStatusAndApartmentId(
                        InvoiceStatus.PAID,
                        apartmentId);

        long overdue =
                apartmentId == null
                ? invoiceRepository.countByStatus(InvoiceStatus.OVERDUE)
                : invoiceRepository.countByStatusAndApartmentId(
                        InvoiceStatus.OVERDUE,
                        apartmentId);

        long cancelled =
                apartmentId == null
                ? invoiceRepository.countByStatus(InvoiceStatus.CANCELLED)
                : invoiceRepository.countByStatusAndApartmentId(
                        InvoiceStatus.CANCELLED,
                        apartmentId);

        long pending = generated + sent;

        double waterLossPercentage = 0.0;

        if (purchasedKl > 0) {
        waterLossPercentage =
                (purchasedKl - consumedKl) * 100.0 / purchasedKl;
        }

        double collectionRate = 0.0;

        long totalInvoices = generated + sent + paid + overdue;

        if (totalInvoices > 0) {
        collectionRate =
                paid * 100.0 / totalInvoices;
        }

        return new AdminDashboardResponse(

                apartments,
                households,
                users,
                activeBillingCycles,

                consumedKl,
                purchasedKl,
                purchasedKl - consumedKl,

                revenue,

                generated,
                paid,
                pending,
                overdue,
                cancelled,

                waterLossPercentage,
                collectionRate
        );
    }
}