package com.aquatrack.aquatrack.service;

import java.util.List;

import com.aquatrack.aquatrack.dto.RequestHouseholdRequest;
import com.aquatrack.aquatrack.entity.HouseholdJoinRequest;

public interface HouseholdJoinRequestService {

    void submitRequest(
            String username,
            RequestHouseholdRequest request
    );

    HouseholdJoinRequest getMyPendingRequest(
            String username
    );

    void cancelRequest(
            String username
    );

    List<HouseholdJoinRequest> getPendingRequests();

    void approveRequest(
            Long requestId,
            String adminUsername
    );

    void rejectRequest(
            Long requestId,
            String adminUsername,
            String remarks
    );
}