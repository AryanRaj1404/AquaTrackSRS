package com.aquatrack.aquatrack.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.MeterRequest;
import com.aquatrack.aquatrack.dto.MeterResponse;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.Meter;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.MeterRepository;

@Service
public class MeterServiceImpl implements MeterService {

    private final MeterRepository meterRepository;
    private final HouseholdRepository householdRepository;

    public MeterServiceImpl(MeterRepository meterRepository, HouseholdRepository householdRepository) {
        this.meterRepository = meterRepository;
        this.householdRepository = householdRepository;
    }

    @Override
    public MeterResponse create(MeterRequest request) {
        if (meterRepository.existsByMeterNumber(request.getMeterNumber())) {
            throw new IllegalArgumentException("Meter number already exists: " + request.getMeterNumber());
        }

        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        Meter meter = new Meter();
        meter.setMeterNumber(request.getMeterNumber());
        meter.setMeterType(request.getMeterType());
        meter.setInstalledDate(request.getInstalledDate());
        meter.setHousehold(household);
        meter.setActive(true);

        Meter saved = meterRepository.save(meter);
        return toResponse(saved);
    }

    @Override
    public List<MeterResponse> getAll() {
        return meterRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public MeterResponse getById(Long id) {
        Meter meter = meterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meter not found"));
        return toResponse(meter);
    }

    @Override
    public List<MeterResponse> getByHousehold(Long householdId) {
        return meterRepository.findByHouseholdId(householdId).stream().map(this::toResponse).toList();
    }

    @Override
    public MeterResponse update(Long id, MeterRequest request) {
        Meter meter = meterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meter not found"));

        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        meter.setMeterNumber(request.getMeterNumber());
        meter.setMeterType(request.getMeterType());
        meter.setInstalledDate(request.getInstalledDate());
        meter.setHousehold(household);

        Meter saved = meterRepository.save(meter);
        return toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!meterRepository.existsById(id)) {
            throw new ResourceNotFoundException("Meter not found");
        }
        meterRepository.deleteById(id);
    }

    private MeterResponse toResponse(Meter meter) {
        return new MeterResponse(
                meter.getId(),
                meter.getMeterNumber(),
                meter.getMeterType().name(),
                meter.getInstalledDate(),
                meter.getActive(),
                meter.getHousehold().getId(),
                meter.getHousehold().getFlatNumber()
        );
    }
}