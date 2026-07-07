package com.aquatrack.aquatrack.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.HouseholdRequest;
import com.aquatrack.aquatrack.dto.HouseholdResponse;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.User;
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

        Household household = new Household();
        household.setFlatNumber(request.getFlatNumber());
        household.setFlatSize(request.getFlatSize());
        household.setOccupancy(request.getOccupancy());
        household.setApartment(apartment);
        household.setMeterSerialNumber(request.getMeterSerialNumber());
        household.setMeterStatus(request.getMeterStatus());

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

        household.setFlatNumber(request.getFlatNumber());
        household.setFlatSize(request.getFlatSize());
        household.setOccupancy(request.getOccupancy());
        household.setApartment(apartment);
        household.setMeterSerialNumber(request.getMeterSerialNumber());
        household.setMeterStatus(request.getMeterStatus());

        Household saved = householdRepository.save(household);
        return toResponse(saved);
    }

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

        user.setHousehold(household);
        userRepository.save(user);

        return toResponse(household);
    }

    @Override
    public HouseholdResponse configureMeter(Long id, String meterSerialNumber, String meterStatus) {
        Household household = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        household.setMeterSerialNumber(meterSerialNumber);
        household.setMeterStatus(meterStatus);

        Household saved = householdRepository.save(household);
        return toResponse(saved);
    }

    private HouseholdResponse toResponse(Household household) {
        return new HouseholdResponse(
                household.getId(),
                household.getFlatNumber(),
                household.getFlatSize(),
                household.getOccupancy(),
                household.getApartment() != null ? household.getApartment().getId() : null,
                household.getApartment() != null ? household.getApartment().getName() : null,
                household.getMeterSerialNumber(),
                household.getMeterStatus());
    }
}
