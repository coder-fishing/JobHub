package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:no-reply@demo.com}")
    private String fromEmail;

    @Override
    public void sendRegistrationOtp(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Mã xác nhận đăng ký tài khoản (OTP)");
            message.setText("Xin chào,\n\n"
                    + "Mã xác nhận đăng ký (OTP) của bạn là: " + otp + "\n\n"
                    + "Vui lòng nhập mã này vào trang xác thực để hoàn tất quá trình đăng ký.\n"
                    + "Mã này sẽ hết hạn sau 5 phút.\n\n"
                    + "Trân trọng,\nĐội ngũ hỗ trợ.");
            
            mailSender.send(message);
        } catch (MailException e) {
            // DO NOT print raw OTP to logs!
            log.error("Không thể gửi email OTP đến địa chỉ: {}. Lỗi: {}", email, e.getMessage());
            throw new RuntimeException("Gặp sự cố khi gửi email xác thực. Vui lòng thử lại sau.");
        }
    }
}
