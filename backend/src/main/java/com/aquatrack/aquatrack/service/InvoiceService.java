package com.aquatrack.aquatrack.service;

import java.util.List;

import com.aquatrack.aquatrack.dto.BulkInvoiceEmailResponse;
import com.aquatrack.aquatrack.dto.InvoiceResponse;

public interface InvoiceService {

    void generateInvoices(Long billingCycleId);

    List<InvoiceResponse> getAll(Long apartmentId);

    InvoiceResponse getById(Long invoiceId);

    List<InvoiceResponse> getInvoices(Long billingCycleId, Long apartmentId);

    List<InvoiceResponse> getByHousehold(Long householdId);

    void markAsPaid(Long invoiceId);

    void emailInvoice(Long invoiceId);

    BulkInvoiceEmailResponse emailInvoices(
        Long billingCycleId);

}