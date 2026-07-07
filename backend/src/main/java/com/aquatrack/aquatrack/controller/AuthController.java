package com.aquatrack.aquatrack.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.service.UserService;
import com.aquatrack.aquatrack.dto.AuthResponse;
import com.aquatrack.aquatrack.dto.LoginRequest;
import com.aquatrack.aquatrack.dto.RegisterRequest;
import com.aquatrack.aquatrack.dto.ProfileResponse;
import com.aquatrack.aquatrack.dto.ProfileUpdateRequest;
import org.springframework.web.bind.annotation.PutMapping;
import java.security.Principal;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public String Register(@Valid @RequestBody RegisterRequest request){
        userService.register(request);
        return "User Registered Successfully";
    }
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request);
    }
    @GetMapping("/me")
    public String me() {
        return "You are authenticated!";
    }
    @GetMapping("/profile")
    public ProfileResponse getProfile(Principal principal) {
        return userService.getProfile(principal.getName());
    }
    @PutMapping("/profile")
    public ProfileResponse updateProfile(Principal principal, @Valid @RequestBody ProfileUpdateRequest request) {
        return userService.updateProfile(principal.getName(), request);
    }
}
