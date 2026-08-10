package com.aquatrack.aquatrack.service;

import java.util.List;

import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aquatrack.aquatrack.dto.ApartmentOverviewResponse;
import com.aquatrack.aquatrack.dto.ApartmentRequest;
import com.aquatrack.aquatrack.dto.ApartmentResponse;
import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.UserRepository;

@Service
public class ApartmentServiceImpl implements ApartmentService {

    private final ApartmentRepository apartmentRepository;
    private final HouseholdRepository householdRepository;
    private final UserRepository userRepository;

    public ApartmentServiceImpl(ApartmentRepository apartmentRepository, 
        HouseholdRepository householdRepository,
        UserRepository userRepository) {
        this.apartmentRepository = apartmentRepository;
        this.householdRepository = householdRepository;
        this.userRepository = userRepository;
    }

    @Override
public ApartmentOverviewResponse getOverview(Long apartmentId) {

    Apartment apartment = apartmentRepository.findById(apartmentId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Apartment not found"));

    long householdCount =
            householdRepository.countByApartmentId(apartmentId);

    long occupied =
            userRepository.countOccupiedHouseholds(apartmentId);

    long vacant = householdCount - occupied;

    long residents =
            userRepository.countResidentsByApartment(apartmentId);

    double avgOccupancy =
            householdCount == 0
                    ? 0
                    : (double) residents / householdCount;

    return new ApartmentOverviewResponse(
            apartment.getId(),
            apartment.getName(),
            apartment.getAddress(),
            householdCount,
            residents,
            occupied,
            vacant,
            Math.round(avgOccupancy * 100.0) / 100.0
    );
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
                .toList();
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
