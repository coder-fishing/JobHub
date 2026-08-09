package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.dto.request.ChooseRoleRequest;

import com.example.demo_prj_intern.dto.request.LoginRequest;
import com.example.demo_prj_intern.dto.request.Oauth2LoginRequest;
import com.example.demo_prj_intern.dto.request.RegisterRequest;
import com.example.demo_prj_intern.dto.respone.AuthResponse;
import com.example.demo_prj_intern.entity.FreelancerProfileEntity;
import com.example.demo_prj_intern.entity.UserEntity;
import com.example.demo_prj_intern.entity.WalletEntity;
import com.example.demo_prj_intern.repository.FreelancerProfileRepository;
import com.example.demo_prj_intern.repository.UserRepository;
import com.example.demo_prj_intern.repository.WalletRepository;
import com.example.demo_prj_intern.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.beans.Encoder;
import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    // Đăng Ký Tài Khoản Mới
    @Transactional
    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        // Check trung email
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        /*
            Entity là đối tượng chứa Dữ liệu (Data/State),
            không phải đối tượng chứa Logic (Service/Repository),
            nên nó không bao giờ được quản lý bởi Spring Container để mà DI (Inject).
        * */
        UserEntity user = new UserEntity();
        user.setEmail(registerRequest.getEmail());

        // Encode password
        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
        user.setPassword(encodedPassword);

        user.setRole(registerRequest.getRole());
        user.setAuthProvider("LOCAL");
        user.setStatus("ACTIVE");
        user = userRepository.save(user);

        // Tự Động Khởi Tạo Ví Cho Người Dùng Mới
        WalletEntity wallet = new WalletEntity();
        wallet.setUser(user);
        wallet.setBalance(BigDecimal.ZERO);
        wallet.setFreezingBalance(BigDecimal.ZERO);
        walletRepository.save(wallet);

        // Nếu chọn Role là FREELANCER thì tự động tạo FreelancerProfile
        if("FREELANCER".equals(registerRequest.getRole())) {
            FreelancerProfileEntity freelancerProfileEntity = new FreelancerProfileEntity();
            freelancerProfileEntity.setUser(user);
            String fullNameInput = registerRequest.getFullName();

            // Kiểm tra: Không null VÀ có độ dài lớn hơn "" (sau khi đã trim bỏ khoảng trắng thừa)
            boolean hasValidName = fullNameInput != null && !fullNameInput.trim().isEmpty();
            freelancerProfileEntity.setFullName(hasValidName ? fullNameInput.trim() : "FreeLancer " + user.getId());

            freelancerProfileRepository.save(freelancerProfileEntity);
        }

        return new AuthResponse(user.getId(), user.getEmail(), user.getRole(), user.getStatus(), null);
    }

    // Đăng Nhập Bằng Email Và Mật Khẩu
    @Override
    public AuthResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không chính xác!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác!");
        }

        if ("BLOCKED".equals(user.getStatus())) {
            throw new RuntimeException("Tài khoản của bạn đã bị khóa!");
        }

        return new AuthResponse(user.getId(), user.getEmail(), user.getRole(), user.getStatus(), "SAMPLE_JWT_TOKEN");
    }

    // Đăng Nhập Bằng OAuth2 (Google, Facebook, GitHub)
    @Override
    @Transactional
    public AuthResponse oauth2Login(Oauth2LoginRequest request) {
        Optional<UserEntity> optionalUser = userRepository.findByEmail(request.getEmail());
        UserEntity user;

        if(optionalUser.isPresent()) {
            // Có tài khoản, kiểm tra provider
            user = optionalUser.get();
        }

        else {
            // Chưa có tài khoản, tạo mới
            user = new UserEntity();
            user.setEmail(request.getEmail());
            user.setRole("CLIENT"); // Mặc định là CLIENT, người dùng có thể chọn lại sau
            user.setAuthProvider(request.getProvider());
            user.setPassword("");
            user.setStatus("ACTIVE");
            user = userRepository.save(user);

            // Tự Động Khởi Tạo Ví Cho Người Dùng Mới
            WalletEntity wallet = new WalletEntity();
            wallet.setUser(user);
            wallet.setBalance(BigDecimal.ZERO);
            wallet.setFreezingBalance(BigDecimal.ZERO);
            walletRepository.save(wallet);

        }

        return new AuthResponse(user.getId(), user.getEmail(), user.getRole(), user.getStatus(), "SAMPLE_JWT_TOKEN");
    }

    // Chọn Role Cho Người Dùng Mới Đăng Nhập Bằng OAuth2
    @Override
    @Transactional
    public AuthResponse chooseRole(ChooseRoleRequest request) {
        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        user.setRole(request.getRole());
        userRepository.save(user);

        if("FREELANCER".equals(request.getRole())) {
            FreelancerProfileEntity freelancerProfileEntity = new FreelancerProfileEntity();
            freelancerProfileEntity.setUser(user);
            freelancerProfileEntity.setFullName(request.getFullName() != null
                    ? request.getFullName()
                    : "FreeLancer " + user.getId() );
            freelancerProfileRepository.save(freelancerProfileEntity);
        }

        return new AuthResponse(user.getId(), user.getEmail(), user.getRole(), user.getStatus(), "SAMPLE_JWT_TOKEN");
    }

    @Override
    public void logout(Long userId) {
        // Xử lý logout, ví dụ xóa token khỏi cơ sở dữ liệu hoặc cache
    }
}
