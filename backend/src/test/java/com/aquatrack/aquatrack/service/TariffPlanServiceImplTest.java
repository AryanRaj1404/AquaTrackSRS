package com.aquatrack.aquatrack.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aquatrack.aquatrack.dto.TariffPlanRequest;
import com.aquatrack.aquatrack.dto.TariffPlanResponse;
import com.aquatrack.aquatrack.dto.TariffTierRequest;
import com.aquatrack.aquatrack.entity.TariffPlan;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.TariffPlanRepository;

@ExtendWith(MockitoExtension.class)
class TariffPlanServiceImplTest {

    @Mock
    private TariffPlanRepository tariffPlanRepository;

    @InjectMocks
    private TariffPlanServiceImpl tariffPlanService;

    @Test
    void createTariffPlanSuccessfully() {

        TariffPlanRequest request = new TariffPlanRequest();
        request.setPlanName("Residential");
        List<TariffTierRequest> tiers = new ArrayList<>();

        TariffTierRequest tier = new TariffTierRequest();
        tier.setTierOrder(1);
        tier.setUptoKl(null);
        tier.setRatePerKl(5.0);

        tiers.add(tier);

        request.setTiers(tiers);
        request.setFixedCharge(100.0);
        request.setEffectiveFrom(LocalDate.now());

        TariffPlan plan = new TariffPlan();
        plan.setId(1L);
        plan.setPlanName("Residential");
        plan.setFixedCharge(100.0);
        plan.setEffectiveFrom(LocalDate.now());

        when(tariffPlanRepository.save(any(TariffPlan.class)))
                .thenReturn(plan);

        TariffPlanResponse response = tariffPlanService.create(request);

        assertEquals("Residential", response.getPlanName());

        verify(tariffPlanRepository).save(any(TariffPlan.class));
    }

    @Test
    void getTariffPlanByIdSuccessfully() {

        TariffPlan plan = new TariffPlan();
        plan.setId(1L);
        plan.setPlanName("Residential");

        when(tariffPlanRepository.findById(1L))
                .thenReturn(Optional.of(plan));

        TariffPlanResponse response = tariffPlanService.getById(1L);

        assertEquals("Residential", response.getPlanName());
    }

    @Test
    void getTariffPlanShouldThrowException() {

        when(tariffPlanRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> tariffPlanService.getById(1L));
    }

    @Test
    void getAllTariffPlansSuccessfully() {

        TariffPlan plan = new TariffPlan();
        plan.setId(1L);
        plan.setPlanName("Residential");

        when(tariffPlanRepository.findAll())
                .thenReturn(List.of(plan));

        List<TariffPlanResponse> response = tariffPlanService.getAll();

        assertEquals(1, response.size());
    }

    @Test
    void deleteTariffPlanSuccessfully() {

        when(tariffPlanRepository.existsById(1L))
                .thenReturn(true);

        tariffPlanService.delete(1L);

        verify(tariffPlanRepository).deleteById(1L);
    }

    @Test
    void deleteShouldThrowException() {

        when(tariffPlanRepository.existsById(1L))
                .thenReturn(false);

        assertThrows(
                ResourceNotFoundException.class,
                () -> tariffPlanService.delete(1L));
    }
}