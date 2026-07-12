package com.aquatrack.aquatrack.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.aquatrack.aquatrack.dto.LoginRequest;
import com.aquatrack.aquatrack.dto.ProfileResponse;
import com.aquatrack.aquatrack.dto.RegisterRequest;
import com.aquatrack.aquatrack.dto.UpdateProfileRequest;
import com.aquatrack.aquatrack.entity.User;
import com.aquatrack.aquatrack.enums.Role;
import com.aquatrack.aquatrack.enums.AuthProvider;
import com.aquatrack.aquatrack.repository.UserRepository;
import com.aquatrack.aquatrack.security.JwtService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private GoogleIdTokenVerifier googleIdTokenVerifier;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void registerSuccessfully() {

        RegisterRequest request = new RegisterRequest();

        request.setFirstName("Aryan");
        request.setLastName("Raj");
        request.setEmail("aryan@test.com");
        request.setMobileNumber("9999999999");
        request.setUsername("aryan");
        request.setPassword("password");

        when(userRepository.findByUsername("aryan"))
                .thenReturn(Optional.empty());

        when(userRepository.findByEmail("aryan@test.com"))
                .thenReturn(Optional.empty());

        when(userRepository.findByMobileNumber("9999999999"))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("password"))
                .thenReturn("encodedPassword");

        userService.register(request);

        verify(userRepository).save(any(User.class));
    }

    @Test
    void loginSuccessfully() {

        User user = new User();

        user.setUsername("aryan");
        user.setPassword("encoded");

        LoginRequest request = new LoginRequest();
        request.setUsername("aryan");
        request.setPassword("password");

        when(userRepository.findByUsername("aryan"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("password", "encoded"))
                .thenReturn(true);

        when(jwtService.generateToken(user))
                .thenReturn("jwt-token");

        assertEquals(
                "jwt-token",
                userService.login(request).getToken());
    }

    @Test
    void getProfileSuccessfully() {

        User user = new User();

        user.setUsername("aryan");
        user.setFirstName("Aryan");
        user.setLastName("Raj");
        user.setEmail("aryan@test.com");
        user.setMobileNumber("9999999999");
        user.setRole(Role.RESIDENT);
        user.setProvider(AuthProvider.LOCAL);

        when(userRepository.findByUsername("aryan"))
                .thenReturn(Optional.of(user));

        ProfileResponse response =
                userService.getProfile("aryan");

        assertEquals("Aryan", response.getFirstName());
    }

    @Test
    void updateProfileSuccessfully() {

        User user = new User();

        user.setUsername("aryan");
        user.setFirstName("Aryan");
        user.setLastName("Raj");
        user.setEmail("aryan@test.com");
        user.setMobileNumber("9999999999");
        user.setRole(Role.RESIDENT);
        user.setProvider(AuthProvider.LOCAL);

        UpdateProfileRequest request =
                new UpdateProfileRequest();

        request.setFirstName("Aryan");
        request.setLastName("Kumar");
        request.setMobileNumber("8888888888");

        when(userRepository.findByUsername("aryan"))
                .thenReturn(Optional.of(user));

        when(userRepository.findByMobileNumber("8888888888"))
                .thenReturn(Optional.empty());

        ProfileResponse response =
                userService.updateProfile("aryan", request);

        assertEquals("Kumar", response.getLastName());

        verify(userRepository).save(user);
    }

}