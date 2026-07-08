package com.aquatrack.aquatrack.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.AuthResponse;
import com.aquatrack.aquatrack.dto.LoginRequest;
import com.aquatrack.aquatrack.dto.RegisterRequest;
import com.aquatrack.aquatrack.entity.Role;
import com.aquatrack.aquatrack.entity.User;
import com.aquatrack.aquatrack.repository.UserRepository;
import com.aquatrack.aquatrack.security.JwtService;

@Service
public class UserServiceImpl implements UserService{

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;

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

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());

        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        user.setRole(Role.RESIDENT);

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
}
