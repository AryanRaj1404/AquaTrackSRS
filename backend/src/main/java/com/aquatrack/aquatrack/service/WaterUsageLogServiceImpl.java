package com.aquatrack.aquatrack.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aquatrack.aquatrack.dto.WaterUsageLogRequest;
import com.aquatrack.aquatrack.dto.WaterUsageLogResponse;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.enums.UsageSource;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
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
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        WaterUsageLog log = new WaterUsageLog();
        log.setHousehold(household);
        log.setUsageDate(request.getUsageDate());
        log.setLitersConsumed(request.getLitersConsumed());
        log.setSource(UsageSource.MANUAL_ENTRY);

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
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
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
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        log.setHousehold(household);
        log.setUsageDate(request.getUsageDate());
        log.setLitersConsumed(request.getLitersConsumed());

        WaterUsageLog saved = waterUsageLogRepository.save(log);
        return toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!waterUsageLogRepository.existsById(id)) {
            throw new ResourceNotFoundException("Water usage log not found");
        }

        waterUsageLogRepository.deleteById(id);
    }

    @Override
    public List<WaterUsageLogResponse> uploadCsv(MultipartFile file) {
        List<WaterUsageLogResponse> results = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                if (line.isBlank()) continue;

                String[] parts = line.split(",");
                if (parts.length < 3) {
                    throw new IllegalArgumentException("Invalid CSV row: " + line);
                }

                Long householdId = Long.parseLong(parts[0].trim());
                LocalDate usageDate = LocalDate.parse(parts[1].trim());
                Double litersConsumed = Double.parseDouble(parts[2].trim());

                WaterUsageLogRequest request = new WaterUsageLogRequest();
                request.setHouseholdId(householdId);
                request.setUsageDate(usageDate);
                request.setLitersConsumed(litersConsumed);

                results.add(create(request));
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to read CSV file: " + e.getMessage());
        }

        return results;
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