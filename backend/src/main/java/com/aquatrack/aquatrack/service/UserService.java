package com.aquatrack.aquatrack.service;

import com.aquatrack.aquatrack.dto.AuthResponse;
import com.aquatrack.aquatrack.dto.GoogleAuthRequest;
import com.aquatrack.aquatrack.dto.LoginRequest;
import com.aquatrack.aquatrack.dto.RegisterRequest;

public interface UserService {
    void register(RegisterRequest request);
    
    AuthResponse login(LoginRequest request);

    AuthResponse googleLogin(GoogleAuthRequest request);
}
