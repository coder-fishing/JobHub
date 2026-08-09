package com.example.demo_prj_intern.dto.request;

import lombok.Data;

@Data
public class Oauth2LoginRequest {
    private String email;
    private String name;
    private String provider; // "GOOGLE", "FACEBOOK", "GITHUB"
    private String avatarUrl; // Thêm trường này để lưu avatar nếu có
}
