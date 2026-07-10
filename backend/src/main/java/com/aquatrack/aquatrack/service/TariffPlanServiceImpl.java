package com.aquatrack.aquatrack.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.TariffPlanRequest;
import com.aquatrack.aquatrack.dto.TariffPlanResponse;
import com.aquatrack.aquatrack.entity.TariffPlan;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.TariffPlanRepository;

@Service
public class TariffPlanServiceImpl implements TariffPlanService {

    private final TariffPlanRepository tariffPlanRepository;

    public TariffPlanServiceImpl(TariffPlanRepository tariffPlanRepository) {
        this.tariffPlanRepository = tariffPlanRepository;
    }

    @Override
    public TariffPlanResponse create(TariffPlanRequest request) {

        TariffPlan tariffPlan = new TariffPlan();

        tariffPlan.setPlanName(request.getPlanName());
        tariffPlan.setRatePerUnit(request.getRatePerUnit());
        tariffPlan.setFixedCharge(request.getFixedCharge());
        tariffPlan.setEffectiveFrom(request.getEffectiveFrom());
        tariffPlan.setEffectiveTo(request.getEffectiveTo());
        tariffPlan.setDescription(request.getDescription());

        return toResponse(tariffPlanRepository.save(tariffPlan));
    }

    @Override
    public List<TariffPlanResponse> getAll() {
        return tariffPlanRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public TariffPlanResponse getById(Long id) {

        TariffPlan tariffPlan = tariffPlanRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tariff plan not found"));

        return toResponse(tariffPlan);
    }

    @Override
    public TariffPlanResponse update(Long id, TariffPlanRequest request) {

        TariffPlan tariffPlan = tariffPlanRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tariff plan not found"));

        tariffPlan.setPlanName(request.getPlanName());
        tariffPlan.setRatePerUnit(request.getRatePerUnit());
        tariffPlan.setFixedCharge(request.getFixedCharge());
        tariffPlan.setEffectiveFrom(request.getEffectiveFrom());
        tariffPlan.setEffectiveTo(request.getEffectiveTo());
        tariffPlan.setDescription(request.getDescription());

        return toResponse(tariffPlanRepository.save(tariffPlan));
    }

    @Override
    public void delete(Long id) {

        if (!tariffPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tariff plan not found");
        }

        tariffPlanRepository.deleteById(id);
    }

    private TariffPlanResponse toResponse(TariffPlan tariffPlan) {

        return new TariffPlanResponse(
                tariffPlan.getId(),
                tariffPlan.getPlanName(),
                tariffPlan.getRatePerUnit(),
                tariffPlan.getFixedCharge(),
                tariffPlan.getEffectiveFrom(),
                tariffPlan.getEffectiveTo(),
                tariffPlan.getDescription());
    }
}