package com.aquatrack.aquatrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aquatrack.aquatrack.dto.InvoiceResponse;
import com.aquatrack.aquatrack.service.InvoiceService;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    // Generate invoices for a billing cycle
    @PostMapping("/generate/{billingCycleId}")
    public ResponseEntity<String> generateInvoices(
            @PathVariable Long billingCycleId) {

        invoiceService.generateInvoices(billingCycleId);

        return ResponseEntity.ok("Invoices generated successfully.");
    }

    // Get every invoice
    @GetMapping
    public ResponseEntity<List<InvoiceResponse>> getAll() {

        return ResponseEntity.ok(
                invoiceService.getAll());
    }

    // Get invoice by Invoice ID
    @GetMapping("/{invoiceId}")
    public ResponseEntity<InvoiceResponse> getById(
            @PathVariable Long invoiceId) {

        return ResponseEntity.ok(
                invoiceService.getById(invoiceId));
    }

    // Get invoices of a billing cycle
    @GetMapping("/billing-cycle/{billingCycleId}")
    public ResponseEntity<List<InvoiceResponse>> getByBillingCycle(
            @PathVariable Long billingCycleId) {

        return ResponseEntity.ok(
                invoiceService.getInvoices(billingCycleId));
    }

    // Get invoices of a household
    @GetMapping("/household/{householdId}")
    public ResponseEntity<List<InvoiceResponse>> getByHousehold(
            @PathVariable Long householdId) {

        return ResponseEntity.ok(
                invoiceService.getByHousehold(householdId));
    }

    // Mark invoice as paid
    @PatchMapping("/{invoiceId}/paid")
    public ResponseEntity<String> markAsPaid(
            @PathVariable Long invoiceId) {

        invoiceService.markAsPaid(invoiceId);

        return ResponseEntity.ok("Invoice marked as PAID.");
    }
}