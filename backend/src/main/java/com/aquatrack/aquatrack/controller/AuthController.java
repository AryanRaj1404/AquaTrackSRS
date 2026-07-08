package com.aquatrack.aquatrack.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.AuthResponse;
import com.aquatrack.aquatrack.dto.GoogleAuthRequest;
import com.aquatrack.aquatrack.dto.LoginRequest;
import com.aquatrack.aquatrack.dto.RegisterRequest;
import com.aquatrack.aquatrack.service.UserService;

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
        public String me() {
            return "You are authenticated!";
        }
    }
