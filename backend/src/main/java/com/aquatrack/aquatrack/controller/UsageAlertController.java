package com.aquatrack.aquatrack.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.entity.UsageAlert;
import com.aquatrack.aquatrack.repository.UsageAlertRepository;

@RestController
@RequestMapping("/households/{householdId}/alerts")
public class UsageAlertController {

    private final UsageAlertRepository usageAlertRepository;

    public UsageAlertController(UsageAlertRepository usageAlertRepository) {
        this.usageAlertRepository = usageAlertRepository;
    }

    @GetMapping
    public List<UsageAlertResponse> getAlerts(@PathVariable Long householdId) {
        return usageAlertRepository.findByHouseholdIdOrderByCreatedAtDesc(householdId)
                .stream()
                .map(UsageAlertResponse::from)
                .collect(Collectors.toList());
    }

    @PostMapping("/{alertId}/acknowledge")
    public UsageAlertResponse acknowledge(@PathVariable Long alertId) {
        UsageAlert alert = usageAlertRepository.findById(alertId).orElseThrow();
        alert.setAcknowledged(true);
        return UsageAlertResponse.from(usageAlertRepository.save(alert));
    }

    public static class UsageAlertResponse {
        public Long id;
        public Long householdId;
        public UsageAlert.AlertType alertType;
        public LocalDate triggeredOn;
        public Double litersConsumed;
        public Double thresholdValue;
        public String message;
        public boolean acknowledged;
        public LocalDateTime createdAt;

        public static UsageAlertResponse from(UsageAlert a) {
            UsageAlertResponse r = new UsageAlertResponse();
            r.id = a.getId();
            r.householdId = a.getHousehold().getId();
            r.alertType = a.getAlertType();
            r.triggeredOn = a.getTriggeredOn();
            r.litersConsumed = a.getLitersConsumed();
            r.thresholdValue = a.getThresholdValue();
            r.message = a.getMessage();
            r.acknowledged = a.isAcknowledged();
            r.createdAt = a.getCreatedAt();
            return r;
        }
    }
}