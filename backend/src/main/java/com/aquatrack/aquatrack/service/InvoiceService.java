package com.aquatrack.aquatrack.service;

import java.util.List;

import com.aquatrack.aquatrack.dto.InvoiceResponse;

public interface InvoiceService {

    void generateInvoices(Long billingCycleId);

    List<InvoiceResponse> getAll();

    InvoiceResponse getById(Long invoiceId);

    List<InvoiceResponse> getInvoices(Long billingCycleId);

    List<InvoiceResponse> getByHousehold(Long householdId);

    void markAsPaid(Long invoiceId);

}