package com.aquatrack.aquatrack.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aquatrack.aquatrack.dto.HouseholdRequest;
import com.aquatrack.aquatrack.dto.HouseholdResponse;
import com.aquatrack.aquatrack.dto.ResidentResponse;
import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.User;
import com.aquatrack.aquatrack.enums.Role;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.UserRepository;

@Service
public class HouseholdServiceImpl implements HouseholdService {

    private final HouseholdRepository householdRepository;
    private final ApartmentRepository apartmentRepository;
    private final UserRepository userRepository;

    public HouseholdServiceImpl(HouseholdRepository householdRepository,
            ApartmentRepository apartmentRepository,
            UserRepository userRepository) {
        this.householdRepository = householdRepository;
        this.apartmentRepository = apartmentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public HouseholdResponse create(HouseholdRequest request) {

        Apartment apartment = apartmentRepository.findById(request.getApartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Apartment not found"));

        if (householdRepository.existsByApartmentIdAndFlatNumber(
                request.getApartmentId(),
                request.getFlatNumber())) {

            throw new IllegalArgumentException(
                    "Flat number already exists in this apartment.");
        }

        Household household = new Household();
        household.setFlatNumber(request.getFlatNumber());
        household.setFlatSize(request.getFlatSize());
        household.setOccupancy(request.getOccupancy());
        household.setApartment(apartment);

        Household saved = householdRepository.save(household);

        return toResponse(saved);
    }

    @Override
    public List<HouseholdResponse> getAll() {
        return householdRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<HouseholdResponse> getAll(Pageable pageable) {
        return householdRepository
                .findAll(pageable)
                .map(this::toResponse);

        }


    @Override
    public HouseholdResponse getById(Long id) {
        Household household = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
        return toResponse(household);
    }

    @Override
    public HouseholdResponse update(Long id, HouseholdRequest request) {
        Household household = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        Apartment apartment = apartmentRepository.findById(request.getApartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Apartment not found"));

        if (householdRepository.existsByApartmentIdAndFlatNumberAndIdNot(
                request.getApartmentId(),
                request.getFlatNumber(),
                id)) {

            throw new IllegalArgumentException(
                    "Flat number already exists in this apartment.");
        }

        household.setFlatNumber(request.getFlatNumber());
        household.setFlatSize(request.getFlatSize());
        household.setOccupancy(request.getOccupancy());
        household.setApartment(apartment);

        Household saved = householdRepository.save(household);
        return toResponse(saved);
    }

    @Override
    public List<HouseholdResponse> getByApartment(Long apartmentId) {
        return householdRepository
                .findByApartmentId(apartmentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        }

    @Transactional
    @Override
    public void delete(Long id) {

        if (!householdRepository.existsById(id)) {
            throw new ResourceNotFoundException("Household not found");
        }

        List<User> residents = userRepository.findByHouseholdId(id);

        for (User resident : residents) {
            resident.setHousehold(null);
        }

        userRepository.saveAll(residents);

        householdRepository.deleteById(id);
    }

    @Override
    public HouseholdResponse assignResident(Long householdId, Long userId) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.RESIDENT) {
            throw new IllegalArgumentException("Only residents can be assigned to households.");
        }

        if (user.getHousehold() != null) {
            throw new IllegalArgumentException("Resident is already assigned to a household.");
        }

        user.setHousehold(household);
        userRepository.save(user);

        return toResponse(household);
    }

    @Override
    public HouseholdResponse removeResident(Long householdId, Long userId) {

        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getHousehold() == null ||
                !user.getHousehold().getId().equals(household.getId())) {

            throw new IllegalArgumentException(
                    "Resident is not assigned to this household.");
        }

        user.setHousehold(null);

        userRepository.save(user);

        return toResponse(household);
    }

    @Override
    public List<ResidentResponse> getUnassignedResidents() {

        return userRepository
                .findByRoleAndHouseholdIsNull(Role.RESIDENT)
                .stream()
                .map(user -> new ResidentResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getFirstName() + " " + user.getLastName()
                ))
                .collect(Collectors.toList());
    }

    private HouseholdResponse toResponse(Household household) {

    User resident = userRepository
            .findFirstByHouseholdId(household.getId())
            .orElse(null);

    return new HouseholdResponse(
            household.getId(),
            household.getFlatNumber(),
            household.getFlatSize(),
            household.getOccupancy(),
            household.getApartment() != null ? household.getApartment().getId() : null,
            household.getApartment() != null ? household.getApartment().getName() : null,

            resident != null ? resident.getId() : null,
            resident != null ? resident.getUsername() : null,
            resident != null
                    ? resident.getFirstName() + " " + resident.getLastName()
                    : null
    );
}
}
