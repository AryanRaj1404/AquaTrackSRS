package com.aquatrack.aquatrack.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.entity.UsageAlert;
import com.aquatrack.aquatrack.repository.UsageAlertRepository;

@RestController
@RequestMapping("/alerts")
public class UsageAlertController {

    private final UsageAlertRepository usageAlertRepository;

    public UsageAlertController(UsageAlertRepository usageAlertRepository) {
        this.usageAlertRepository = usageAlertRepository;
    }

    @GetMapping
    public Page<UsageAlertResponse> getAlerts(
            @RequestHeader(
                    value = "X-Workspace-Id",
                    required = false
            ) Long apartmentId,
            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "ALL") String status

    ) {

        Pageable pageable = PageRequest.of(page, size);

        Page<UsageAlert> alerts;

        if(apartmentId == null){
            switch (status.toUpperCase()){
                case "PENDING":
                    alerts = usageAlertRepository.findByAcknowledged(false, pageable);
                    break;
                case "ACKNOWLEDGED":
                    alerts = usageAlertRepository.findByAcknowledged(true, pageable);
                    break;
                default:
                    alerts = usageAlertRepository.findAllByOrderByCreatedAtDesc(pageable);
            }
        } 
            else switch (status.toUpperCase()){
                case "PENDING":
                    alerts = usageAlertRepository.findByHousehold_Apartment_IdAndAcknowledged(apartmentId, false, pageable);
                    break;
                case "ACKNOWLEDGED":
                    alerts = usageAlertRepository.findByHousehold_Apartment_IdAndAcknowledged(apartmentId, true, pageable);
                    break;
                default:
                    alerts = usageAlertRepository.findByHousehold_Apartment_IdOrderByCreatedAtDesc(apartmentId, pageable);
            }
        return alerts.map(UsageAlertResponse::from);

    }

    @GetMapping("/recent")
    public List<UsageAlertResponse> getRecentAlerts(

            @RequestHeader(
                    value = "X-Workspace-Id",
                    required = false
            )
            Long apartmentId

    ) {

        List<UsageAlert> alerts =
                apartmentId == null
                        ? usageAlertRepository
                            .findTop5ByAcknowledgedFalseOrderByCreatedAtDesc()
                        : usageAlertRepository
                            .findTop5ByHousehold_Apartment_IdAndAcknowledgedFalseOrderByCreatedAtDesc(
                                    apartmentId);

        return alerts.stream()
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
        public String apartmentName;
        public String householdName;
        public UsageAlert.AlertType alertType;
        public LocalDate triggeredOn;
        public Double litersConsumed;
        public Double thresholdValue;
        public Double householdAverage;
        public String message;
        public boolean acknowledged;
        public LocalDateTime createdAt;

        public static UsageAlertResponse from(UsageAlert a) {
            UsageAlertResponse r = new UsageAlertResponse();
            r.id = a.getId();
            r.householdId = a.getHousehold().getId();
            r.householdName = a.getHousehold().getFlatNumber(); // or getHouseholdNumber()/getFlatNumber()
            r.apartmentName = a.getHousehold().getApartment().getName();
            r.alertType = a.getAlertType();
            r.triggeredOn = a.getTriggeredOn();
            r.litersConsumed = a.getLitersConsumed();
            r.thresholdValue = a.getThresholdValue();
            r.householdAverage = a.getHouseholdAverage();
            r.message = a.getMessage();
            r.acknowledged = a.isAcknowledged();
            r.createdAt = a.getCreatedAt();
            return r;
        }
    }
}