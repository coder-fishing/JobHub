package com.example.demo_prj_intern.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long id;
    private String email;
    private String role;
    private String status;
    private String token; // Dùng nếu sau này tích hợp JWT
}
