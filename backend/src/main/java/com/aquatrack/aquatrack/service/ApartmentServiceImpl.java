package com.aquatrack.aquatrack.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.ApartmentRequest;
import com.aquatrack.aquatrack.dto.ApartmentResponse;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.User;
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
    public ApartmentResponse getById(Long id) {
        Apartment apartment = apartmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apartment not found"));
        return toResponse(apartment);
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

        List<Household> households = householdRepository.findByApartmentId(id);
        for (Household household : households) {
            List<User> residents = userRepository.findByHouseholdId(household.getId());
            for (User resident : residents) {
                resident.setHousehold(null);
            }
            userRepository.saveAll(residents);
        }

        apartmentRepository.deleteById(id);
    }

    private ApartmentResponse toResponse(Apartment apartment) {
        return new ApartmentResponse(
                apartment.getId(),
                apartment.getName(),
                apartment.getAddress());
    }
}
