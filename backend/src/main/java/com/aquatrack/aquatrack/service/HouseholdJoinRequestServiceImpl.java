package com.aquatrack.aquatrack.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aquatrack.aquatrack.dto.RequestHouseholdRequest;
import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.HouseholdJoinRequest;
import com.aquatrack.aquatrack.entity.User;
import com.aquatrack.aquatrack.enums.HouseholdJoinRequestStatus;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.HouseholdJoinRequestRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.UserRepository;

@Service
@Transactional
public class HouseholdJoinRequestServiceImpl
        implements HouseholdJoinRequestService {

    private final HouseholdJoinRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final ApartmentRepository apartmentRepository;
    private final HouseholdRepository householdRepository;

    public HouseholdJoinRequestServiceImpl(
            HouseholdJoinRequestRepository requestRepository,
            UserRepository userRepository,
            ApartmentRepository apartmentRepository,
            HouseholdRepository householdRepository) {

        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.apartmentRepository = apartmentRepository;
        this.householdRepository = householdRepository;
    }

    @Override
    public void submitRequest(
            String username,
            RequestHouseholdRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (user.getHousehold() != null) {
            throw new IllegalStateException("User already belongs to a household.");
        }

        if (requestRepository.existsByUserAndStatus(
                user,
                HouseholdJoinRequestStatus.PENDING)) {
            throw new IllegalStateException("You already have a pending request.");
        }

        Apartment apartment = apartmentRepository.findById(request.getApartmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Apartment not found"));

        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Household not found"));

        if (!household.getApartment().getId().equals(apartment.getId())) {
            throw new IllegalArgumentException(
                    "Selected household does not belong to the selected apartment.");
        }

        HouseholdJoinRequest joinRequest = new HouseholdJoinRequest();
        joinRequest.setUser(user);
        joinRequest.setApartment(apartment);
        joinRequest.setHousehold(household);
        joinRequest.setStatus(HouseholdJoinRequestStatus.PENDING);
        joinRequest.setRequestedAt(LocalDateTime.now());

        requestRepository.save(joinRequest);
    }

    @Override
    public HouseholdJoinRequest getMyPendingRequest(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return requestRepository.findByUserAndStatus(
                user,
                HouseholdJoinRequestStatus.PENDING
        ).orElse(null);
    }

    @Override
    public void cancelRequest(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        HouseholdJoinRequest request = requestRepository
                .findByUserAndStatus(
                        user,
                        HouseholdJoinRequestStatus.PENDING)
                .orElseThrow(() ->
                        new ResourceNotFoundException("No pending request found."));

        requestRepository.delete(request);
    }

    @Override
    public List<HouseholdJoinRequest> getPendingRequests() {
        return requestRepository.findByStatus(
                HouseholdJoinRequestStatus.PENDING);
    }

    @Override
    public void approveRequest(
            Long requestId,
            String adminUsername) {

        HouseholdJoinRequest request = requestRepository.findById(requestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Request not found"));

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Admin not found"));

        User resident = request.getUser();

        resident.setHousehold(request.getHousehold());
        userRepository.save(resident);

        request.setStatus(HouseholdJoinRequestStatus.APPROVED);
        request.setReviewedAt(LocalDateTime.now());
        request.setReviewedBy(admin);

        requestRepository.save(request);
    }

    @Override
    public void rejectRequest(
            Long requestId,
            String adminUsername,
            String remarks) {

        HouseholdJoinRequest request = requestRepository.findById(requestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Request not found"));

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Admin not found"));

        request.setStatus(HouseholdJoinRequestStatus.REJECTED);
        request.setReviewedAt(LocalDateTime.now());
        request.setReviewedBy(admin);
        request.setRemarks(remarks);

        requestRepository.save(request);
    }
}