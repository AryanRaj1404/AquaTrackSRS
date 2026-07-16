package com.aquatrack.aquatrack.service;

import com.aquatrack.aquatrack.entity.Invoice;

public interface EmailService {
    void sendWelcomeEmail(String recipientEmail, String firstName);

    void sendInvoiceEmail(
            String recipientEmail,
            String firstName,
            Invoice invoice,
            byte[] pdfBytes);
}
