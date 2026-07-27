package com.aquatrack.aquatrack.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.HouseholdRequest;
import com.aquatrack.aquatrack.dto.HouseholdResponse;
import com.aquatrack.aquatrack.dto.ResidentResponse;
import com.aquatrack.aquatrack.service.HouseholdService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/households")
public class HouseholdController {

    private final HouseholdService householdService;

    public HouseholdController(HouseholdService householdService) {
        this.householdService = householdService;
    }

    @PostMapping
    public HouseholdResponse create(@Valid @RequestBody HouseholdRequest request) {
        return householdService.create(request);
    }

    @GetMapping
    public Page<HouseholdResponse> getAll(Pageable pageable) {

        return householdService.getAll(pageable);

    }

    @GetMapping("/unassigned-residents")
    public List<ResidentResponse> getUnassignedResidents() {
        return householdService.getUnassignedResidents();
    }

    @GetMapping("/{id}")
    public HouseholdResponse getById(@PathVariable Long id) {
        return householdService.getById(id);
    }

    @PutMapping("/{id}")
    public HouseholdResponse update(@PathVariable Long id,@Valid @RequestBody HouseholdRequest request) {
        return householdService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        householdService.delete(id);
        return ResponseEntity.ok("Household deleted successfully");
    }

    @PutMapping("/{householdId}/residents/{userId}")
    public HouseholdResponse assignResident(@PathVariable Long householdId, @PathVariable Long userId) {
        return householdService.assignResident(householdId, userId);
    }
    @DeleteMapping("/{householdId}/residents/{userId}")
    public HouseholdResponse removeResident(@PathVariable Long householdId,
                                            @PathVariable Long userId) {
        return householdService.removeResident(householdId, userId);
    }
    @GetMapping("/apartment/{apartmentId}")
    public List<HouseholdResponse> getByApartment(
            @PathVariable Long apartmentId) {

        return householdService.getByApartment(apartmentId);
    }
}
