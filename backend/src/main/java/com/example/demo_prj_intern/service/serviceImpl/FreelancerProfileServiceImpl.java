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
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ Freelancer cho userId: " + userId));

        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public FreelancerProfileRespone updateProfile(Long userId, FreelancerRequest request) {
        FreelancerProfileEntity profile = freelancerProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    FreelancerProfileEntity newProfile = new FreelancerProfileEntity();
                    // Lấy UserEntity thông qua reference để gán (vì service không có sẵn UserRepository)
                    // Rất may là chỉ cần ID để tạo relationship proxy trong Hibernate.
                    // Nhưng ở đây ta cần gán UserEntity thật hoặc tạo proxy.
                    return newProfile;
                });

        if (profile.getUser() == null) {
            // Khởi tạo relationship nếu đây là profile mới
            com.example.demo_prj_intern.entity.UserEntity userRef = new com.example.demo_prj_intern.entity.UserEntity();
            userRef.setId(userId);
            profile.setUser(userRef);
        }

        // Cập nhật thông tin từ Request DTO
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            profile.setFullName(request.getFullName().trim());
        } else if (profile.getFullName() == null) {
            profile.setFullName("Freelancer " + userId); // Default for NOT NULL constraint
        }
        if (request.getTitle() != null) profile.setTitle(request.getTitle());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getSkills() != null) profile.setSkills(request.getSkills());
        if (request.getHourlyRate() != null) profile.setHourlyRate(request.getHourlyRate());
        if (request.getPortfolioUrl() != null) profile.setPortfolioUrl(request.getPortfolioUrl());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());

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
        response.setAvatarUrl(entity.getAvatarUrl());

        return response;
    }

    @Override
    public java.util.List<FreelancerProfileRespone> getAllFreelancers(String search) {
        java.util.List<FreelancerProfileEntity> list = freelancerProfileRepository.findAll();
        return list.stream()
                .filter(f -> f.getUser() != null && "FREELANCER".equals(f.getUser().getRole()) && "ACTIVE".equals(f.getUser().getStatus()))
                .filter(f -> {
                    if (search == null || search.trim().isEmpty()) return true;
                    String s = search.toLowerCase();
                    boolean nameMatch = f.getFullName() != null && f.getFullName().toLowerCase().contains(s);
                    boolean titleMatch = f.getTitle() != null && f.getTitle().toLowerCase().contains(s);
                    boolean skillsMatch = f.getSkills() != null && f.getSkills().toLowerCase().contains(s);
                    return nameMatch || titleMatch || skillsMatch;
                })
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }
}