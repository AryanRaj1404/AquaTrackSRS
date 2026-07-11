package com.aquatrack.aquatrack.service;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aquatrack.aquatrack.dto.ApartmentRequest;
import com.aquatrack.aquatrack.dto.ApartmentResponse;
import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.repository.ApartmentRepository;

@ExtendWith(MockitoExtension.class)
class ApartmentServiceImplTest {

    @Mock
    private ApartmentRepository apartmentRepository;

    @InjectMocks
    private ApartmentServiceImpl apartmentService;

    @Test
    void createApartmentSuccessfully() {

        ApartmentRequest request = new ApartmentRequest();
        request.setName("Green Valley");
        request.setAddress("Delhi");

        Apartment apartment = new Apartment();
        apartment.setId(1L);
        apartment.setName("Green Valley");
        apartment.setAddress("Delhi");

        when(apartmentRepository.save(any(Apartment.class))).thenReturn(apartment);

        ApartmentResponse response = apartmentService.create(request);

        assertEquals(1L, response.getId());
        assertEquals("Green Valley", response.getName());
        assertEquals("Delhi", response.getAddress());

        verify(apartmentRepository).save(any(Apartment.class));
    }

    @Test
    void getApartmentByIdSuccessfully() {

        Apartment apartment = new Apartment();
        apartment.setId(1L);
        apartment.setName("Green Valley");
        apartment.setAddress("Delhi");

        when(apartmentRepository.findById(1L))
                .thenReturn(Optional.of(apartment));

        ApartmentResponse response = apartmentService.getById(1L);

        assertEquals("Green Valley", response.getName());
        assertEquals("Delhi", response.getAddress());
    }

    @Test
    void getApartmentByIdShouldThrowException() {

        when(apartmentRepository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> apartmentService.getById(1L));

        assertEquals("Apartment not found", exception.getMessage());
    }

    @Test
    void getAllApartmentsSuccessfully() {

        Apartment apartment = new Apartment();
        apartment.setId(1L);
        apartment.setName("Green Valley");
        apartment.setAddress("Delhi");

        when(apartmentRepository.findAll())
                .thenReturn(List.of(apartment));

        List<ApartmentResponse> response = apartmentService.getAll();

        assertEquals(1, response.size());
        assertEquals("Green Valley", response.get(0).getName());
    }

    @Test
    void updateApartmentSuccessfully() {

        Apartment apartment = new Apartment();
        apartment.setId(1L);
        apartment.setName("Old");
        apartment.setAddress("Old Address");

        ApartmentRequest request = new ApartmentRequest();
        request.setName("New");
        request.setAddress("New Address");

        when(apartmentRepository.findById(1L))
                .thenReturn(Optional.of(apartment));

        when(apartmentRepository.save(any(Apartment.class)))
                .thenReturn(apartment);

        ApartmentResponse response = apartmentService.update(1L, request);

        assertEquals("New", response.getName());
        assertEquals("New Address", response.getAddress());

        verify(apartmentRepository).save(any(Apartment.class));
    }

    @Test
    void deleteApartmentSuccessfully() {

        when(apartmentRepository.existsById(1L))
                .thenReturn(true);

        apartmentService.delete(1L);

        verify(apartmentRepository).deleteById(1L);
    }

    @Test
    void deleteApartmentShouldThrowException() {

        when(apartmentRepository.existsById(1L))
                .thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> apartmentService.delete(1L));

        assertEquals("Apartment not found", exception.getMessage());

        verify(apartmentRepository, never()).deleteById(anyLong());
    }

}