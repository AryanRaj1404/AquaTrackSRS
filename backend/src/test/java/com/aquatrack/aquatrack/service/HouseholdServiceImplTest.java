package com.aquatrack.aquatrack.service;

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

import com.aquatrack.aquatrack.dto.HouseholdRequest;
import com.aquatrack.aquatrack.dto.HouseholdResponse;
import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class HouseholdServiceImplTest {

    @Mock
    private HouseholdRepository householdRepository;

    @Mock
    private ApartmentRepository apartmentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private HouseholdServiceImpl householdService;

    @Test
    void createHouseholdSuccessfully() {

        Apartment apartment = new Apartment();
        apartment.setId(1L);
        apartment.setName("Green Valley");

        HouseholdRequest request = new HouseholdRequest();
        request.setApartmentId(1L);
        request.setFlatNumber("A101");
        request.setFlatSize(1200.0);
        request.setOccupancy(4);

        Household household = new Household();
        household.setId(1L);
        household.setApartment(apartment);
        household.setFlatNumber("A101");
        household.setFlatSize(1200.0);
        household.setOccupancy(4);

        when(apartmentRepository.findById(1L))
                .thenReturn(Optional.of(apartment));

        when(householdRepository.existsByApartmentIdAndFlatNumber(1L, "A101"))
                .thenReturn(false);

        when(householdRepository.save(any(Household.class)))
                .thenReturn(household);

        HouseholdResponse response = householdService.create(request);

        assertEquals("A101", response.getFlatNumber());

        verify(householdRepository).save(any(Household.class));
    }

    @Test
    void createShouldThrowWhenApartmentNotFound() {

        HouseholdRequest request = new HouseholdRequest();
        request.setApartmentId(1L);

        when(apartmentRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> householdService.create(request));
    }

    @Test
    void createShouldThrowWhenFlatAlreadyExists() {

        Apartment apartment = new Apartment();
        apartment.setId(1L);

        HouseholdRequest request = new HouseholdRequest();
        request.setApartmentId(1L);
        request.setFlatNumber("A101");

        when(apartmentRepository.findById(1L))
                .thenReturn(Optional.of(apartment));

        when(householdRepository.existsByApartmentIdAndFlatNumber(1L, "A101"))
                .thenReturn(true);

        assertThrows(IllegalArgumentException.class,
                () -> householdService.create(request));
    }

    @Test
    void deleteHouseholdSuccessfully() {

        when(householdRepository.existsById(1L))
                .thenReturn(true);

        when(userRepository.findByHouseholdId(1L))
                .thenReturn(java.util.Collections.emptyList());

        householdService.delete(1L);

        verify(householdRepository).deleteById(1L);
    }

}