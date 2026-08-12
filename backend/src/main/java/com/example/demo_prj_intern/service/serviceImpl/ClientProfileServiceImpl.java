package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.dto.request.ClientProfileRequest;
import com.example.demo_prj_intern.dto.respone.ClientJobHistoryDTO;
import com.example.demo_prj_intern.dto.respone.ClientProfileResponse;
import com.example.demo_prj_intern.entity.ClientProfileEntity;
import com.example.demo_prj_intern.entity.ContractEntity;
import com.example.demo_prj_intern.entity.ProjectEntity;
import com.example.demo_prj_intern.entity.UserEntity;
import com.example.demo_prj_intern.repository.ClientProfileRepository;
import com.example.demo_prj_intern.repository.ContractRepository;
import com.example.demo_prj_intern.repository.ProjectRepository;
import com.example.demo_prj_intern.repository.UserRepository;
import com.example.demo_prj_intern.service.ClientProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientProfileServiceImpl implements ClientProfileService {

    private final ClientProfileRepository clientProfileRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ContractRepository contractRepository;

    @Override
    public ClientProfileResponse getClientProfileByUserId(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        Optional<ClientProfileEntity> optionalProfile = clientProfileRepository.findByUserId(userId);
        ClientProfileEntity profile = optionalProfile.orElseGet(() -> {
            ClientProfileEntity newProfile = new ClientProfileEntity();
            newProfile.setUser(user);
            newProfile.setCompanyName(user.getEmail());
            return newProfile;
        });

        // 1. Thống kê số dự án đã đăng
        List<ProjectEntity> projects = projectRepository.findByClientId(userId);
        long totalProjectsPosted = projects.size();

        // 2. Thống kê số hợp đồng đã tuyển dụng thành công & Tổng số tiền chi trả
        List<ContractEntity> contracts = contractRepository.findByClientId(userId);
        long totalHiredCount = contracts.size();

        BigDecimal totalSpent = contracts.stream()
                .map(c -> c.getFinalPrice() != null ? c.getFinalPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Tính tỷ lệ tuyển dụng (Hire Rate %)
        double hireRate = totalProjectsPosted > 0
                ? Math.round(((double) totalHiredCount / totalProjectsPosted) * 100.0 * 100.0) / 100.0
                : 0.0;

        ClientProfileResponse response = new ClientProfileResponse();
        response.setId(profile.getId());
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setCompanyName(profile.getCompanyName() != null ? profile.getCompanyName() : user.getEmail());
        response.setCompanyWebsite(profile.getCompanyWebsite());
        response.setIndustry(profile.getIndustry());
        response.setCompanySize(profile.getCompanySize());
        response.setBio(profile.getBio());
        response.setLocation(profile.getLocation());
        response.setAvatarUrl(profile.getAvatarUrl());
        response.setTaxCode(profile.getTaxCode());

        // Gán thông tin thống kê uy tín
        response.setTotalProjectsPosted(totalProjectsPosted);
        response.setTotalHiredCount(totalHiredCount);
        response.setHireRate(hireRate);
        response.setTotalSpent(totalSpent);
        response.setMemberSince(user.getCreatedAt());

        return response;
    }

    @Override
    @Transactional
    public ClientProfileResponse updateClientProfile(Long userId, ClientProfileRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        ClientProfileEntity profile = clientProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    ClientProfileEntity newProfile = new ClientProfileEntity();
                    newProfile.setUser(user);
                    return newProfile;
                });

        if (request.getCompanyName() != null && !request.getCompanyName().trim().isEmpty()) {
            profile.setCompanyName(request.getCompanyName().trim());
        }
        if (request.getCompanyWebsite() != null) profile.setCompanyWebsite(request.getCompanyWebsite().trim());
        if (request.getIndustry() != null) profile.setIndustry(request.getIndustry().trim());
        if (request.getCompanySize() != null) profile.setCompanySize(request.getCompanySize().trim());
        if (request.getBio() != null) profile.setBio(request.getBio().trim());
        if (request.getLocation() != null) profile.setLocation(request.getLocation().trim());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl().trim());
        if (request.getTaxCode() != null) profile.setTaxCode(request.getTaxCode().trim());

        clientProfileRepository.save(profile);

        return getClientProfileByUserId(userId);
    }

    @Override
    public List<ClientJobHistoryDTO> getClientJobHistory(Long userId) {
        List<ProjectEntity> projects = projectRepository.findByClientId(userId);
        return projects.stream()
                .map(p -> new ClientJobHistoryDTO(
                        p.getId(),
                        p.getTitle(),
                        p.getBudget(),
                        p.getStatus(),
                        p.getCreatedAt(),
                        p.getMaxFreelancers()
                ))
                .collect(Collectors.toList());
    }
}
