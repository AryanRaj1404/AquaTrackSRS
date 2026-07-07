package com.aquatrack.aquatrack.service;

import com.aquatrack.aquatrack.dto.RegisterRequest;
import com.aquatrack.aquatrack.dto.LoginRequest;
import com.aquatrack.aquatrack.dto.AuthResponse;

import com.aquatrack.aquatrack.dto.ProfileResponse;
import com.aquatrack.aquatrack.dto.ProfileUpdateRequest;

public interface UserService {
    void register(RegisterRequest request);
    
    AuthResponse login(LoginRequest request);

    ProfileResponse getProfile(String username);

    ProfileResponse updateProfile(String username, ProfileUpdateRequest request);
}
