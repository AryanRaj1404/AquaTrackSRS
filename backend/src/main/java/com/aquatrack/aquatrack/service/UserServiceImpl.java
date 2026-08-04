package com.aquatrack.aquatrack.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.AuthResponse;
import com.aquatrack.aquatrack.dto.GoogleAuthRequest;
import com.aquatrack.aquatrack.dto.LoginRequest;
import com.aquatrack.aquatrack.dto.ProfileResponse;
import com.aquatrack.aquatrack.dto.RegisterRequest;
import com.aquatrack.aquatrack.dto.UpdateProfileRequest;
import com.aquatrack.aquatrack.entity.User;
import com.aquatrack.aquatrack.enums.AuthProvider;
import com.aquatrack.aquatrack.enums.Role;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.UserRepository;
import com.aquatrack.aquatrack.security.JwtService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;

@Service
public class UserServiceImpl implements UserService{

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final GoogleIdTokenVerifier googleIdTokenVerifier;
    private final EmailService emailService;

    public UserServiceImpl(UserRepository userRepository,
         PasswordEncoder passwordEncoder, 
         JwtService jwtService,
         GoogleIdTokenVerifier googleIdTokenVerifier,
        EmailService emailService
        ){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleIdTokenVerifier = googleIdTokenVerifier;
        this.emailService = emailService;
    }

    @Override
    public void register(RegisterRequest request){
        
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.findByMobileNumber(request.getMobileNumber()).isPresent()) {
            throw new RuntimeException("Mobile number already exists");
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());

        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        user.setRole(Role.RESIDENT);
        user.setProvider(AuthProvider.LOCAL);

        User savedUser = userRepository.save(user);

        emailService.sendWelcomeEmail(
            savedUser.getEmail(),
            savedUser.getFirstName()
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

    @Override
    public AuthResponse googleLogin(GoogleAuthRequest request) {

        try {

            GoogleIdToken idToken = googleIdTokenVerifier.verify(request.getIdToken());

            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");

            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {

                user = new User();

                user.setEmail(email);
                user.setFirstName(firstName);
                user.setLastName(lastName);

                user.setUsername(email);

                user.setRole(Role.RESIDENT);
                user.setProvider(AuthProvider.GOOGLE);

                User savedUser = userRepository.save(user);

                emailService.sendWelcomeEmail(
                    savedUser.getEmail(),
                    savedUser.getFirstName()
                );
            }

            String token = jwtService.generateToken(user);

            return new AuthResponse(token);

        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed", e);
        }
    }
    @Override
    public ProfileResponse getProfile(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                return new ProfileResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getMobileNumber(),
                user.getUsername(),
                user.getRole().name(),
                user.getProvider().name(),

                user.getHousehold() != null
                        ? user.getHousehold().getApartment().getName()
                        : null,

                user.getHousehold() != null
                        ? user.getHousehold().getFlatNumber()
                        : null,
                user.getHousehold() != null
                    ? user.getHousehold().getFlatSize()
                    : null,

                user.getHousehold() != null
                    ? user.getHousehold().getOccupancy()
                    : null
        );
    }
    @Override
    public ProfileResponse updateProfile(
            String username,
            UpdateProfileRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getMobileNumber() != null
                && !request.getMobileNumber().equals(user.getMobileNumber())
                && userRepository.findByMobileNumber(request.getMobileNumber()).isPresent()) {

            throw new IllegalArgumentException("Mobile number already exists.");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setMobileNumber(request.getMobileNumber());

        userRepository.save(user);

        return new ProfileResponse(
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getMobileNumber(),
            user.getUsername(),
            user.getRole().name(),
            user.getProvider().name(),

            user.getHousehold() != null
                    ? user.getHousehold().getApartment().getName()
                    : null,

            user.getHousehold() != null
                    ? user.getHousehold().getFlatNumber()
                    : null,
            user.getHousehold() != null
                ? user.getHousehold().getFlatSize()
                : null,

            user.getHousehold() != null
                    ? user.getHousehold().getOccupancy()
                    : null
        );
    }
}
