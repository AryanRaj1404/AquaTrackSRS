package com.aquatrack.aquatrack.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.WaterUsageLogRequest;
import com.aquatrack.aquatrack.dto.WaterUsageLogResponse;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.UsageSource;
import com.aquatrack.aquatrack.entity.WaterUsageLog;
import com.aquatrack.aquatrack.repository.BillingCycleRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.WaterUsageLogRepository;

@Service
public class WaterUsageLogServiceImpl implements WaterUsageLogService {

    private final WaterUsageLogRepository waterUsageLogRepository;
    private final HouseholdRepository householdRepository;
    private final BillingCycleRepository billingCycleRepository;

    public WaterUsageLogServiceImpl(WaterUsageLogRepository waterUsageLogRepository,
            HouseholdRepository householdRepository,
            BillingCycleRepository billingCycleRepository) {
        this.waterUsageLogRepository = waterUsageLogRepository;
        this.householdRepository = householdRepository;
        this.billingCycleRepository = billingCycleRepository;
    }

    @Override
    public WaterUsageLogResponse create(WaterUsageLogRequest request) {
        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        WaterUsageLog log = new WaterUsageLog();
        log.setHousehold(household);
        log.setUsageDate(request.getUsageDate());
        log.setLitersConsumed(request.getLitersConsumed());
        log.setSource(parseSource(request.getSource()));

        if (request.getBillingCycleId() != null) {
            BillingCycle billingCycle = billingCycleRepository.findById(request.getBillingCycleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Billing cycle not found"));
            log.setBillingCycle(billingCycle);
        }

        WaterUsageLog saved = waterUsageLogRepository.save(log);
        return toResponse(saved);
    }

    @Override
    public List<WaterUsageLogResponse> getAll() {
        return waterUsageLogRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public WaterUsageLogResponse getById(Long id) {
        WaterUsageLog log = waterUsageLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usage log not found"));
        return toResponse(log);
    }

    @Override
    public List<WaterUsageLogResponse> getByHousehold(Long householdId) {
        return waterUsageLogRepository.findByHouseholdId(householdId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public WaterUsageLogResponse update(Long id, WaterUsageLogRequest request) {
        WaterUsageLog log = waterUsageLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usage log not found"));

        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        log.setHousehold(household);
        log.setUsageDate(request.getUsageDate());
        log.setLitersConsumed(request.getLitersConsumed());
        log.setSource(parseSource(request.getSource()));

        if (request.getBillingCycleId() != null) {
            BillingCycle billingCycle = billingCycleRepository.findById(request.getBillingCycleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Billing cycle not found"));
            log.setBillingCycle(billingCycle);
        } else {
            log.setBillingCycle(null);
        }

        WaterUsageLog saved = waterUsageLogRepository.save(log);
        return toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!waterUsageLogRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usage log not found");
        }
        waterUsageLogRepository.deleteById(id);
    }

    private UsageSource parseSource(String source) {
        try {
            return UsageSource.valueOf(source.toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Invalid source. Must be one of: METER, MANUAL_ENTRY, SENSOR");
        }
    }

    private WaterUsageLogResponse toResponse(WaterUsageLog log) {
        return new WaterUsageLogResponse(
                log.getId(),
                log.getHousehold() != null ? log.getHousehold().getId() : null,
                log.getHousehold() != null ? log.getHousehold().getFlatNumber() : null,
                log.getUsageDate(),
                log.getLitersConsumed(),
                log.getSource() != null ? log.getSource().name() : null,
                log.getBillingCycle() != null ? log.getBillingCycle().getId() : null);
    }
}
