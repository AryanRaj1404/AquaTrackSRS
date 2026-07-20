package com.aquatrack.aquatrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.TariffTierRequest;
import com.aquatrack.aquatrack.dto.TariffTierResponse;
import com.aquatrack.aquatrack.service.TariffTierService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tariff-tiers")
public class TariffTierController {

    private final TariffTierService tariffTierService;

    public TariffTierController(TariffTierService tariffTierService) {
        this.tariffTierService = tariffTierService;
    }

    @PostMapping
    public ResponseEntity<TariffTierResponse> create(
            @Valid @RequestBody TariffTierRequest request) {

        return ResponseEntity.ok(
                tariffTierService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<TariffTierResponse>> getAll() {

        return ResponseEntity.ok(
                tariffTierService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TariffTierResponse> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                tariffTierService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TariffTierResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody TariffTierRequest request) {

        return ResponseEntity.ok(
                tariffTierService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        tariffTierService.delete(id);

        return ResponseEntity.noContent().build();
    }
}