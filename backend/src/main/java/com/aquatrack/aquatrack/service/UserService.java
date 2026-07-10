package com.aquatrack.aquatrack.service;

import com.aquatrack.aquatrack.dto.AuthResponse;
import com.aquatrack.aquatrack.dto.GoogleAuthRequest;
import com.aquatrack.aquatrack.dto.LoginRequest;
import com.aquatrack.aquatrack.dto.ProfileResponse;
import com.aquatrack.aquatrack.dto.RegisterRequest;
import com.aquatrack.aquatrack.dto.UpdateProfileRequest;

public interface UserService {
    void register(RegisterRequest request);
    
    AuthResponse login(LoginRequest request);

    AuthResponse googleLogin(GoogleAuthRequest request);

    ProfileResponse getProfile(String username);

    ProfileResponse updateProfile(String username, UpdateProfileRequest request);
}
