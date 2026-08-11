package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.entity.OtpEntity;
import com.example.demo_prj_intern.repository.OtpRepository;
import com.example.demo_prj_intern.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpServiceImpl implements OtpService {

    private final OtpRepository otpRepository;
    
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_FAILED_ATTEMPTS = 5;

    private String normalizeEmail(String email) {
        return email != null ? email.trim().toLowerCase() : "";
    }

    @org.springframework.beans.factory.annotation.Value("${app.otp.secret}")
    private String otpSecret;

    private String hashOtp(String otp, String email) {
        try {
            javax.crypto.Mac sha256_HMAC = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec secret_key = new javax.crypto.spec.SecretKeySpec(otpSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            
            String input = otp + ":" + normalizeEmail(email);
            byte[] encodedhash = sha256_HMAC.doFinal(input.getBytes(StandardCharsets.UTF_8));
            
            StringBuilder hexString = new StringBuilder(2 * encodedhash.length);
            for (byte b : encodedhash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException | java.security.InvalidKeyException e) {
            log.error("Lỗi mã hóa HMAC-SHA256", e);
            throw new RuntimeException("Lỗi hệ thống: Không thể xử lý mã xác thực.");
        }
    }

    @Override
    public String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000); // 6 digits
        return String.valueOf(otp);
    }

    @Override
    @Transactional
    public String createRegisterOtp(String email) {
        String normalizedEmail = normalizeEmail(email);
        String purpose = "REGISTER";
        
        // Remove existing OTP if any (resend new OTP makes old one invalid)
        deleteOtp(normalizedEmail, purpose);

        String otp = generateOtp();
        String codeHash = hashOtp(otp, normalizedEmail);

        OtpEntity otpEntity = new OtpEntity();
        otpEntity.setEmail(normalizedEmail);
        otpEntity.setCodeHash(codeHash);
        otpEntity.setPurpose(purpose);
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        otpEntity.setFailedAttempts(0);

        try {
            otpRepository.saveAndFlush(otpEntity);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            log.error("Xung đột dữ liệu khi tạo mã OTP cho email: {}", normalizedEmail);
            throw new RuntimeException("Hệ thống đang bận xử lý yêu cầu trước đó, vui lòng thử lại sau.");
        }
        
        return otp; // Returning raw OTP so caller (e.g. EmailService) can send it
    }

    @Override
    @Transactional
    public boolean verifyRegisterOtp(String email, String otp) {
        String normalizedEmail = normalizeEmail(email);
        String purpose = "REGISTER";
        
        Optional<OtpEntity> optEntity = otpRepository.findByEmailAndPurpose(normalizedEmail, purpose);
        if (optEntity.isEmpty()) {
            return false;
        }

        OtpEntity otpEntity = optEntity.get();

        if (otpEntity.getFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
            // Reject due to max attempts
            return false;
        }

        if (otpEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            // Expired OTP -> delete it
            deleteOtp(normalizedEmail, purpose);
            return false;
        }

        String inputHash = hashOtp(otp, normalizedEmail);
        if (!otpEntity.getCodeHash().equals(inputHash)) {
            // Wrong OTP
            otpEntity.setFailedAttempts(otpEntity.getFailedAttempts() + 1);
            otpRepository.save(otpEntity);
            return false;
        }

        // Verify success -> delete OTP
        deleteOtp(normalizedEmail, purpose);
        return true;
    }

    @Override
    @Transactional
    public String resendRegisterOtp(String email) {
        String normalizedEmail = normalizeEmail(email);
        String purpose = "REGISTER";
        
        Optional<OtpEntity> optEntity = otpRepository.findByEmailAndPurpose(normalizedEmail, purpose);
        if (optEntity.isPresent()) {
            OtpEntity otpEntity = optEntity.get();
            if (LocalDateTime.now().isBefore(otpEntity.getCreatedAt().plusSeconds(60))) {
                throw new RuntimeException("Vui lòng chờ trước khi gửi lại OTP");
            }
        }
        return createRegisterOtp(email);
    }

    @Override
    @Transactional
    public void deleteOtp(String email, String purpose) {
        String normalizedEmail = normalizeEmail(email);
        otpRepository.deleteByEmailAndPurpose(normalizedEmail, purpose);
    }
}
