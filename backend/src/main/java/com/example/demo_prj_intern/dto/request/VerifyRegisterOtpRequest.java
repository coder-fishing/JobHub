package com.example.demo_prj_intern.dto.request;

import lombok.Data;

@Data
public class VerifyRegisterOtpRequest {
    private String email;
    private String otpCode;
}
