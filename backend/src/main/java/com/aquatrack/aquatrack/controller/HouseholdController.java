package com.aquatrack.aquatrack.controller;

import java.util.List;

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
import com.aquatrack.aquatrack.service.HouseholdService;

@RestController
@RequestMapping("/households")
public class HouseholdController {

    private final HouseholdService householdService;

    public HouseholdController(HouseholdService householdService) {
        this.householdService = householdService;
    }

    @PostMapping
    public HouseholdResponse create(@RequestBody HouseholdRequest request) {
        return householdService.create(request);
    }

    @GetMapping
    public List<HouseholdResponse> getAll() {
        return householdService.getAll();
    }

    @GetMapping("/{id}")
    public HouseholdResponse getById(@PathVariable Long id) {
        return householdService.getById(id);
    }

    @PutMapping("/{id}")
    public HouseholdResponse update(@PathVariable Long id, @RequestBody HouseholdRequest request) {
        return householdService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        householdService.delete(id);
        return "Household deleted successfully";
    }

    @PutMapping("/{householdId}/residents/{userId}")
    public HouseholdResponse assignResident(@PathVariable Long householdId, @PathVariable Long userId) {
        return householdService.assignResident(householdId, userId);
    }
}
