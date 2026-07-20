package com.aquatrack.aquatrack.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BulkInvoiceEmailResponse {

    private int totalInvoices;

    private int emailsSent;

    private int failed;

    private List<FailedInvoiceResponse> failures;
}