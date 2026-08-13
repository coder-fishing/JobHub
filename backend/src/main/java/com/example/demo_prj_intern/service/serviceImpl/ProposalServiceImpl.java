package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.dto.request.ProposalRequest;
import com.example.demo_prj_intern.dto.respone.ProposalResponse;
import com.example.demo_prj_intern.entity.FreelancerProfileEntity;
import com.example.demo_prj_intern.entity.ProjectEntity;
import com.example.demo_prj_intern.entity.ProposalEntity;
import com.example.demo_prj_intern.entity.UserEntity;
import com.example.demo_prj_intern.repository.FreelancerProfileRepository;
import com.example.demo_prj_intern.repository.ProjectRepository;
import com.example.demo_prj_intern.repository.ProposalRepository;
import com.example.demo_prj_intern.repository.UserRepository;
import com.example.demo_prj_intern.service.ProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProposalServiceImpl implements ProposalService {

    private final ProposalRepository proposalRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;

    @Override
    @Transactional
    public ProposalResponse applyToProject(ProposalRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Yêu cầu không được để trống");
        }
        if (request.getProjectId() == null) {
            throw new IllegalArgumentException("Mã dự án không được để trống");
        }
        if (request.getFreelancerId() == null) {
            throw new IllegalArgumentException("Mã freelancer không được để trống");
        }
        if (request.getProposedPrice() == null || request.getProposedPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Giá đề xuất phải lớn hơn 0");
        }
        if (request.getEstimatedDays() == null || request.getEstimatedDays() <= 0) {
            throw new IllegalArgumentException("Thời gian hoàn thành ước lượng phải lớn hơn 0 ngày");
        }
        if (request.getCoverLetter() == null || request.getCoverLetter().trim().isEmpty()) {
            throw new IllegalArgumentException("Thư giới thiệu không được để trống");
        }

        // Kiểm tra dự án tồn tại
        ProjectEntity project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dự án với ID: " + request.getProjectId()));

        // Chỉ cho phép apply khi dự án ở trạng thái OPEN
        if (!"OPEN".equalsIgnoreCase(project.getStatus())) {
            throw new IllegalArgumentException("Dự án hiện tại không còn nhận hồ sơ ứng tuyển (Trạng thái: " + project.getStatus() + ")");
        }

        // Kiểm tra freelancer tồn tại
        UserEntity freelancer = userRepository.findById(request.getFreelancerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy freelancer với ID: " + request.getFreelancerId()));

        // Kiểm tra đúng vai trò freelancer và đang active
        if (!"FREELANCER".equalsIgnoreCase(freelancer.getRole())) {
            throw new IllegalArgumentException("Chỉ tài khoản FREELANCER mới được phép ứng tuyển dự án");
        }
        if (!"ACTIVE".equalsIgnoreCase(freelancer.getStatus())) {
            throw new IllegalArgumentException("Tài khoản freelancer của bạn đang bị khóa hoặc không hoạt động");
        }

        // Kiểm tra xem freelancer đã ứng tuyển dự án này trước đó chưa
        proposalRepository.findByProjectIdAndFreelancerId(request.getProjectId(), request.getFreelancerId())
                .ifPresent(p -> {
                    throw new IllegalArgumentException("Bạn đã gửi hồ sơ ứng tuyển cho dự án này rồi!");
                });

        // Tạo hồ sơ ứng tuyển mới
        ProposalEntity proposal = new ProposalEntity();
        proposal.setProject(project);
        proposal.setFreelancer(freelancer);
        proposal.setProposedPrice(request.getProposedPrice());
        proposal.setEstimatedDays(request.getEstimatedDays());
        proposal.setCoverLetter(request.getCoverLetter() != null ? request.getCoverLetter().trim() : null);
        proposal.setStatus("PENDING"); // Trạng thái mặc định

        try {
            ProposalEntity savedProposal = proposalRepository.saveAndFlush(proposal);
            return mapToResponse(savedProposal);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Bạn đã gửi hồ sơ ứng tuyển cho dự án này rồi!");
        }
    }

    @Override
    public List<ProposalResponse> getProposalsByProject(Long clientId, Long projectId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID không được để trống");
        }
        if (projectId == null) {
            throw new IllegalArgumentException("Project ID không được để trống");
        }

        // Kiểm tra dự án
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dự án với ID: " + projectId));

        // Kiểm tra quyền sở hữu dự án: Chỉ Client tạo dự án mới được xem danh sách apply
        if (project.getClient() == null || !clientId.equals(project.getClient().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền xem danh sách ứng tuyển của dự án này");
        }

        return proposalRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProposalResponse> getClientProposals(Long clientId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID không được để trống");
        }
        
        // Find all projects owned by the client
        List<ProjectEntity> clientProjects = projectRepository.findAll().stream()
                .filter(p -> p.getClient() != null && p.getClient().getId().equals(clientId))
                .collect(Collectors.toList());
                
        List<Long> projectIds = clientProjects.stream()
                .map(ProjectEntity::getId)
                .collect(Collectors.toList());
                
        return proposalRepository.findAll().stream()
                .filter(p -> p.getProject() != null && projectIds.contains(p.getProject().getId()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProposalResponse> getProposalsByFreelancer(Long freelancerId) {
        if (freelancerId == null) {
            throw new IllegalArgumentException("Freelancer ID không được để trống");
        }
        if (!userRepository.existsById(freelancerId)) {
            throw new RuntimeException("Không tìm thấy Freelancer với ID: " + freelancerId);
        }
        return proposalRepository.findByFreelancerId(freelancerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProposalResponse acceptProposal(Long clientId, Long proposalId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID không được để trống");
        }
        if (proposalId == null) {
            throw new IllegalArgumentException("Proposal ID không được để trống");
        }

        // Tìm hồ sơ ứng tuyển
        ProposalEntity proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ ứng tuyển với ID: " + proposalId));

        // Kiểm tra trạng thái hồ sơ phải đang là PENDING
        if (!"PENDING".equalsIgnoreCase(proposal.getStatus())) {
            throw new IllegalArgumentException("Hồ sơ này đã được xử lý trước đó (Trạng thái hiện tại: " + proposal.getStatus() + ")");
        }

        ProjectEntity project = proposal.getProject();
        // Kiểm tra quyền sở hữu dự án
        if (project.getClient() == null || !clientId.equals(project.getClient().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không phải chủ sở hữu dự án này để duyệt hồ sơ");
        }

        // Phải đảm bảo dự án đang OPEN
        if (!"OPEN".equalsIgnoreCase(project.getStatus())) {
            throw new IllegalArgumentException("Dự án này hiện tại không ở trạng thái OPEN để duyệt (Trạng thái hiện tại: " + project.getStatus() + ")");
        }

        // 1. Chấp nhận hồ sơ được chọn
        proposal.setStatus("ACCEPTED");
        proposalRepository.save(proposal);

        // 2. Đếm số lượng hồ sơ đã được nhận cho dự án này
        List<ProposalEntity> allProposals = proposalRepository.findByProjectId(project.getId());
        long acceptedCount = allProposals.stream()
                .filter(p -> "ACCEPTED".equalsIgnoreCase(p.getStatus()))
                .count();

        int maxFreelancers = (project.getMaxFreelancers() != null && project.getMaxFreelancers() > 0) 
                ? project.getMaxFreelancers() : 1;

        // Nếu số lượng hồ sơ đã nhận đạt hoặc vượt chỉ tiêu maxFreelancers
        if (acceptedCount >= maxFreelancers) {
            // Chuyển trạng thái dự án sang IN_PROGRESS (Ngừng nhận thêm)
            project.setStatus("IN_PROGRESS");
            projectRepository.save(project);

            // Tự động từ chối tất cả các hồ sơ PENDING còn lại
            for (ProposalEntity p : allProposals) {
                if ("PENDING".equalsIgnoreCase(p.getStatus())) {
                    p.setStatus("REJECTED");
                    proposalRepository.save(p);
                }
            }
        }

        return mapToResponse(proposal);
    }

    @Override
    @Transactional
    public ProposalResponse rejectProposal(Long clientId, Long proposalId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID không được để trống");
        }
        if (proposalId == null) {
            throw new IllegalArgumentException("Proposal ID không được để trống");
        }

        // Tìm hồ sơ ứng tuyển
        ProposalEntity proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ ứng tuyển với ID: " + proposalId));

        // Kiểm tra trạng thái hồ sơ
        if (!"PENDING".equalsIgnoreCase(proposal.getStatus())) {
            throw new IllegalArgumentException("Hồ sơ này đã được xử lý trước đó (Trạng thái hiện tại: " + proposal.getStatus() + ")");
        }

        // Kiểm tra quyền sở hữu dự án
        ProjectEntity project = proposal.getProject();
        if (project.getClient() == null || !clientId.equals(project.getClient().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền từ chối hồ sơ của dự án này");
        }

        // Đánh dấu từ chối hồ sơ
        proposal.setStatus("REJECTED");
        ProposalEntity savedProposal = proposalRepository.save(proposal);
        return mapToResponse(savedProposal);
    }

    // === HÀM CONVERT ENTITY -> RESPONSE DTO ===
    private ProposalResponse mapToResponse(ProposalEntity entity) {
        ProposalResponse response = new ProposalResponse();
        response.setId(entity.getId());
        if (entity.getProject() != null) {
            response.setProjectId(entity.getProject().getId());
            response.setProjectTitle(entity.getProject().getTitle());
        }
        if (entity.getFreelancer() != null) {
            response.setFreelancerId(entity.getFreelancer().getId());
            
            // Lấy tên đầy đủ của freelancer từ FreelancerProfile nếu có, nếu không lấy Email
            String name = freelancerProfileRepository.findByUserId(entity.getFreelancer().getId())
                    .map(FreelancerProfileEntity::getFullName)
                    .orElse(entity.getFreelancer().getEmail());
            response.setFreelancerName(name);
        }
        response.setProposedPrice(entity.getProposedPrice());
        response.setEstimatedDays(entity.getEstimatedDays());
        response.setCoverLetter(entity.getCoverLetter());
        response.setStatus(entity.getStatus());
        response.setCreatedAt(entity.getCreatedAt());
        return response;
    }
}
