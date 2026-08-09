package com.example.demo_prj_intern.dto.request;

import lombok.Data;

@Data
public class AuthLoginRequest {
    private String idToken; // Đoạn Token xác thực lấy từ Google SDK ở Frontend 
}
