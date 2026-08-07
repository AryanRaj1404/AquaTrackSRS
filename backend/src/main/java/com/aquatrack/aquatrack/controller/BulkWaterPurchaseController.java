package com.aquatrack.aquatrack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestHeader;

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
            @RequestHeader(
                value = "X-Workspace-Id",
                required = false
            ) Long apartmentId,
            @Validated @RequestBody BulkWaterPurchaseRequest request) {

        return ResponseEntity.ok(service.create(apartmentId, request));
    }

    @GetMapping
public ResponseEntity<Page<BulkWaterPurchaseResponse>> getAll(

        @RequestHeader(
            value = "X-Workspace-Id",
            required = false
        ) Long apartmentId,

        @RequestParam(defaultValue = "0")
        int page,

        @RequestParam(defaultValue = "20")
        int size

) {

    return ResponseEntity.ok(

            service.getAll(

                    apartmentId,

                    page,

                    size

            )

    );

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
            @RequestHeader(
                value = "X-Workspace-Id",
                required = false
            ) Long apartmentId,
            @PathVariable Long id,
            @Validated @RequestBody BulkWaterPurchaseRequest request) {

        return ResponseEntity.ok(
                service.update(apartmentId, id, request));
    }
}