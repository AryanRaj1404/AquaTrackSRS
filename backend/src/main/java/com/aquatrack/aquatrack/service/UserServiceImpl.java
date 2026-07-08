package com.aquatrack.aquatrack.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.AuthResponse;
import com.aquatrack.aquatrack.dto.GoogleAuthRequest;
import com.aquatrack.aquatrack.dto.LoginRequest;
import com.aquatrack.aquatrack.dto.RegisterRequest;
import com.aquatrack.aquatrack.entity.User;
import com.aquatrack.aquatrack.enums.AuthProvider;
import com.aquatrack.aquatrack.enums.Role;
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

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,GoogleIdTokenVerifier googleIdTokenVerifier){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleIdTokenVerifier = googleIdTokenVerifier;
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

        userRepository.save(user);
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

                userRepository.save(user);
            }

            String token = jwtService.generateToken(user);

            return new AuthResponse(token);

        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed", e);
        }
    }
}
