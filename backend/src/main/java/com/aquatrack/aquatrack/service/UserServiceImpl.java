package com.aquatrack.aquatrack.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.AuthResponse;
import com.aquatrack.aquatrack.dto.LoginRequest;
import com.aquatrack.aquatrack.dto.RegisterRequest;
import com.aquatrack.aquatrack.entity.Role;
import com.aquatrack.aquatrack.entity.User;
import com.aquatrack.aquatrack.repository.UserRepository;
import com.aquatrack.aquatrack.security.JwtService;

import com.aquatrack.aquatrack.dto.ProfileResponse;
import com.aquatrack.aquatrack.dto.ProfileUpdateRequest;

@Service
public class UserServiceImpl implements UserService{

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.security.admin-invite-code}")
    private String adminInviteCode;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public void register(RegisterRequest request){
        if(userRepository.findByUsername(request.getUsername()).isPresent()){
            throw new RuntimeException("Username already Exists");
        }

        Role userRole = Role.RESIDENT;
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                userRole = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role. Must be ADMIN or RESIDENT");
            }
        }

        if (userRole == Role.ADMIN) {
            if (request.getAdminInviteCode() == null
                    || !request.getAdminInviteCode().equals(adminInviteCode)) {
                throw new RuntimeException("Invalid or missing admin invite code");
            }
        }

        if (userRole == Role.RESIDENT) {
            if (request.getFirstName() == null || request.getFirstName().isBlank()) {
                throw new RuntimeException("First name is required for residents");
            }
            if (request.getLastName() == null || request.getLastName().isBlank()) {
                throw new RuntimeException("Last name is required for residents");
            }
            if (request.getEmail() == null || request.getEmail().isBlank()) {
                throw new RuntimeException("Email is required for residents");
            }
            if (request.getPhoneNumber() == null || request.getPhoneNumber().isBlank()) {
                throw new RuntimeException("Phone number is required for residents");
            }
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()
                && userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already Exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());

        userRepository.save(user);
    }

    @Override
    public ProfileResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new ProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getRole().name(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getHousehold() != null ? user.getHousehold().getId() : null,
                user.getHousehold() != null ? user.getHousehold().getFlatNumber() : null
        );
    }

    @Override
    public ProfileResponse updateProfile(String username, ProfileUpdateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(request.getUsername())) {
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new RuntimeException("Username already exists");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()
                && !request.getEmail().equals(user.getEmail())
                && userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());

        User saved = userRepository.save(user);
        return new ProfileResponse(
                saved.getId(),
                saved.getUsername(),
                saved.getRole().name(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getEmail(),
                saved.getPhoneNumber(),
                saved.getHousehold() != null ? saved.getHousehold().getId() : null,
                saved.getHousehold() != null ? saved.getHousehold().getFlatNumber() : null
        );
    }

    @Override
    public AuthResponse login(LoginRequest request){
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(token);
    }
}
