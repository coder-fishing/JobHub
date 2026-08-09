package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.dto.request.FreelancerRequest;
import com.example.demo_prj_intern.dto.respone.FreelancerProfileRespone; // Chú ý spelling Respone/Response theo project của bạn
import com.example.demo_prj_intern.entity.FreelancerProfileEntity;
import com.example.demo_prj_intern.repository.FreelancerProfileRepository;
import com.example.demo_prj_intern.service.FreelancerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FreelancerProfileServiceImpl implements FreelancerProfileService {

    private final FreelancerProfileRepository freelancerProfileRepository;

    @Override
    public FreelancerProfileRespone getProfileByUserId(Long userId) {
        FreelancerProfileEntity profile = freelancerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ Freelancer cho userId: " + userId));

        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public FreelancerProfileRespone updateProfile(Long userId, FreelancerRequest request) {
        FreelancerProfileEntity profile = freelancerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ Freelancer cho userId: " + userId));

        // Cập nhật thông tin từ Request DTO
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            profile.setFullName(request.getFullName().trim());
        }
        if (request.getTitle() != null) profile.setTitle(request.getTitle());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getSkills() != null) profile.setSkills(request.getSkills());
        if (request.getHourlyRate() != null) profile.setHourlyRate(request.getHourlyRate());
        if (request.getPortfolioUrl() != null) profile.setPortfolioUrl(request.getPortfolioUrl());

        // Lưu xuống Database
        FreelancerProfileEntity savedProfile = freelancerProfileRepository.save(profile);

        // Map Entity -> Response DTO và trả về
        return mapToResponse(savedProfile);
    }

    // === HÀM HỖ TRỢ CHUYỂN ĐỔI ENTITY SANG DTO RESPONSE ===
    private FreelancerProfileRespone mapToResponse(FreelancerProfileEntity entity) {
        FreelancerProfileRespone response = new FreelancerProfileRespone();

        response.setId(entity.getId());
        if (entity.getUser() != null) {
            response.setUserId(entity.getUser().getId());
            response.setEmail(entity.getUser().getEmail());
        }
        response.setFullName(entity.getFullName());
        response.setTitle(entity.getTitle());
        response.setBio(entity.getBio());
        response.setSkills(entity.getSkills());
        response.setHourlyRate(entity.getHourlyRate());
        response.setPortfolioUrl(entity.getPortfolioUrl());

        return response;
    }
}