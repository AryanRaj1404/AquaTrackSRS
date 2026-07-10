package com.aquatrack.aquatrack.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.aquatrack.aquatrack.entity.User;
import com.aquatrack.aquatrack.enums.AuthProvider;
import com.aquatrack.aquatrack.enums.Role;
import com.aquatrack.aquatrack.repository.UserRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserRepository userRepository,
                            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (userRepository.findByUsername("admin").isPresent()) {
            return;
        }

        User admin = new User();

        admin.setFirstName("System");
        admin.setLastName("Administrator");
        admin.setUsername("admin");
        admin.setEmail("admin@aquatrack.com");
        admin.setMobileNumber("9999999999");

        admin.setPassword(passwordEncoder.encode("admin123"));

        admin.setRole(Role.ADMIN);
        admin.setProvider(AuthProvider.LOCAL);

        userRepository.save(admin);

        System.out.println("Default admin created.");
    }
}