package com.example.demo_prj_intern.dto.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String role; // CLIENT or FREELANCER
    private String fullName;
}
