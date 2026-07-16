package com.aquatrack.aquatrack.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aquatrack.aquatrack.dto.TariffPlanRequest;
import com.aquatrack.aquatrack.dto.TariffPlanResponse;
import com.aquatrack.aquatrack.dto.TariffTierRequest;
import com.aquatrack.aquatrack.dto.TariffTierResponse;
import com.aquatrack.aquatrack.entity.TariffPlan;
import com.aquatrack.aquatrack.entity.TariffTier;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.TariffPlanRepository;

@Service
public class TariffPlanServiceImpl implements TariffPlanService {

    private final TariffPlanRepository tariffPlanRepository;

    public TariffPlanServiceImpl(TariffPlanRepository tariffPlanRepository) {
        this.tariffPlanRepository = tariffPlanRepository;
    }

    @Override
    @Transactional
    public TariffPlanResponse create(TariffPlanRequest request) {

        TariffPlan tariffPlan = new TariffPlan();

        tariffPlan.setPlanName(request.getPlanName());
        tariffPlan.setFixedCharge(request.getFixedCharge());
        tariffPlan.setEffectiveFrom(request.getEffectiveFrom());
        tariffPlan.setEffectiveTo(request.getEffectiveTo());
        tariffPlan.setDescription(request.getDescription());

        List<TariffTier> tiers = request.getTiers()
                .stream()
                .map(tierRequest -> buildTier(tierRequest, tariffPlan))
                .toList();

        tariffPlan.setTiers(tiers);

        TariffPlan saved = tariffPlanRepository.save(tariffPlan);

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TariffPlanResponse> getAll() {

        return tariffPlanRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TariffPlanResponse getById(Long id) {

        TariffPlan tariffPlan = tariffPlanRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tariff plan not found"));

        return toResponse(tariffPlan);
    }

    @Override
    @Transactional
    public TariffPlanResponse update(Long id, TariffPlanRequest request) {

        TariffPlan tariffPlan = tariffPlanRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tariff plan not found"));

        tariffPlan.setPlanName(request.getPlanName());
        tariffPlan.setFixedCharge(request.getFixedCharge());
        tariffPlan.setEffectiveFrom(request.getEffectiveFrom());
        tariffPlan.setEffectiveTo(request.getEffectiveTo());
        tariffPlan.setDescription(request.getDescription());

        tariffPlan.getTiers().clear();

        List<TariffTier> tiers = request.getTiers()
                .stream()
                .map(tierRequest -> buildTier(tierRequest, tariffPlan))
                .toList();

        tariffPlan.getTiers().addAll(tiers);

        TariffPlan updated = tariffPlanRepository.save(tariffPlan);

        return toResponse(updated);
    }

    @Override
    public void delete(Long id) {

        if (!tariffPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tariff plan not found");
        }

        tariffPlanRepository.deleteById(id);
    }

    private TariffTier buildTier(
            TariffTierRequest request,
            TariffPlan tariffPlan) {

        TariffTier tier = new TariffTier();

        tier.setTierOrder(request.getTierOrder());
        tier.setUptoKl(request.getUptoKl());
        tier.setRatePerKl(request.getRatePerKl());

        tier.setTariffPlan(tariffPlan);

        return tier;
    }

    private TariffPlanResponse toResponse(TariffPlan tariffPlan) {

        List<TariffTierResponse> tiers = tariffPlan.getTiers()
                .stream()
                .map(tier -> new TariffTierResponse(
                        tier.getId(),
                        tier.getTierOrder(),
                        tier.getUptoKl(),
                        tier.getRatePerKl()))
                .toList();

        return new TariffPlanResponse(
                tariffPlan.getId(),
                tariffPlan.getPlanName(),
                tiers,
                tariffPlan.getFixedCharge(),
                tariffPlan.getEffectiveFrom(),
                tariffPlan.getEffectiveTo(),
                tariffPlan.getDescription());
    }
}