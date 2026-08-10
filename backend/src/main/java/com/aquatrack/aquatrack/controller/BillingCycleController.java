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
import org.springframework.web.bind.annotation.RequestHeader;

import com.aquatrack.aquatrack.dto.BillingCycleRequest;
import com.aquatrack.aquatrack.dto.BillingCycleResponse;
import com.aquatrack.aquatrack.service.BillingCycleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/billing-cycles")
public class BillingCycleController {

    private final BillingCycleService billingCycleService;

    public BillingCycleController(BillingCycleService billingCycleService) {
        this.billingCycleService = billingCycleService;
    }

    @PostMapping
    public BillingCycleResponse create(@Valid @RequestBody BillingCycleRequest request) {
        return billingCycleService.create(request);
    }

    @GetMapping
    public List<BillingCycleResponse> getAll(
        @RequestHeader(
            value = "X-Workspace-Id",
            required = false
        ) Long apartmentId
    ) {
        return billingCycleService.getAll(apartmentId);
    }

    @GetMapping("/{id}")
    public BillingCycleResponse getById(@PathVariable Long id) {
        return billingCycleService.getById(id);
    }

    @GetMapping("/apartment/{apartmentId}")
    public List<BillingCycleResponse> getByApartmentId(@PathVariable Long apartmentId) {
        return billingCycleService.getByApartmentId(apartmentId);
    }

    @PutMapping("/{id}")
    public BillingCycleResponse update(@PathVariable Long id,
                                       @Valid @RequestBody BillingCycleRequest request) {
        return billingCycleService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        billingCycleService.delete(id);
        return "Billing cycle deleted successfully";
    }
}