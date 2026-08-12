package com.example.demo_prj_intern;

import com.example.demo_prj_intern.service.EmailService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MailTestRunner implements CommandLineRunner {

    private final EmailService emailService;

    public MailTestRunner(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- BẮT ĐẦU TEST GỬI EMAIL ---");
        try {
            // We use a dummy email since we don't have a real one specified,
            // but the SMTP authentication will fail first anyway if credentials are not provided.
            emailService.sendRegistrationOtp("test-recipient@example.com", "123456");
            System.out.println("--- GỬI EMAIL THÀNH CÔNG ---");
        } catch (Exception e) {
            System.out.println("--- LỖI GỬI EMAIL: " + e.getMessage() + " ---");
        }
    }
}
