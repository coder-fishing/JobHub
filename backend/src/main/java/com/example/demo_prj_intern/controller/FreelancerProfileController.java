package com.example.demo_prj_intern.controller;

import com.example.demo_prj_intern.dto.request.FreelancerRequest;
import com.example.demo_prj_intern.dto.respone.FreelancerProfileRespone;
import com.example.demo_prj_intern.entity.UserEntity;
import com.example.demo_prj_intern.repository.UserRepository;
import com.example.demo_prj_intern.service.FreelancerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/freelancer/profile")
@RequiredArgsConstructor
public class FreelancerProfileController {

    private final FreelancerProfileService freelancerProfileService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<FreelancerProfileRespone> getMyProfile() {
        UserEntity user = getAuthenticatedUser();
        return ResponseEntity.ok(freelancerProfileService.getProfileByUserId(user.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<FreelancerProfileRespone> updateMyProfile(@RequestBody FreelancerRequest request) {
        UserEntity user = getAuthenticatedUser();
        if (!"FREELANCER".equals(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Chỉ FREELANCER mới được sửa profile này");
        }
        return ResponseEntity.ok(freelancerProfileService.updateProfile(user.getId(), request));
    }

    @GetMapping
    public ResponseEntity<java.util.List<FreelancerProfileRespone>> getAllFreelancers(
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(freelancerProfileService.getAllFreelancers(search));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<FreelancerProfileRespone> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(freelancerProfileService.getProfileByUserId(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<FreelancerProfileRespone> updateProfile(
            @PathVariable Long userId,
            @RequestBody FreelancerRequest request
    ) {
        // Vẫn giữ lại phục vụ cho ADMIN nếu có, hoặc legacy API
        return ResponseEntity.ok(freelancerProfileService.updateProfile(userId, request));
    }



    private UserEntity getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa đăng nhập");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));
    }
}
