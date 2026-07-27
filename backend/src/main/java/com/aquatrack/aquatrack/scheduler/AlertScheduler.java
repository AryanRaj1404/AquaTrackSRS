package com.aquatrack.aquatrack.scheduler;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.UsageAlert;
import com.aquatrack.aquatrack.entity.WaterUsageLog;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.UsageAlertRepository;
import com.aquatrack.aquatrack.repository.WaterUsageLogRepository;
import com.aquatrack.aquatrack.service.AlertEmailService;
import com.aquatrack.aquatrack.service.AnomalyDetectionService;

@Component
public class AlertScheduler {

    private final HouseholdRepository householdRepository;
    private final WaterUsageLogRepository usageLogRepository;
    private final UsageAlertRepository usageAlertRepository;
    private final AnomalyDetectionService anomalyDetectionService;
    private final AlertEmailService alertEmailService;

    @Value("${aquatrack.alerts.daily-threshold-liters:500}")
    private double dailyThresholdLiters;

    public AlertScheduler(HouseholdRepository householdRepository,
                           WaterUsageLogRepository usageLogRepository,
                           UsageAlertRepository usageAlertRepository,
                           AnomalyDetectionService anomalyDetectionService,
                           AlertEmailService alertEmailService) {
        this.householdRepository = householdRepository;
        this.usageLogRepository = usageLogRepository;
        this.usageAlertRepository = usageAlertRepository;
        this.anomalyDetectionService = anomalyDetectionService;
        this.alertEmailService = alertEmailService;
    }

    // @Scheduled(cron = "${aquatrack.alerts.cron:0 0 6 * * *}")
    @Scheduled(fixedRate = 30000)
    public void runDailyAlertCheck() {
        System.out.println("Alert Scheduler Executed");
        LocalDate today = LocalDate.now();
        List<Household> households = householdRepository.findAll();

        for (Household household : households) {
            List<WaterUsageLog> logs = usageLogRepository.findByHouseholdId(household.getId());
            if (logs.isEmpty()) continue;

            logs.sort(Comparator.comparing(WaterUsageLog::getUsageDate).reversed());
            WaterUsageLog latest = logs.get(0);
            if (!latest.getUsageDate().equals(today)) continue;

            double todayLiters = latest.getLitersConsumed();

            boolean alreadyBreached = usageAlertRepository.existsByHouseholdIdAndAlertTypeAndTriggeredOn(
                    household.getId(), UsageAlert.AlertType.THRESHOLD_BREACH, today);
            if (todayLiters > dailyThresholdLiters && !alreadyBreached) {
                raiseAlert(household, UsageAlert.AlertType.THRESHOLD_BREACH, today, todayLiters,
                        dailyThresholdLiters,
                        String.format("Usage of %.1fL today exceeds the %.1fL daily threshold.", todayLiters, dailyThresholdLiters));
            }

            List<Double> history = logs.stream().skip(1).map(WaterUsageLog::getLitersConsumed).collect(Collectors.toList());
            AnomalyDetectionService.AnomalyResult result = anomalyDetectionService.checkForAnomaly(history, todayLiters);

            boolean alreadyAnomalous = usageAlertRepository.existsByHouseholdIdAndAlertTypeAndTriggeredOn(
                    household.getId(), UsageAlert.AlertType.ANOMALY_LEAK, today);
            if (result.anomalous && !alreadyAnomalous) {
                raiseAlert(household, UsageAlert.AlertType.ANOMALY_LEAK, today, todayLiters, result.mean,
                        String.format("Usage of %.1fL is over 2 std-dev above the household average of %.1fL — possible leak.", todayLiters, result.mean));
            }
        }
    }

    private void raiseAlert(Household household, UsageAlert.AlertType type, LocalDate date,
                             double liters, double thresholdValue, String message) {
        UsageAlert alert = new UsageAlert();
        alert.setHousehold(household);
        alert.setAlertType(type);
        alert.setTriggeredOn(date);
        alert.setLitersConsumed(liters);
        alert.setThresholdValue(thresholdValue);
        alert.setMessage(message);
        usageAlertRepository.save(alert);

        alertEmailService.sendAlertEmail(household, type, message, date);
    }
}