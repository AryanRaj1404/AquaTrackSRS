package com.aquatrack.aquatrack.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.TariffTierRequest;
import com.aquatrack.aquatrack.dto.TariffTierResponse;
import com.aquatrack.aquatrack.entity.TariffPlan;
import com.aquatrack.aquatrack.entity.TariffTier;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.TariffPlanRepository;
import com.aquatrack.aquatrack.repository.TariffTierRepository;

@Service
public class TariffTierServiceImpl implements TariffTierService {

    private final TariffTierRepository tariffTierRepository;
    private final TariffPlanRepository tariffPlanRepository;

    public TariffTierServiceImpl(
            TariffTierRepository tariffTierRepository,
            TariffPlanRepository tariffPlanRepository) {

        this.tariffTierRepository = tariffTierRepository;
        this.tariffPlanRepository = tariffPlanRepository;
    }

    @Override
    public TariffTierResponse create(TariffTierRequest request) {

        TariffPlan tariffPlan = tariffPlanRepository.findById(request.getTariffPlanId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tariff plan not found"));

        TariffTier tariffTier = new TariffTier();

        tariffTier.setTierOrder(request.getTierOrder());
        tariffTier.setUptoKl(request.getUptoKl());
        tariffTier.setRatePerKl(request.getRatePerKl());
        tariffTier.setTariffPlan(tariffPlan);

        return toResponse(
                tariffTierRepository.save(tariffTier));
    }

    @Override
    public List<TariffTierResponse> getAll() {

        return tariffTierRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public TariffTierResponse getById(Long id) {

        TariffTier tariffTier = tariffTierRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tariff tier not found"));

        return toResponse(tariffTier);
    }

    @Override
    public TariffTierResponse update(Long id,
                                     TariffTierRequest request) {

        TariffTier tariffTier = tariffTierRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tariff tier not found"));

        TariffPlan tariffPlan = tariffPlanRepository.findById(request.getTariffPlanId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tariff plan not found"));

        tariffTier.setTierOrder(request.getTierOrder());
        tariffTier.setUptoKl(request.getUptoKl());
        tariffTier.setRatePerKl(request.getRatePerKl());
        tariffTier.setTariffPlan(tariffPlan);

        return toResponse(
                tariffTierRepository.save(tariffTier));
    }

    @Override
    public void delete(Long id) {

        if (!tariffTierRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tariff tier not found");
        }

        tariffTierRepository.deleteById(id);
    }

    private TariffTierResponse toResponse(
            TariffTier tariffTier) {

        return new TariffTierResponse(
                tariffTier.getId(),
                tariffTier.getTierOrder(),
                tariffTier.getUptoKl(),
                tariffTier.getRatePerKl());
    }
}