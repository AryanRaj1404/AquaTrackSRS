package com.aquatrack.aquatrack.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.admin.AdminAlertResponse;
import com.aquatrack.aquatrack.dto.admin.AdminAlertSummaryResponse;
import com.aquatrack.aquatrack.dto.admin.ApartmentConsumptionResponse;
import com.aquatrack.aquatrack.dto.admin.ConsumptionTrendResponse;
import com.aquatrack.aquatrack.dto.admin.MonthlyConsumptionResponse;
import com.aquatrack.aquatrack.dto.admin.UsageStatusResponse;
import com.aquatrack.aquatrack.entity.UsageAlert;
import com.aquatrack.aquatrack.repository.UsageAlertRepository;
import com.aquatrack.aquatrack.repository.WaterUsageLogRepository;

@Service
public class AdminDashboardService {

    private final UsageAlertRepository usageAlertRepository;
    private final WaterUsageLogRepository waterUsageLogRepository;

    public AdminDashboardService(UsageAlertRepository usageAlertRepository,
                                 WaterUsageLogRepository waterUsageLogRepository) {
        this.usageAlertRepository = usageAlertRepository;
        this.waterUsageLogRepository = waterUsageLogRepository;
    }

    public List<AdminAlertResponse> getAlerts(Long apartmentId) {
        return usageAlertRepository.findAll().stream().map(a -> {
            AdminAlertResponse res = new AdminAlertResponse();
            res.setId(a.getId());
            res.setTitle(a.getAlertType() == UsageAlert.AlertType.ANOMALY_LEAK ? "Possible leakage detected" : "High water usage");
            res.setDescription(a.getMessage());
            res.setSeverity(a.getAlertType() == UsageAlert.AlertType.ANOMALY_LEAK ? "CRITICAL" : "HIGH");
            res.setStatus(a.isAcknowledged() ? "RESOLVED" : "PENDING");
            res.setTime(a.getCreatedAt());
            if (a.getHousehold() != null && a.getHousehold().getApartment() != null) {
                res.setApartmentName(a.getHousehold().getApartment().getName() + " - Flat " + a.getHousehold().getFlatNumber());
            } else {
                res.setApartmentName("System");
            }
            return res;
        }).sorted((a, b) -> b.getTime().compareTo(a.getTime())).collect(Collectors.toList());
    }

    public AdminAlertSummaryResponse getAlertSummary(Long apartmentId) {

        long critical = usageAlertRepository.countByAlertType(
                UsageAlert.AlertType.ANOMALY_LEAK);

        long pending = usageAlertRepository.countByAcknowledgedFalse();

        long acknowledged = usageAlertRepository.countByAcknowledgedTrue();

        long total = usageAlertRepository.count();

        return new AdminAlertSummaryResponse(
                critical,
                pending,
                acknowledged,
                total
        );
    }

    public List<MonthlyConsumptionResponse> getMonthlyConsumption(Long apartmentId) {
        List<Object[]> raw = waterUsageLogRepository.getMonthlyConsumption();
        List<MonthlyConsumptionResponse> list = new ArrayList<>();
        for (Object[] obj : raw) {
            String month = (String) obj[0];
            BigDecimal value = new BigDecimal(obj[1].toString());
            list.add(new MonthlyConsumptionResponse(month, value));
        }
        return list;
    }

    public List<ApartmentConsumptionResponse> getApartmentConsumption(Long apartmentId) {
        List<Object[]> raw = waterUsageLogRepository.getTopHouseholds();
        List<ApartmentConsumptionResponse> list = new ArrayList<>();
        for (Object[] obj : raw) {
            String flatNumber = (String) obj[1];
            BigDecimal value = new BigDecimal(obj[2].toString());
            list.add(new ApartmentConsumptionResponse(flatNumber, value));
        }
        return list;
    }

    private LocalDate getStartDate(String range) {

        return switch (range.toUpperCase()) {

            case "3M" -> LocalDate.now().minusMonths(3);

            case "6M" -> LocalDate.now().minusMonths(6);

            case "1Y" -> LocalDate.now().minusYears(1);

            case "1M" -> LocalDate.now().minusMonths(1);

            default -> LocalDate.now().minusMonths(1);

        };

    }

    public List<ConsumptionTrendResponse> getConsumptionChart(
        Long apartmentId,
        String mode,
        String range
        ) {

            if ("daily".equalsIgnoreCase(mode)) {

                return getDailyConsumption(apartmentId, range);

            }

            return getMonthlyConsumption(apartmentId, range);

        }
        private List<ConsumptionTrendResponse> getMonthlyConsumption(
            Long apartmentId,
            String range
        ) {

            LocalDate startDate = getStartDate(range);

            List<Object[]> raw = waterUsageLogRepository.getMonthlyConsumption(startDate);

            List<ConsumptionTrendResponse> list = new ArrayList<>();

            for (Object[] obj : raw) {

                list.add(
                    new ConsumptionTrendResponse(
                        obj[0].toString(),
                        new BigDecimal(obj[1].toString())
                    )
                );

            }

            return list;

        }


        private List<ConsumptionTrendResponse> getDailyConsumption(
            Long apartmentId,
        String range
        ) {

            LocalDate startDate = getStartDate(range);

            List<Object[]> raw = waterUsageLogRepository.getDailyConsumption(startDate);

            List<ConsumptionTrendResponse> list = new ArrayList<>();

            for (Object[] obj : raw) {

                list.add(
                    new ConsumptionTrendResponse(
                        obj[0].toString(),
                        new BigDecimal(obj[1].toString())
                    )
                );

            }

            return list;

        }

    public List<UsageStatusResponse> getUsageStatus(Long apartmentId) {
        List<UsageStatusResponse> list = new ArrayList<>();
        long criticalAlerts = usageAlertRepository.countByAlertType(UsageAlert.AlertType.ANOMALY_LEAK);
        long highAlerts = usageAlertRepository.countByAlertType(UsageAlert.AlertType.THRESHOLD_BREACH);
        
        long totalRecords = waterUsageLogRepository.count();
        long normalCount = totalRecords > (criticalAlerts + highAlerts) ? totalRecords - (criticalAlerts + highAlerts) : 10;
        
        list.add(new UsageStatusResponse("Normal Usage", normalCount));
        list.add(new UsageStatusResponse("High Usage", highAlerts));
        list.add(new UsageStatusResponse("Critical Usage", criticalAlerts));

        return list;
    }
}