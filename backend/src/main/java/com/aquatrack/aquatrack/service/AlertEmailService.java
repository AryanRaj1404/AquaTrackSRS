package com.aquatrack.aquatrack.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.UsageAlert;
import com.aquatrack.aquatrack.entity.User;
import com.aquatrack.aquatrack.repository.UserRepository;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AlertEmailService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    public void sendAlertEmail(
            Household household,
            UsageAlert.AlertType type,
            String message,
            LocalDate alertDate) {

        List<User> residents =
                userRepository.findByHouseholdId(household.getId());

        String subject =
                type == UsageAlert.AlertType.ANOMALY_LEAK
                        ? "🚨 AquaTrack - Possible Water Leak Detected"
                        : "⚠ AquaTrack - Daily Water Usage Threshold Exceeded";

        String alertTitle =
                type == UsageAlert.AlertType.ANOMALY_LEAK
                        ? "Possible Leak Detected"
                        : "Threshold Exceeded";

        String alertColor =
                type == UsageAlert.AlertType.ANOMALY_LEAK
                        ? "#E53935"
                        : "#FB8C00";

        for (User user : residents) {

            if (user.getEmail() == null || user.getEmail().isBlank()) {
                continue;
            }

            try {

                MimeMessage mimeMessage =
                        mailSender.createMimeMessage();

                MimeMessageHelper helper =
                        new MimeMessageHelper(
                                mimeMessage,
                                true,
                                "UTF-8");

                helper.setFrom(
                        "aquatrack.platform@gmail.com",
                        "AquaTrack Team");

                helper.setTo(user.getEmail());

                helper.setSubject(subject);

                String html = """
                        <html>

                        <body style="
                        font-family:Arial,sans-serif;
                        background:#f5f7fb;
                        padding:30px;">

                        <div style="
                        max-width:650px;
                        margin:auto;
                        background:white;
                        padding:40px;
                        border-radius:12px;">

                        <h2 style="color:#2196F3;">
                        💧 AquaTrack Water Usage Alert
                        </h2>

                        <p>
                        Hi <b>%s</b>,
                        </p>

                        <p>
                        AquaTrack has detected an event that requires your attention.
                        Please review the alert details below.
                        </p>

                        <table style="border-collapse:collapse;">

                        <tr>
                        <td style="padding:6px 20px 6px 0;">
                        <b>Household</b>
                        </td>
                        <td>%s</td>
                        </tr>

                        <tr>
                        <td style="padding:6px 20px 6px 0;">
                        <b>Alert Type</b>
                        </td>
                        <td>
                        <span style="
                        color:white;
                        background:%s;
                        padding:4px 10px;
                        border-radius:20px;">
                        %s
                        </span>
                        </td>
                        </tr>

                        <tr>
                        <td style="padding:6px 20px 6px 0;">
                        <b>Date</b>
                        </td>
                        <td>%s</td>
                        </tr>

                        </table>

                        <br>

                        <div style="
                        background:#E3F2FD;
                        border-left:5px solid #2196F3;
                        padding:16px;
                        border-radius:8px;">

                        %s

                        </div>

                        <br>

                        <p>
                        Please inspect your household plumbing,
                        taps and storage tanks.
                        If the usage is expected,
                        no action is required.
                        </p>

                        <hr>

                        <p>
                        Thank you for helping conserve water.
                        </p>

                        <b>AquaTrack Team</b>

                        </div>

                        </body>
                        </html>
                        """.formatted(

                        user.getFirstName(),

                        household.getFlatNumber(),

                        alertColor,

                        alertTitle,

                        alertDate.format(
                                DateTimeFormatter.ofPattern("dd MMMM yyyy")),

                        message);

                helper.setText(html, true);

                mailSender.send(mimeMessage);

            } catch (Exception e) {

                System.err.println(
                        "Failed to send alert email to "
                                + user.getEmail()
                                + ": "
                                + e.getMessage());
            }
        }
    }
}