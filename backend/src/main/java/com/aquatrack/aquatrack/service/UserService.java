package com.aquatrack.aquatrack.service;

import com.aquatrack.aquatrack.dto.RegisterRequest;
import com.aquatrack.aquatrack.dto.LoginRequest;
import com.aquatrack.aquatrack.dto.AuthResponse;

public interface UserService {
    void register(RegisterRequest request);
    
    AuthResponse login(LoginRequest request);
}
