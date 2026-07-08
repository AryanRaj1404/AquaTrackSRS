package com.aquatrack.aquatrack.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.WaterUsageLogRequest;
import com.aquatrack.aquatrack.dto.WaterUsageLogResponse;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.UsageSource;
import com.aquatrack.aquatrack.entity.WaterUsageLog;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.WaterUsageLogRepository;

@Service
public class WaterUsageLogServiceImpl implements WaterUsageLogService {

    private final WaterUsageLogRepository waterUsageLogRepository;
    private final HouseholdRepository householdRepository;

    public WaterUsageLogServiceImpl(WaterUsageLogRepository waterUsageLogRepository,
                                     HouseholdRepository householdRepository) {
        this.waterUsageLogRepository = waterUsageLogRepository;
        this.householdRepository = householdRepository;
    }

    @Override
    public WaterUsageLogResponse create(WaterUsageLogRequest request) {
        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Household not found with id: " + request.getHouseholdId()));

        WaterUsageLog log = new WaterUsageLog();
        log.setHousehold(household);
        log.setUsageDate(request.getUsageDate());
        log.setLitersConsumed(request.getLitersConsumed());
        log.setSource(UsageSource.MANUAL_ENTRY);

        if (request.getBillingCycleId() != null) {
            // billing cycle linkage can be added here later
        }

        WaterUsageLog saved = waterUsageLogRepository.save(log);
        return toResponse(saved);
    }

    @Override
    public List<WaterUsageLogResponse> getAll() {
        return waterUsageLogRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public WaterUsageLogResponse getById(Long id) {
        WaterUsageLog log = waterUsageLogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Water usage log not found with id: " + id));
        return toResponse(log);
    }

    @Override
    public List<WaterUsageLogResponse> getByHousehold(Long householdId) {
        return waterUsageLogRepository.findByHouseholdId(householdId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public WaterUsageLogResponse update(Long id, WaterUsageLogRequest request) {
        WaterUsageLog log = waterUsageLogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Water usage log not found with id: " + id));

        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Household not found with id: " + request.getHouseholdId()));

        log.setHousehold(household);
        log.setUsageDate(request.getUsageDate());
        log.setLitersConsumed(request.getLitersConsumed());

        WaterUsageLog saved = waterUsageLogRepository.save(log);
        return toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        waterUsageLogRepository.deleteById(id);
    }

    private WaterUsageLogResponse toResponse(WaterUsageLog log) {
        return new WaterUsageLogResponse(
                log.getId(),
                log.getHousehold().getId(),
                log.getUsageDate(),
                log.getLitersConsumed(),
                log.getSource().name(),
                log.getBillingCycle() != null ? log.getBillingCycle().getId() : null
        );
    }
}