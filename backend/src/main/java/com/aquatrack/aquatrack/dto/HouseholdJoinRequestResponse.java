package com.aquatrack.aquatrack.dto;

import java.time.LocalDateTime;

import com.aquatrack.aquatrack.entity.HouseholdJoinRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdJoinRequestResponse {

    private Long id;

    private String residentName;

    private String residentEmail;

    private Long apartmentId;

    private String apartmentName;

    private Long householdId;

    private String flatNumber;

    private String status;

    private LocalDateTime requestedAt;

    private LocalDateTime reviewedAt;

    private String reviewedBy;

    private String remarks;

    public static HouseholdJoinRequestResponse fromEntity(
            HouseholdJoinRequest request) {

        HouseholdJoinRequestResponse response =
                new HouseholdJoinRequestResponse();

        response.setId(request.getId());

        response.setResidentName(
                request.getUser().getFirstName()
                        + " "
                        + request.getUser().getLastName());

        response.setResidentEmail(
                request.getUser().getEmail());

        response.setApartmentId(
                request.getApartment().getId());

        response.setApartmentName(
                request.getApartment().getName());

        response.setHouseholdId(
                request.getHousehold().getId());

        response.setFlatNumber(
                request.getHousehold().getFlatNumber());

        response.setStatus(
                request.getStatus().name());

        response.setRequestedAt(
                request.getRequestedAt());

        response.setReviewedAt(
                request.getReviewedAt());

        response.setRemarks(
                request.getRemarks());

        if (request.getReviewedBy() != null) {
            response.setReviewedBy(
                    request.getReviewedBy().getFirstName()
                            + " "
                            + request.getReviewedBy().getLastName());
        }

        return response;
    }
}