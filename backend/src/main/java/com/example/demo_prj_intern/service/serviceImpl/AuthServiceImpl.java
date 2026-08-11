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
import com.example.demo_prj_intern.security.JwtProvider;
import com.example.demo_prj_intern.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    // Đăng Ký Tài Khoản Mới
    @Transactional
    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        // Check trung email
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        
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

            boolean hasValidName = fullNameInput != null && !fullNameInput.trim().isEmpty();
            freelancerProfileEntity.setFullName(hasValidName ? fullNameInput.trim() : "FreeLancer " + user.getId());

            freelancerProfileRepository.save(freelancerProfileEntity);
        }
        
        String token = jwtProvider.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(user.getId(), user.getEmail(), user.getRole(), user.getStatus(), token);
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

        String token = jwtProvider.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(user.getId(), user.getEmail(), user.getRole(), user.getStatus(), token);
    }

    // Đăng Nhập Bằng OAuth2 (Google, Facebook, GitHub)
    @Override
    @Transactional
    public AuthResponse oauth2Login(Oauth2LoginRequest request) {
        Optional<UserEntity> optionalUser = userRepository.findByEmail(request.getEmail());
        UserEntity user;

        if(optionalUser.isPresent()) {
            user = optionalUser.get();
            if ("BLOCKED".equalsIgnoreCase(user.getStatus())) {
                throw new RuntimeException("Tài khoản của bạn đã bị khóa");
            }
        }
        else {
            user = new UserEntity();
            user.setEmail(request.getEmail());
            user.setRole("CLIENT"); // Mặc định là CLIENT
            user.setAuthProvider(request.getProvider());
            user.setPassword("");
            user.setStatus("ACTIVE");
            user = userRepository.save(user);

            WalletEntity wallet = new WalletEntity();
            wallet.setUser(user);
            wallet.setBalance(BigDecimal.ZERO);
            wallet.setFreezingBalance(BigDecimal.ZERO);
            walletRepository.save(wallet);
        }

        String token = jwtProvider.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(user.getId(), user.getEmail(), user.getRole(), user.getStatus(), token);
    }

    // Chọn Role Cho Người Dùng Mới Đăng Nhập Bằng OAuth2
    @Override
    @Transactional
    public AuthResponse chooseRole(ChooseRoleRequest request) {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Chưa đăng nhập");
        }

        String email = authentication.getName();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt");
        }

        if (user.getRole() != null && !user.getRole().trim().isEmpty()) {
            throw new RuntimeException("Tài khoản đã được phân quyền");
        }

        if (!"CLIENT".equals(request.getRole()) && !"FREELANCER".equals(request.getRole())) {
            throw new RuntimeException("Role không hợp lệ");
        }

        user.setRole(request.getRole());
        userRepository.save(user);

        if("FREELANCER".equals(request.getRole())) {
            Optional<FreelancerProfileEntity> existingProfile = freelancerProfileRepository.findByUserId(user.getId());
            if (existingProfile.isEmpty()) {
                FreelancerProfileEntity freelancerProfileEntity = new FreelancerProfileEntity();
                freelancerProfileEntity.setUser(user);
                freelancerProfileEntity.setFullName(request.getFullName() != null
                        ? request.getFullName()
                        : "FreeLancer " + user.getId() );
                freelancerProfileRepository.save(freelancerProfileEntity);
            }
        }

        String token = jwtProvider.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(user.getId(), user.getEmail(), user.getRole(), user.getStatus(), token);
    }

    @Override
    public void logout(Long userId) {
        // Hiện tại chỉ dùng JWT stateless không có blacklist, logic logout sẽ được frontend clear token
    }

    @Override
    public com.example.demo_prj_intern.dto.respone.CurrentUserResponse getCurrentUser() {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Chưa đăng nhập");
        }

        String email = authentication.getName();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        boolean profileCompleted = true; // mặc định true cho CLIENT
        String fullName = null;
        String avatarUrl = null;

        if ("FREELANCER".equals(user.getRole())) {
            profileCompleted = false;
            Optional<FreelancerProfileEntity> optionalProfile = freelancerProfileRepository.findByUserId(user.getId());
            if (optionalProfile.isPresent()) {
                FreelancerProfileEntity profile = optionalProfile.get();
                fullName = profile.getFullName();
                avatarUrl = profile.getAvatarUrl();
                if (profile.getTitle() != null && !profile.getTitle().trim().isEmpty() &&
                    profile.getBio() != null && !profile.getBio().trim().isEmpty() &&
                    profile.getSkills() != null && !profile.getSkills().trim().isEmpty()) {
                    profileCompleted = true;
                }
            }
        }

        return new com.example.demo_prj_intern.dto.respone.CurrentUserResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                profileCompleted,
                fullName,
                avatarUrl
        );
    }
}
