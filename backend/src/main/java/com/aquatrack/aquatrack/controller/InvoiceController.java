package com.aquatrack.aquatrack.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.BulkInvoiceEmailResponse;
import com.aquatrack.aquatrack.dto.InvoiceResponse;
import com.aquatrack.aquatrack.pdf.PdfInvoiceService;
import com.aquatrack.aquatrack.service.InvoiceService;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final PdfInvoiceService pdfInvoiceService;

    public InvoiceController(
            InvoiceService invoiceService,
            PdfInvoiceService pdfInvoiceService) {

        this.invoiceService = invoiceService;
        this.pdfInvoiceService = pdfInvoiceService;
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

    @PostMapping("/{invoiceId}/email")
        public ResponseEntity<String> emailInvoice(
                @PathVariable Long invoiceId) {

        invoiceService.emailInvoice(invoiceId);

        return ResponseEntity.ok(
                "Invoice emailed successfully.");
        }

        // Email all invoices of a billing cycle
        @PostMapping("/billing-cycle/{billingCycleId}/email")
        public ResponseEntity<BulkInvoiceEmailResponse> emailInvoices(
                @PathVariable Long billingCycleId) {

        return ResponseEntity.ok(
                invoiceService.emailInvoices(billingCycleId));
        }

    // Download invoice as PDF
    @GetMapping("/{invoiceId}/pdf")
    public ResponseEntity<byte[]> downloadInvoicePdf(
            @PathVariable Long invoiceId) {

        byte[] pdf = pdfInvoiceService.generateInvoice(invoiceId);

        String invoiceNumber = invoiceService
                .getById(invoiceId)
                .getInvoiceNumber();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + invoiceNumber + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}