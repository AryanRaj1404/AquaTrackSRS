package com.aquatrack.aquatrack.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.AuthResponse;
import com.aquatrack.aquatrack.dto.GoogleAuthRequest;
import com.aquatrack.aquatrack.dto.LoginRequest;
import com.aquatrack.aquatrack.dto.ProfileResponse;
import com.aquatrack.aquatrack.dto.RegisterRequest;
import com.aquatrack.aquatrack.dto.UpdateProfileRequest;
import com.aquatrack.aquatrack.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public String Register(@RequestBody RegisterRequest request){
        userService.register(request);
        return "User Registered Successfully";
    }
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }
    @PostMapping("/google")
    public AuthResponse googleLogin(@RequestBody GoogleAuthRequest request) {
        return userService.googleLogin(request);
    }
    @GetMapping("/me")
    public ProfileResponse me(Authentication authentication) {
        System.out.println("Authenticated User = " + authentication.getName());
        return userService.getProfile(authentication.getName());
    }
    @PutMapping("/profile")
    public ProfileResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {

        return userService.updateProfile(authentication.getName(), request);
    }
}
