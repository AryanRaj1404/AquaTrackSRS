package com.aquatrack.aquatrack.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aquatrack.aquatrack.dto.MeterRequest;
import com.aquatrack.aquatrack.dto.MeterResponse;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.Meter;
import com.aquatrack.aquatrack.entity.MeterType;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
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

    private Household household;
    private Meter meter;

    @BeforeEach
    void setUp() {
        household = new Household();
        household.setId(1L);
        household.setFlatNumber("A-101");

        meter = new Meter();
        meter.setId(1L);
        meter.setMeterNumber("MTR-001");
        meter.setMeterType(MeterType.DIGITAL);
        meter.setInstalledDate(LocalDate.of(2026, 7, 8));
        meter.setActive(true);
        meter.setHousehold(household);
    }

    @Test
    void create_shouldSaveAndReturnMeter_whenHouseholdExists() {
        MeterRequest request = new MeterRequest();
        request.setMeterNumber("MTR-001");
        request.setMeterType(MeterType.DIGITAL);
        request.setInstalledDate(LocalDate.of(2026, 7, 8));
        request.setHouseholdId(1L);

        when(meterRepository.existsByMeterNumber("MTR-001")).thenReturn(false);
        when(householdRepository.findById(1L)).thenReturn(Optional.of(household));
        when(meterRepository.save(any(Meter.class))).thenReturn(meter);

        MeterResponse response = meterService.create(request);

        assertNotNull(response);
        assertEquals("MTR-001", response.getMeterNumber());
        assertEquals("DIGITAL", response.getMeterType());
        assertEquals(1L, response.getHouseholdId());
        verify(meterRepository, times(1)).save(any(Meter.class));
    }

    @Test
    void create_shouldThrowException_whenMeterNumberAlreadyExists() {
        MeterRequest request = new MeterRequest();
        request.setMeterNumber("MTR-001");
        request.setMeterType(MeterType.DIGITAL);
        request.setInstalledDate(LocalDate.of(2026, 7, 8));
        request.setHouseholdId(1L);

        when(meterRepository.existsByMeterNumber("MTR-001")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> meterService.create(request));
        verify(meterRepository, never()).save(any(Meter.class));
    }

    @Test
    void create_shouldThrowException_whenHouseholdNotFound() {
        MeterRequest request = new MeterRequest();
        request.setMeterNumber("MTR-002");
        request.setMeterType(MeterType.ANALOG);
        request.setInstalledDate(LocalDate.of(2026, 7, 8));
        request.setHouseholdId(99L);

        when(meterRepository.existsByMeterNumber("MTR-002")).thenReturn(false);
        when(householdRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> meterService.create(request));
    }

    @Test
    void getById_shouldReturnMeter_whenExists() {
        when(meterRepository.findById(1L)).thenReturn(Optional.of(meter));

        MeterResponse response = meterService.getById(1L);

        assertEquals("MTR-001", response.getMeterNumber());
    }

    @Test
    void getById_shouldThrowException_whenNotFound() {
        when(meterRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> meterService.getById(99L));
    }

    @Test
    void getAll_shouldReturnAllMeters() {
        when(meterRepository.findAll()).thenReturn(List.of(meter));

        List<MeterResponse> results = meterService.getAll();

        assertEquals(1, results.size());
        assertEquals("MTR-001", results.get(0).getMeterNumber());
    }

    @Test
    void delete_shouldRemoveMeter_whenExists() {
        when(meterRepository.existsById(1L)).thenReturn(true);

        meterService.delete(1L);

        verify(meterRepository, times(1)).deleteById(1L);
    }

    @Test
    void delete_shouldThrowException_whenNotFound() {
        when(meterRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> meterService.delete(99L));
        verify(meterRepository, never()).deleteById(any());
    }
}