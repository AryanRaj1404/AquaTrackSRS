package com.aquatrack.aquatrack.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.BillingCycleRequest;
import com.aquatrack.aquatrack.dto.BillingCycleResponse;
import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.TariffPlan;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.BillingCycleRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.TariffPlanRepository;

@Service
public class BillingCycleServiceImpl implements BillingCycleService {

    private final BillingCycleRepository billingCycleRepository;
    private final HouseholdRepository householdRepository;
    private final TariffPlanRepository tariffPlanRepository;

    public BillingCycleServiceImpl(
            BillingCycleRepository billingCycleRepository,
            HouseholdRepository householdRepository,
            TariffPlanRepository tariffPlanRepository) {

        this.billingCycleRepository = billingCycleRepository;
        this.householdRepository = householdRepository;
        this.tariffPlanRepository = tariffPlanRepository;
    }

    @Override
    public BillingCycleResponse create(BillingCycleRequest request) {

        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        TariffPlan tariffPlan = null;

        if (request.getTariffPlanId() != null) {
            tariffPlan = tariffPlanRepository.findById(request.getTariffPlanId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tariff plan not found"));
        }

        BillingCycle billingCycle = new BillingCycle();

        billingCycle.setStartDate(request.getStartDate());
        billingCycle.setEndDate(request.getEndDate());
        billingCycle.setTotalAmount(request.getTotalAmount());
        billingCycle.setStatus(request.getStatus());
        billingCycle.setHousehold(household);
        billingCycle.setTariffPlan(tariffPlan);

        return toResponse(billingCycleRepository.save(billingCycle));
    }

    @Override
    public List<BillingCycleResponse> getAll() {
        return billingCycleRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BillingCycleResponse getById(Long id) {

        BillingCycle billingCycle = billingCycleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Billing cycle not found"));

        return toResponse(billingCycle);
    }

    @Override
    public List<BillingCycleResponse> getByHousehold(Long householdId) {
        return billingCycleRepository.findByHouseholdId(householdId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BillingCycleResponse update(Long id, BillingCycleRequest request) {

        BillingCycle billingCycle = billingCycleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Billing cycle not found"));

        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        TariffPlan tariffPlan = null;

        if (request.getTariffPlanId() != null) {
            tariffPlan = tariffPlanRepository.findById(request.getTariffPlanId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tariff plan not found"));
        }

        billingCycle.setStartDate(request.getStartDate());
        billingCycle.setEndDate(request.getEndDate());
        billingCycle.setTotalAmount(request.getTotalAmount());
        billingCycle.setStatus(request.getStatus());
        billingCycle.setHousehold(household);
        billingCycle.setTariffPlan(tariffPlan);

        return toResponse(billingCycleRepository.save(billingCycle));
    }

    @Override
    public void delete(Long id) {

        if (!billingCycleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Billing cycle not found");
        }

        billingCycleRepository.deleteById(id);
    }

    private BillingCycleResponse toResponse(BillingCycle billingCycle) {

        return new BillingCycleResponse(
                billingCycle.getId(),
                billingCycle.getStartDate(),
                billingCycle.getEndDate(),
                billingCycle.getTotalAmount(),
                billingCycle.getStatus(),
                billingCycle.getHousehold().getId(),
                billingCycle.getHousehold().getFlatNumber(),
                billingCycle.getTariffPlan() != null ? billingCycle.getTariffPlan().getId() : null,
                billingCycle.getTariffPlan() != null ? billingCycle.getTariffPlan().getPlanName() : null
        );
    }
}