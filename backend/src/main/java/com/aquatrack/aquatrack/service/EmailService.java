package com.aquatrack.aquatrack.service;

public interface EmailService {
    void sendWelcomeEmail(String recipientEmail, String firstName);
}
