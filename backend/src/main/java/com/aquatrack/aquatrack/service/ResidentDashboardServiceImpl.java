package com.aquatrack.aquatrack.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aquatrack.aquatrack.billing.TariffCalculationResult;
import com.aquatrack.aquatrack.billing.TariffCalculator;
import com.aquatrack.aquatrack.dto.ResidentComparisonResponse;
import com.aquatrack.aquatrack.dto.ResidentOverviewResponse;
import com.aquatrack.aquatrack.dto.ResidentTrendPoint;
import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.Meter;
import com.aquatrack.aquatrack.entity.User;
import com.aquatrack.aquatrack.enums.BillingCycleStatus;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.BillingCycleRepository;
import com.aquatrack.aquatrack.repository.InvoiceRepository;
import com.aquatrack.aquatrack.repository.TariffTierRepository;
import com.aquatrack.aquatrack.repository.UserRepository;
import com.aquatrack.aquatrack.repository.WaterUsageLogRepository;

@Service
@Transactional(readOnly = true)
public class ResidentDashboardServiceImpl implements ResidentDashboardService {

    private final UserRepository userRepository;
    private final BillingCycleRepository billingCycleRepository;
    private final WaterUsageLogRepository waterUsageLogRepository;
    private final InvoiceRepository invoiceRepository;
    private final TariffTierRepository tariffTierRepository;
    private final TariffCalculator tariffCalculator;

    public ResidentDashboardServiceImpl(
            UserRepository userRepository,
            BillingCycleRepository billingCycleRepository,
            WaterUsageLogRepository waterUsageLogRepository,
            InvoiceRepository invoiceRepository,
            TariffTierRepository tariffTierRepository,
            TariffCalculator tariffCalculator) {

        this.userRepository = userRepository;
        this.billingCycleRepository = billingCycleRepository;
        this.waterUsageLogRepository = waterUsageLogRepository;
        this.invoiceRepository = invoiceRepository;
        this.tariffTierRepository = tariffTierRepository;
        this.tariffCalculator = tariffCalculator;
    }

    private Household getCurrentHousehold() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Household household = user.getHousehold();

        if (household == null) {
            throw new ResourceNotFoundException(
                    "No household linked to this account");
        }

