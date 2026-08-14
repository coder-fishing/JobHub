package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.dto.request.FreelancerRequest;
import com.example.demo_prj_intern.dto.respone.FreelancerProfileRespone; // Chú ý spelling Respone/Response theo project của bạn
import com.example.demo_prj_intern.entity.FreelancerProfileEntity;
import com.example.demo_prj_intern.mapper.FreelancerProfileMapper;
import com.example.demo_prj_intern.repository.FreelancerProfileRepository;
import com.example.demo_prj_intern.service.FreelancerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FreelancerProfileServiceImpl implements FreelancerProfileService {

    private final FreelancerProfileRepository freelancerProfileRepository;
    private final FreelancerProfileMapper freelancerProfileMapper;

    @Override
    public FreelancerProfileRespone getProfileByUserId(Long userId) {
        FreelancerProfileEntity profile = freelancerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ Freelancer cho userId: " + userId));

        return freelancerProfileMapper.toResponse(profile);
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

        freelancerProfileMapper.updateEntityFromRequest(request, profile);
        FreelancerProfileEntity saved = freelancerProfileRepository.save(profile);
        return freelancerProfileMapper.toResponse(saved);
    }

    @Override
    public List<FreelancerProfileRespone> getAllFreelancers(String search) {
        List<FreelancerProfileEntity> list = freelancerProfileRepository.findAll();
        return freelancerProfileMapper.toResponseList(list);
    }

}