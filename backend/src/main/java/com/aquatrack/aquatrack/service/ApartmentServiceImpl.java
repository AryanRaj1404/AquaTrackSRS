package com.aquatrack.aquatrack.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aquatrack.aquatrack.dto.ApartmentRequest;
import com.aquatrack.aquatrack.dto.ApartmentResponse;
import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;

@Service
public class ApartmentServiceImpl implements ApartmentService {

    private final ApartmentRepository apartmentRepository;
    private final HouseholdRepository householdRepository;

    public ApartmentServiceImpl(ApartmentRepository apartmentRepository, HouseholdRepository householdRepository) {
        this.apartmentRepository = apartmentRepository;
        this.householdRepository = householdRepository;
    }

    @Override
    public ApartmentResponse create(ApartmentRequest request) {
        Apartment apartment = new Apartment();
        apartment.setName(request.getName());
        apartment.setAddress(request.getAddress());

        Apartment saved = apartmentRepository.save(apartment);
        return toResponse(saved);
    }

    @Override
    public List<ApartmentResponse> getAll() {
        return apartmentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ApartmentResponse> getAll(Pageable pageable) {

        return apartmentRepository
                .findAll(pageable)
                .map(this::toResponse);

    }

    @Override
    public ApartmentResponse getById(Long id) {
        Apartment apartment = apartmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apartment not found"));
        return toResponse(apartment);
    }

    @Override
    public Page<ApartmentResponse> search(
            String keyword,
            Pageable pageable) {

        return apartmentRepository
                .findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
                        keyword,
                        keyword,
                        pageable)
                .map(this::toResponse);

    }

    @Override
    public ApartmentResponse update(Long id, ApartmentRequest request) {
        Apartment apartment = apartmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apartment not found"));

        apartment.setName(request.getName());
        apartment.setAddress(request.getAddress());

        Apartment saved = apartmentRepository.save(apartment);
        return toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!apartmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Apartment not found");
        }
        apartmentRepository.deleteById(id);
    }

    private ApartmentResponse toResponse(Apartment apartment) {
        int householdCount =
            (int) householdRepository.countByApartmentId(apartment.getId());
        return new ApartmentResponse(
                apartment.getId(),
                apartment.getName(),
                apartment.getAddress(),
                householdCount
            );
    }
}