        return household;
    }

    @Override
    public ResidentOverviewResponse getOverview() {

        Household household = getCurrentHousehold();

        String meterNumber = null;
        String meterType = null;

        if (household.getMeters() != null) {
            Meter meter = household.getMeters().stream()
                    .filter(m -> Boolean.TRUE.equals(m.getActive()))
                    .findFirst()
                    .orElse(household.getMeters().stream()
                            .findFirst()
                            .orElse(null));

            if (meter != null) {
                meterNumber = meter.getMeterNumber();
                meterType = meter.getMeterType() != null
                        ? meter.getMeterType().name()
                        : null;
            }
        }

        BillingCycle currentCycle = billingCycleRepository
                .findByApartmentIdAndStatus(
                        household.getApartment().getId(),
                        BillingCycleStatus.OPEN)
                .orElse(null);

        Long currentCycleId = null;
        LocalDate cycleStart = null;
        LocalDate cycleEnd = null;
        String cycleStatus = null;
        Long daysRemaining = null;
        Double cycleConsumptionKl = 0.0;
        Double estimatedCost = 0.0;
        String tariffPlanName = null;

        if (currentCycle != null) {

            currentCycleId = currentCycle.getId();
            cycleStart = currentCycle.getStartDate();
            cycleEnd = currentCycle.getEndDate();
            cycleStatus = currentCycle.getStatus().name();

            daysRemaining = cycleEnd != null
                    ? Math.max(0, ChronoUnit.DAYS.between(LocalDate.now(), cycleEnd))
                    : null;

            cycleConsumptionKl = waterUsageLogRepository
                    .findByBillingCycleIdAndHouseholdId(
                            currentCycleId,
                            household.getId())
                    .stream()
                    .mapToDouble(log -> log.getLitersConsumed() / 1000.0)
                    .sum();

            if (currentCycle.getTariffPlan() != null) {

                tariffPlanName = currentCycle.getTariffPlan().getPlanName();

                TariffCalculationResult result = tariffCalculator.calculate(
                        cycleConsumptionKl,
                        tariffTierRepository.findByTariffPlanOrderByTierOrderAsc(
                                currentCycle.getTariffPlan()));

                Double fixedCharge = currentCycle.getTariffPlan().getFixedCharge();

                estimatedCost = (result.getUsageCharge() != null
                        ? result.getUsageCharge() : 0.0)
                        + (fixedCharge != null ? fixedCharge : 0.0);
            }
        }

        Double amountDue = invoiceRepository
                .getAmountDueByHousehold(household.getId());

        Double ytdConsumptionKl = waterUsageLogRepository
                .getYtdConsumptionKlByHousehold(household.getId());

        return new ResidentOverviewResponse(
                household.getId(),
                household.getFlatNumber(),
                household.getApartment().getName(),

                meterNumber,
                meterType,

                currentCycleId,
                cycleStart,
                cycleEnd,
                cycleStatus,
                daysRemaining,
                round2(cycleConsumptionKl),
                round2(estimatedCost),
                tariffPlanName,

                round2(cycleConsumptionKl),
                round2(amountDue != null ? amountDue : 0.0),
                daysRemaining,
                round2(ytdConsumptionKl != null ? ytdConsumptionKl : 0.0)
        );
    }

    @Override
    public List<ResidentTrendPoint> getDailyTrend() {

        Household household = getCurrentHousehold();

        LocalDate fromDate = LocalDate.now().minusDays(30);

        return waterUsageLogRepository
                .getDailyConsumptionByHousehold(household.getId(), fromDate)
                .stream()
                .map(obj -> new ResidentTrendPoint(
                        (String) obj[0],
                        round2(((Number) obj[1]).doubleValue())))
                .toList();
    }

    @Override
    public List<ResidentTrendPoint> getMonthlyTrend() {

        Household household = getCurrentHousehold();

        List<Object[]> rows = waterUsageLogRepository
                .getMonthlyConsumptionByHousehold(household.getId());

        int from = Math.max(0, rows.size() - 12);

        return rows.subList(from, rows.size())
                .stream()
                .map(obj -> new ResidentTrendPoint(
                        (String) obj[0],
                        round2(((Number) obj[1]).doubleValue())))
                .toList();
    }

    @Override
    public ResidentComparisonResponse getBuildingComparison() {

        Household household = getCurrentHousehold();

        BillingCycle currentCycle = billingCycleRepository
                .findByApartmentIdAndStatus(
                        household.getApartment().getId(),
                        BillingCycleStatus.OPEN)
                .orElse(null);

        if (currentCycle == null) {
            return new ResidentComparisonResponse(
                    "No active billing cycle", 0.0, 0.0, 0);
        }

        List<Object[]> rows = waterUsageLogRepository
                .getHouseholdConsumptionForCycle(
                        currentCycle.getId(),
                        household.getApartment().getId());

        double total = 0.0;
        double householdValue = 0.0;

        for (Object[] row : rows) {
            long hId = ((Number) row[0]).longValue();
            double value = ((Number) row[1]).doubleValue();
            total += value;
            if (hId == household.getId()) {
                householdValue = value;
            }
        }

        double average = rows.isEmpty() ? 0.0 : total / rows.size();

        return new ResidentComparisonResponse(
                currentCycle.getStartDate() + " to " + currentCycle.getEndDate(),
                round2(householdValue),
                round2(average),
                rows.size());
    }

    private static Double round2(Double value) {

        if (value == null) {
            return 0.0;
        }

        return Math.round(value * 100.0) / 100.0;
    }
}