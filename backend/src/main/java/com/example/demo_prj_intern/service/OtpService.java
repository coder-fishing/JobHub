package com.example.demo_prj_intern.service;

public interface OtpService {
    String generateOtp();
    String createRegisterOtp(String email);
    boolean verifyRegisterOtp(String email, String otp);
    String resendRegisterOtp(String email);
    void deleteOtp(String email, String purpose);
}
