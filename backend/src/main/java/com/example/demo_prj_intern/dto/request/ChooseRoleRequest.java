package com.example.demo_prj_intern.dto.request;

import lombok.Data;

// Cho nhung nguoi lan dau dang nhạp bang ben thu 3
@Data
public class ChooseRoleRequest {
    private Long userId;
    private String role; // 'CLIENT' hoặc 'FREELANCER'
    private String fullName; // Nếu chọn FREELANCER thì cập nhật luôn tên
}

