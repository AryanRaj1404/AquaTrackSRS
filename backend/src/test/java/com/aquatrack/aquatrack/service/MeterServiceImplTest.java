package com.aquatrack.aquatrack.service;

import java.time.LocalDate;
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

import com.aquatrack.aquatrack.dto.MeterRequest;
import com.aquatrack.aquatrack.dto.MeterResponse;
import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.Meter;
import com.aquatrack.aquatrack.enums.MeterType;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.MeterRepository;

@ExtendWith(MockitoExtension.class)
class MeterServiceImplTest {

    @Mock
    private MeterRepository meterRepository;

    @Mock
    private HouseholdRepository householdRepository;

    @InjectMocks
    private MeterServiceImpl meterService;

    @Test
    void createMeterSuccessfully() {

        Apartment apartment = new Apartment();
        apartment.setId(1L);
        apartment.setName("Green Valley");

        Household household = new Household();
        household.setId(1L);
        household.setFlatNumber("A101");
        household.setApartment(apartment);

        MeterRequest request = new MeterRequest();
        request.setMeterNumber("MTR001");
        request.setMeterType(MeterType.DIGITAL);
        request.setInstalledDate(LocalDate.now());
        request.setHouseholdId(1L);

        Meter meter = new Meter();
        meter.setId(1L);
        meter.setMeterNumber("MTR001");
        meter.setMeterType(MeterType.DIGITAL);
        meter.setInstalledDate(LocalDate.now());
        meter.setHousehold(household);
        meter.setActive(true);

        when(meterRepository.existsByMeterNumber("MTR001"))
                .thenReturn(false);

        when(householdRepository.findById(1L))
                .thenReturn(Optional.of(household));

        when(meterRepository.save(any(Meter.class)))
                .thenReturn(meter);

        MeterResponse response = meterService.create(request);

        assertEquals("MTR001", response.getMeterNumber());

        verify(meterRepository).save(any(Meter.class));
    }

    @Test
    void createShouldThrowDuplicateMeterNumber() {

        MeterRequest request = new MeterRequest();
        request.setMeterNumber("MTR001");

        when(meterRepository.existsByMeterNumber("MTR001"))
                .thenReturn(true);

        assertThrows(
                IllegalArgumentException.class,
                () -> meterService.create(request));
    }

    @Test
    void getMeterSuccessfully() {

        Apartment apartment = new Apartment();
        apartment.setName("Green Valley");

        Household household = new Household();
        household.setId(1L);
        household.setFlatNumber("A101");
        household.setApartment(apartment);

        Meter meter = new Meter();
        meter.setId(1L);
        meter.setMeterNumber("MTR001");
        meter.setMeterType(MeterType.DIGITAL);
        meter.setInstalledDate(LocalDate.now());
        meter.setHousehold(household);
        meter.setActive(true);

        when(meterRepository.findById(1L))
                .thenReturn(Optional.of(meter));

        MeterResponse response = meterService.getById(1L);

        assertEquals("MTR001", response.getMeterNumber());
    }

    @Test
    void deleteMeterSuccessfully() {

        when(meterRepository.existsById(1L))
                .thenReturn(true);

        meterService.delete(1L);

        verify(meterRepository).deleteById(1L);
    }

    @Test
    void deleteShouldThrowWhenMeterNotFound() {

        when(meterRepository.existsById(1L))
                .thenReturn(false);

        assertThrows(
                RuntimeException.class,
                () -> meterService.delete(1L));
    }

}