package com.aquatrack.aquatrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.BulkWaterPurchaseRequest;
import com.aquatrack.aquatrack.dto.BulkWaterPurchaseResponse;
import com.aquatrack.aquatrack.service.BulkWaterPurchaseService;

@RestController
@RequestMapping("/bulk-water-purchases")
public class BulkWaterPurchaseController {

    private final BulkWaterPurchaseService service;

    public BulkWaterPurchaseController(BulkWaterPurchaseService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<BulkWaterPurchaseResponse> create(
            @Validated @RequestBody BulkWaterPurchaseRequest request) {

        return ResponseEntity.ok(service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<BulkWaterPurchaseResponse>> getAll() {

        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BulkWaterPurchaseResponse> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(service.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok("Bulk water purchase deleted successfully");
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BulkWaterPurchaseResponse> update(
            @PathVariable Long id,
            @Validated @RequestBody BulkWaterPurchaseRequest request) {

        return ResponseEntity.ok(
                service.update(id, request));
    }
}