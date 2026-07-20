package com.aquatrack.aquatrack.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.entity.Invoice;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendWelcomeEmail(String recipientEmail, String firstName) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("aquatrack.platform@gmail.com", "AquaTrack Team");

            helper.setTo(recipientEmail);

            helper.setSubject("🌊 Welcome to AquaTrack!");

            String html = """
                    <html>
                    <body style="font-family:Arial,sans-serif;background:#f5f7fb;padding:30px;">
                    
                    <div style="max-width:600px;margin:auto;background:white;padding:40px;border-radius:12px;">
                    
                    <h1 style="color:#2196F3;">
                    Welcome to AquaTrack!
                    </h1>

                    <p>Hi <b>%s</b>,</p>

                    <p>
                    Thank you for registering with AquaTrack.
                    </p>

                    <p>
                    We're excited to help you monitor your water usage,
                    save water and simplify billing.
                    </p>

                    <hr>

                    <p>
                    Happy Saving 💧
                    </p>

                    <b>AquaTrack Team</b>

                    </div>

                    </body>
                    </html>
                    """.formatted(firstName);

            helper.setText(html, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Unable to send welcome email", e);
        }
    }

    @Override
    public void sendInvoiceEmail(
            String recipientEmail,
            String firstName,
            Invoice invoice,
            byte[] pdfBytes) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(
                    "aquatrack.platform@gmail.com",
                    "AquaTrack Team");

            helper.setTo(recipientEmail);

            helper.setSubject(
                    "💧 Water Bill - "
                            + invoice.getBillingCycle()
                            .getStartDate()
                            .format(java.time.format.DateTimeFormatter.ofPattern("MMMM yyyy")));

            String html = """
                    <html>
                    <body style="font-family:Arial;background:#f5f7fb;padding:30px;">

                    <div style="max-width:650px;margin:auto;background:white;
                    padding:40px;border-radius:12px;">

                    <h2 style="color:#2196F3;">
                    AquaTrack Water Bill
                    </h2>

                    <p>Hi <b>%s</b>,</p>

                    <p>
                    Your water bill has been generated.
                    Please find the attached invoice.
                    </p>

                    <table style="border-collapse:collapse;">

                    <tr>
                    <td><b>Invoice Number</b></td>
                    <td>%s</td>
                    </tr>

                    <tr>
                    <td><b>Billing Period</b></td>
                    <td>%s</td>
                    </tr>

                    <tr>
                    <td><b>Amount Payable</b></td>
                    <td>₹ %.2f</td>
                    </tr>

                    </table>

                    <br>

                    <p>
                    Thank you for using AquaTrack.
                    </p>

                    <b>AquaTrack Team</b>

                    </div>

                    </body>
                    </html>
                    """.formatted(

                    firstName,

                    invoice.getInvoiceNumber(),

                    invoice.getBillingCycle()
                            .getStartDate()
                            .format(java.time.format.DateTimeFormatter.ofPattern("MMMM yyyy")),

                    invoice.getTotalAmount());

            helper.setText(html, true);

            helper.addAttachment(
                    invoice.getInvoiceNumber() + ".pdf",
                    new org.springframework.core.io.ByteArrayResource(pdfBytes));

            mailSender.send(message);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to send invoice email", e);
        }
    }
}