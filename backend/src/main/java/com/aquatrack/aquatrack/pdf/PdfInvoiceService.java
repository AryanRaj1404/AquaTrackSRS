package com.aquatrack.aquatrack.pdf;

public interface PdfInvoiceService {

    byte[] generateInvoice(Long invoiceId);

}