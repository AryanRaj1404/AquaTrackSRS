package com.aquatrack.aquatrack.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

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
}