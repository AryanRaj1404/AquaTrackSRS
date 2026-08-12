package com.aquatrack.aquatrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.aquatrack.aquatrack.dto.RequestHouseholdRequest;
import com.aquatrack.aquatrack.entity.HouseholdJoinRequest;
import com.aquatrack.aquatrack.service.HouseholdJoinRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/household-requests")
public class HouseholdJoinRequestController {

    private final HouseholdJoinRequestService service;

    public HouseholdJoinRequestController(
            HouseholdJoinRequestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> submitRequest(
            Authentication authentication,
            @Valid @RequestBody RequestHouseholdRequest request) {

        service.submitRequest(authentication.getName(), request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public HouseholdJoinRequest getMyPendingRequest(
            Authentication authentication) {

        return service.getMyPendingRequest(authentication.getName());
    }

    @DeleteMapping("/cancel")
    public ResponseEntity<Void> cancelRequest(
            Authentication authentication) {

        service.cancelRequest(authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pending")
    public List<HouseholdJoinRequest> getPendingRequests() {
        return service.getPendingRequests();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Void> approve(
            @PathVariable Long id,
            Authentication authentication) {

        service.approveRequest(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Void> reject(
            @PathVariable Long id,
            Authentication authentication,
            @RequestParam(required = false) String remarks) {

        service.rejectRequest(id, authentication.getName(), remarks);
        return ResponseEntity.ok().build();
    }
}