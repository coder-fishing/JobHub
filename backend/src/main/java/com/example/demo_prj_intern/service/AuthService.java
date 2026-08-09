package com.example.demo_prj_intern.service;

import com.example.demo_prj_intern.dto.request.ChooseRoleRequest;
import com.example.demo_prj_intern.dto.request.LoginRequest;
import com.example.demo_prj_intern.dto.request.Oauth2LoginRequest;
import com.example.demo_prj_intern.dto.request.RegisterRequest;
import com.example.demo_prj_intern.dto.respone.AuthResponse;

public interface AuthService {

    // Register
    AuthResponse register(RegisterRequest registerRequest);

    // Login by username password
    AuthResponse login(LoginRequest loginRequest);

    // Login / register by oauth2 (Google, Facebook, Github)
    AuthResponse oauth2Login(Oauth2LoginRequest request);

    // Chose role
    AuthResponse chooseRole(ChooseRoleRequest request);

    // Logout
    void logout(Long userId);
}
