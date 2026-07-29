package com.example.demo_prj_intern.controller;

import com.example.demo_prj_intern.dto.request.ChooseRoleRequest;
import com.example.demo_prj_intern.dto.request.LoginRequest;
import com.example.demo_prj_intern.dto.request.Oauth2LoginRequest;
import com.example.demo_prj_intern.dto.request.RegisterRequest;
import com.example.demo_prj_intern.dto.respone.AuthResponse;
import com.example.demo_prj_intern.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/oauth2")
    public ResponseEntity<AuthResponse> oauth2Login(@RequestBody Oauth2LoginRequest request) {
        return ResponseEntity.ok(authService.oauth2Login(request));
    }

    @PostMapping("/choose-role")
    public ResponseEntity<AuthResponse> chooseRole(@RequestBody ChooseRoleRequest request) {
        return ResponseEntity.ok(authService.chooseRole(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody Long userId) {
        authService.logout(userId);
        return ResponseEntity.ok().build();
    }
}
