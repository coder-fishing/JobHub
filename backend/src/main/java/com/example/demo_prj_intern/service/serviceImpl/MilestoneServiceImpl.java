package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.dto.request.MilestoneRequest;
import com.example.demo_prj_intern.dto.request.MilestoneSubmissionRequest;
import com.example.demo_prj_intern.dto.respone.MilestoneResponse;
import com.example.demo_prj_intern.dto.respone.MilestoneSubmissionResponse;
import com.example.demo_prj_intern.entity.ContractEntity;
import com.example.demo_prj_intern.entity.MilestoneEntity;
import com.example.demo_prj_intern.entity.MilestoneSubmissionEntity;
import com.example.demo_prj_intern.repository.ContractRepository;
import com.example.demo_prj_intern.repository.MilestoneRepository;
import com.example.demo_prj_intern.repository.MilestoneSubmissionRepository;
import com.example.demo_prj_intern.service.EscrowService;
import com.example.demo_prj_intern.service.MilestoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MilestoneServiceImpl implements MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final MilestoneSubmissionRepository milestoneSubmissionRepository;
    private final ContractRepository contractRepository;
    @Lazy
    private final EscrowService escrowService;

    @Override
    @Transactional
    public MilestoneResponse createMilestone(Long clientId, MilestoneRequest request) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID không được để trống");
        }
        if (request == null) {
            throw new IllegalArgumentException("Nội dung yêu cầu không được để trống");
        }
        if (request.getContractId() == null) {
            throw new IllegalArgumentException("Contract ID không được để trống");
        }
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Tiêu đề cột mốc không được để trống");
        }
        if (request.getAmount() == null || request.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền cột mốc phải lớn hơn 0");
        }

        // Kiểm tra hợp đồng
        ContractEntity contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng với ID: " + request.getContractId()));

        // Kiểm tra quyền chủ hợp đồng (Client)
        if (contract.getClient() == null || !clientId.equals(contract.getClient().getId())) {
            throw new IllegalArgumentException("Bạn không phải chủ hợp đồng này để tạo cột mốc công việc");
        }

        // Tạo cột mốc mới
        MilestoneEntity milestone = new MilestoneEntity();
        milestone.setContract(contract);
        milestone.setTitle(request.getTitle().trim());
        milestone.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        milestone.setAmount(request.getAmount());
        milestone.setDeadline(request.getDeadline());
        milestone.setStatus("PENDING"); // Trạng thái mặc định: Chờ làm/chờ nộp

        MilestoneEntity savedMilestone = milestoneRepository.save(milestone);
        return mapToResponse(savedMilestone);
    }

    @Override
    public List<MilestoneResponse> getMilestonesByContractId(Long contractId) {
        if (contractId == null) {
            throw new IllegalArgumentException("Contract ID không được để trống");
        }
        if (!contractRepository.existsById(contractId)) {
            throw new RuntimeException("Không tìm thấy hợp đồng với ID: " + contractId);
        }
        return milestoneRepository.findByContractId(contractId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MilestoneResponse getMilestoneById(Long milestoneId) {
        if (milestoneId == null) {
            throw new IllegalArgumentException("Milestone ID không được để trống");
        }
        MilestoneEntity milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cột mốc với ID: " + milestoneId));
        return mapToResponse(milestone);
    }

    @Override
    @Transactional
    public MilestoneSubmissionResponse submitMilestoneWork(Long freelancerId, MilestoneSubmissionRequest request) {
        if (freelancerId == null) {
            throw new IllegalArgumentException("Freelancer ID không được để trống");
        }
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu nộp bài không được để trống");
        }
        if (request.getMilestoneId() == null) {
            throw new IllegalArgumentException("Milestone ID không được để trống");
        }

        // Tìm cột mốc
        MilestoneEntity milestone = milestoneRepository.findById(request.getMilestoneId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cột mốc với ID: " + request.getMilestoneId()));

        // Kiểm tra Freelancer thực hiện hợp đồng
        ContractEntity contract = milestone.getContract();
        if (contract == null || contract.getFreelancer() == null || !freelancerId.equals(contract.getFreelancer().getId())) {
            throw new IllegalArgumentException("Bạn không phải Freelancer được giao thực hiện hợp đồng này");
        }

        // Cập nhật hoặc tạo bài nộp
        Optional<MilestoneSubmissionEntity> existingSubmission = milestoneSubmissionRepository.findByMilestoneId(milestone.getId());
        MilestoneSubmissionEntity submission = existingSubmission.orElseGet(MilestoneSubmissionEntity::new);

        submission.setMilestone(milestone);
        submission.setFreelancerNote(request.getFreelancerNote() != null ? request.getFreelancerNote().trim() : null);
        submission.setSubmissionUrl(request.getSubmissionUrl() != null ? request.getSubmissionUrl().trim() : null);

        MilestoneSubmissionEntity savedSubmission = milestoneSubmissionRepository.save(submission);

        // Chuyển trạng thái cột mốc sang SUBMITTED
        milestone.setStatus("SUBMITTED");
        milestoneRepository.save(milestone);

        return mapToSubmissionResponse(savedSubmission);
    }

    @Override
    @Transactional
    public MilestoneResponse releaseMilestone(Long clientId, Long milestoneId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID không được để trống");
        }
        if (milestoneId == null) {
            throw new IllegalArgumentException("Milestone ID không được để trống");
        }

        MilestoneEntity milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cột mốc với ID: " + milestoneId));

        ContractEntity contract = milestone.getContract();
        if (contract == null || contract.getClient() == null || !clientId.equals(contract.getClient().getId())) {
            throw new IllegalArgumentException("Bạn không có quyền nghiệm thu cột mốc này");
        }

        // Idempotency: đã RELEASED rồi thì báo lỗi
        if ("RELEASED".equals(milestone.getStatus())) {
            throw new IllegalArgumentException("Cột mốc này đã được nghiệm thu trước đó rồi");
        }

        // Freelancer phải đã nộp bài
        if (!"SUBMITTED".equals(milestone.getStatus())) {
            throw new IllegalArgumentException(
                    "Cột mốc phải ở trạng thái SUBMITTED để nghiệm thu (hiện tại: " + milestone.getStatus() + ")");
        }

        // Chuyển trạng thái cột mốc sang RELEASED trước
        milestone.setStatus("RELEASED");
        MilestoneEntity savedMilestone = milestoneRepository.save(milestone);

        // Sau khi save, gọi EscrowService để credit Freelancer wallet
        // EscrowService.releaseMilestone sẽ kiểm tra idempotency bên trong
        escrowService.releaseMilestone(milestoneId);

        return mapToResponse(savedMilestone);
    }

    // === HÀM CONVERT ENTITY -> RESPONSE DTO ===
    private MilestoneResponse mapToResponse(MilestoneEntity entity) {
        MilestoneResponse response = new MilestoneResponse();
        response.setId(entity.getId());
        if (entity.getContract() != null) {
            response.setContractId(entity.getContract().getId());
        }
        response.setTitle(entity.getTitle());
        response.setDescription(entity.getDescription());
        response.setAmount(entity.getAmount());
        response.setDeadline(entity.getDeadline());
        response.setStatus(entity.getStatus());
        response.setCreatedAt(entity.getCreatedAt());

        // Lấy bài nộp đính kèm nếu có
        milestoneSubmissionRepository.findByMilestoneId(entity.getId())
                .ifPresent(sub -> response.setSubmission(mapToSubmissionResponse(sub)));

        return response;
    }

    private MilestoneSubmissionResponse mapToSubmissionResponse(MilestoneSubmissionEntity entity) {
        MilestoneSubmissionResponse response = new MilestoneSubmissionResponse();
        response.setId(entity.getId());
        if (entity.getMilestone() != null) {
            response.setMilestoneId(entity.getMilestone().getId());
        }
        response.setFreelancerNote(entity.getFreelancerNote());
        response.setSubmissionUrl(entity.getSubmissionUrl());
        response.setSubmittedAt(entity.getSubmittedAt());
        return response;
    }
}
