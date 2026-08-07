package com.aquatrack.aquatrack.service;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import com.aquatrack.aquatrack.dto.WaterUsageLogRequest;
import com.aquatrack.aquatrack.dto.WaterUsageLogResponse;
import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.WaterUsageLog;
import com.aquatrack.aquatrack.enums.UsageSource;
import com.aquatrack.aquatrack.repository.BillingCycleRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.WaterUsageLogRepository;

@ExtendWith(MockitoExtension.class)
class WaterUsageLogServiceImplTest {

    @Mock
    private WaterUsageLogRepository waterUsageLogRepository;

    @Mock
    private HouseholdRepository householdRepository;

    @Mock
    private BillingCycleRepository billingCycleRepository;

    @InjectMocks
    private WaterUsageLogServiceImpl waterUsageLogService;

    @Test
    void createUsageLogSuccessfully() {

        Apartment apartment = new Apartment();
        apartment.setName("Green Valley");

        Household household = new Household();
        household.setId(1L);
        household.setFlatNumber("A101");
        household.setApartment(apartment);

        BillingCycle billingCycle = new BillingCycle();
        billingCycle.setId(1L);
        billingCycle.setStartDate(LocalDate.now().minusDays(1));
        billingCycle.setEndDate(LocalDate.now().plusDays(1));

        WaterUsageLogRequest request = new WaterUsageLogRequest();
        request.setHouseholdId(1L);
        request.setBillingCycleId(1L);
        request.setUsageDate(LocalDate.now());
        request.setLitersConsumed(500.0);

        WaterUsageLog log = new WaterUsageLog();
        log.setId(1L);
        log.setHousehold(household);
        log.setBillingCycle(billingCycle);
        log.setUsageDate(LocalDate.now());
        log.setLitersConsumed(500.0);
        log.setSource(UsageSource.MANUAL_ENTRY);

        when(waterUsageLogRepository.existsByHouseholdIdAndUsageDate(
                anyLong(),
                any(LocalDate.class)))
                .thenReturn(false);

        when(householdRepository.findById(1L))
                .thenReturn(Optional.of(household));

        when(billingCycleRepository.findById(1L))
                .thenReturn(Optional.of(billingCycle));

        when(waterUsageLogRepository.save(any(WaterUsageLog.class)))
                .thenReturn(log);

        WaterUsageLogResponse response =
                waterUsageLogService.create(null, request);

        assertEquals(500.0,
                response.getLitersConsumed());

        verify(waterUsageLogRepository)
                .save(any(WaterUsageLog.class));
    }

    @Test
    void createShouldThrowDuplicateEntry() {

        WaterUsageLogRequest request =
                new WaterUsageLogRequest();

        request.setHouseholdId(1L);
        request.setUsageDate(LocalDate.now());

        when(waterUsageLogRepository.existsByHouseholdIdAndUsageDate(
                anyLong(),
                any(LocalDate.class)))
                .thenReturn(true);

        assertThrows(
                IllegalArgumentException.class,
                () -> waterUsageLogService.create(null, request));
    }

    @Test
    void deleteUsageLogSuccessfully() {

        Apartment apartment = new Apartment();
        apartment.setName("Green Valley");

        Household household = new Household();
        household.setId(1L);
        household.setApartment(apartment);

        WaterUsageLog log = new WaterUsageLog();
        log.setId(1L);
        log.setHousehold(household);

        when(waterUsageLogRepository.findById(1L))
                .thenReturn(Optional.of(log));

        waterUsageLogService.delete(null, 1L);

        verify(waterUsageLogRepository)
                .delete(log);
    }

    @Test
    void deleteShouldThrowWhenLogNotFound() {

        when(waterUsageLogRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> waterUsageLogService.delete(null, 1L));
    }

    @Test
    void uploadEmptyCsvShouldThrowException() {

        MockMultipartFile file =
                new MockMultipartFile(
                        "file",
                        "usage.csv",
                        "text/csv",
                        new byte[0]);

        assertThrows(
                IllegalArgumentException.class,
                () -> waterUsageLogService.uploadCsv(
                        null,
                        file,
                        1L));
    }

}