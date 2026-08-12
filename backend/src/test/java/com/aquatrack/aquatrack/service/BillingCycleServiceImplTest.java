package com.aquatrack.aquatrack.service;

import java.time.LocalDate;
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

import com.aquatrack.aquatrack.dto.BillingCycleRequest;
import com.aquatrack.aquatrack.dto.BillingCycleResponse;
import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.TariffPlan;
import com.aquatrack.aquatrack.enums.BillingCycleStatus;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.BillingCycleRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.TariffPlanRepository;

@ExtendWith(MockitoExtension.class)
class BillingCycleServiceImplTest {

    @Mock
    private BillingCycleRepository billingCycleRepository;

    @Mock
    private HouseholdRepository householdRepository;

    @Mock
    private TariffPlanRepository tariffPlanRepository;

    @InjectMocks
    private BillingCycleServiceImpl billingCycleService;

    @Test
    void createBillingCycleSuccessfully() {

        Apartment apartment = new Apartment();
        apartment.setName("Green Valley");

        Household household = new Household();
        household.setId(1L);
        household.setFlatNumber("A101");
        household.setApartment(apartment);

        TariffPlan tariffPlan = new TariffPlan();
        tariffPlan.setId(1L);
        tariffPlan.setPlanName("Residential");

        BillingCycleRequest request = new BillingCycleRequest();
        request.setApartmentId(1L);
        request.setTariffPlanId(1L);
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusMonths(1));
        request.setTotalAmount(850.0);
        request.setStatus(BillingCycleStatus.OPEN);

        BillingCycle billingCycle = new BillingCycle();
        billingCycle.setId(1L);
        billingCycle.setApartment(apartment);
        billingCycle.setTariffPlan(tariffPlan);
        billingCycle.setStartDate(request.getStartDate());
        billingCycle.setEndDate(request.getEndDate());
        billingCycle.setTotalAmount(850.0);
        billingCycle.setStatus(BillingCycleStatus.OPEN);

        when(householdRepository.findById(1L))
                .thenReturn(Optional.of(household));

        when(tariffPlanRepository.findById(1L))
                .thenReturn(Optional.of(tariffPlan));

        when(billingCycleRepository.save(any(BillingCycle.class)))
                .thenReturn(billingCycle);

        BillingCycleResponse response = billingCycleService.create(request);

        assertEquals(850.0, response.getTotalAmount());

        verify(billingCycleRepository).save(any(BillingCycle.class));
    }

    @Test
    void getBillingCycleByIdSuccessfully() {

        Household household = new Household();
        household.setId(1L);
        household.setFlatNumber("A101");

        BillingCycle billingCycle = new BillingCycle();
        billingCycle.setId(1L);
        Apartment apartment = new Apartment();
        apartment.setId(1L);
        apartment.setName("ABC Residency");

        billingCycle.setApartment(apartment);

        when(billingCycleRepository.findById(1L))
                .thenReturn(Optional.of(billingCycle));

        BillingCycleResponse response =
                billingCycleService.getById(1L);

        assertEquals(1L, response.getId());
    }

    @Test
    void getBillingCycleShouldThrowException() {

        when(billingCycleRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> billingCycleService.getById(1L));
    }

    @Test
    void getAllBillingCyclesSuccessfully() {

        Household household = new Household();
        household.setId(1L);
        household.setFlatNumber("A101");

        BillingCycle billingCycle = new BillingCycle();
        billingCycle.setId(1L);
        Apartment apartment = new Apartment();
        apartment.setId(1L);
        apartment.setName("ABC Residency");

        billingCycle.setApartment(apartment);

        when(billingCycleRepository.findAll())
                .thenReturn(List.of(billingCycle));

        List<BillingCycleResponse> response =
                billingCycleService.getAll(1L);

        assertEquals(1, response.size());
    }

    @Test
    void deleteBillingCycleSuccessfully() {

        when(billingCycleRepository.existsById(1L))
                .thenReturn(true);

        billingCycleService.delete(1L);

        verify(billingCycleRepository).deleteById(1L);
    }

    @Test
    void deleteShouldThrowException() {

        when(billingCycleRepository.existsById(1L))
                .thenReturn(false);

        assertThrows(
                ResourceNotFoundException.class,
                () -> billingCycleService.delete(1L));
    }

}