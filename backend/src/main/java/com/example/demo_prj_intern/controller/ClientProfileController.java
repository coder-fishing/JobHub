package com.example.demo_prj_intern.controller;

import com.example.demo_prj_intern.dto.request.ClientProfileRequest;
import com.example.demo_prj_intern.dto.respone.ClientJobHistoryDTO;
import com.example.demo_prj_intern.dto.respone.ClientProfileResponse;
import com.example.demo_prj_intern.entity.UserEntity;
import com.example.demo_prj_intern.repository.UserRepository;
import com.example.demo_prj_intern.service.ClientProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/client/profile")
@RequiredArgsConstructor
public class ClientProfileController {

    private final ClientProfileService clientProfileService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ClientProfileResponse> getMyProfile() {
        UserEntity user = getAuthenticatedUser();
        return ResponseEntity.ok(clientProfileService.getClientProfileByUserId(user.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<ClientProfileResponse> updateMyProfile(@RequestBody ClientProfileRequest request) {
        UserEntity user = getAuthenticatedUser();
        if (!"CLIENT".equals(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Chỉ tài khoản CLIENT mới có quyền chỉnh sửa hồ sơ này");
        }
        return ResponseEntity.ok(clientProfileService.updateClientProfile(user.getId(), request));
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<ClientProfileResponse> getClientProfilePublic(@PathVariable Long clientId) {
        return ResponseEntity.ok(clientProfileService.getClientProfileByUserId(clientId));
    }

    @GetMapping("/{clientId}/jobs")
    public ResponseEntity<List<ClientJobHistoryDTO>> getClientJobHistory(@PathVariable Long clientId) {
        return ResponseEntity.ok(clientProfileService.getClientJobHistory(clientId));
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
