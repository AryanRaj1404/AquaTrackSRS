package com.aquatrack.aquatrack.service;

import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.User;
import com.aquatrack.aquatrack.entity.UsageAlert;
import com.aquatrack.aquatrack.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertEmailService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    public AlertEmailService(JavaMailSender mailSender, UserRepository userRepository) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }

    public void sendAlertEmail(Household household, UsageAlert.AlertType type, String message) {
        List<User> residents = userRepository.findByHouseholdId(household.getId());

        String subject = type == UsageAlert.AlertType.ANOMALY_LEAK
                ? "AquaTrack: Possible leak detected"
                : "AquaTrack: Daily water usage threshold exceeded";

        for (User user : residents) {
            if (user.getEmail() == null || user.getEmail().isBlank()) continue;
            try {
                SimpleMailMessage mail = new SimpleMailMessage();
                mail.setTo(user.getEmail());
                mail.setSubject(subject);
                mail.setText(message + "\n\nHousehold: " + household.getFlatNumber() + "\n\n— AquaTrack Alerts");
                mailSender.send(mail);
            } catch (Exception e) {
                System.err.println("Failed to send alert email to " + user.getEmail() + ": " + e.getMessage());
            }
        }
    }
}