package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.dto.request.WithdrawalRequest;
import com.example.demo_prj_intern.dto.respone.WithdrawalResponse;
import com.example.demo_prj_intern.entity.ContractEntity;
import com.example.demo_prj_intern.entity.UserEntity;
import com.example.demo_prj_intern.entity.WithdrawalEntity;
import com.example.demo_prj_intern.repository.ContractRepository;
import com.example.demo_prj_intern.repository.UserRepository;
import com.example.demo_prj_intern.repository.WithdrawalRepository;
import com.example.demo_prj_intern.service.WalletService;
import com.example.demo_prj_intern.service.WithdrawalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class WithdrawalServiceImpl implements WithdrawalService {

    private final WithdrawalRepository withdrawalRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;
    private final WalletService walletService;

    @Override
    @Transactional
    public WithdrawalResponse createWithdrawal(WithdrawalRequest request) {
        if (request == null) throw new IllegalArgumentException("Nội dung yêu cầu không được để trống");
        if (request.getFreelancerId() == null) throw new IllegalArgumentException("Freelancer ID không được để trống");
        if (request.getContractId() == null) throw new IllegalArgumentException("Contract ID không được để trống");
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền rút phải lớn hơn 0");
        }
        if (request.getBankName() == null || request.getBankName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên ngân hàng không được để trống");
        }
        if (request.getBankAccountNumber() == null || request.getBankAccountNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Số tài khoản ngân hàng không được để trống");
        }
        if (request.getAccountHolderName() == null || request.getAccountHolderName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên chủ tài khoản không được để trống");
        }

        UserEntity freelancer = userRepository.findById(request.getFreelancerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng ID: " + request.getFreelancerId()));

        // Chỉ FREELANCER mới được tạo withdrawal
        if (!"FREELANCER".equalsIgnoreCase(freelancer.getRole())) {
            throw new IllegalArgumentException("Chỉ Freelancer mới được yêu cầu rút tiền");
        }

        ContractEntity contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng ID: " + request.getContractId()));

        // Kiểm tra freelancer thuộc contract này
        if (contract.getFreelancer() == null || !request.getFreelancerId().equals(contract.getFreelancer().getId())) {
            throw new IllegalArgumentException("Bạn không phải Freelancer của hợp đồng này");
        }

        // Rule: 1 PENDING per contract
        boolean hasPending = withdrawalRepository
                .findByContractIdAndStatus(request.getContractId(), "PENDING")
                .isPresent();
        if (hasPending) {
            throw new IllegalArgumentException(
                    "Hợp đồng này đang có một yêu cầu rút tiền đang chờ xử lý. " +
                    "Vui lòng chờ Admin xử lý trước khi tạo yêu cầu mới.");
        }

        // Freeze balance: available → freezing
        walletService.freezeBalance(request.getFreelancerId(), request.getAmount());

        // Tạo WithdrawalEntity
        WithdrawalEntity withdrawal = new WithdrawalEntity();
        withdrawal.setUser(freelancer);
        withdrawal.setContract(contract);
        withdrawal.setAmount(request.getAmount());
        withdrawal.setBankName(request.getBankName().trim());
        withdrawal.setBankAccountNumber(request.getBankAccountNumber().trim());
        withdrawal.setAccountHolderName(request.getAccountHolderName().trim());
        withdrawal.setStatus("PENDING");

        WithdrawalEntity saved = withdrawalRepository.save(withdrawal);
        log.info("Withdrawal created: id={}, freelancerId={}, contractId={}, amount={}",
                saved.getId(), request.getFreelancerId(), request.getContractId(), request.getAmount());

        return mapToResponse(saved);
    }

    @Override
    public List<WithdrawalResponse> getMyWithdrawals(Long freelancerId) {
        if (freelancerId == null) throw new IllegalArgumentException("Freelancer ID không được để trống");
        return withdrawalRepository.findByUserIdOrderByCreatedAtDesc(freelancerId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<WithdrawalResponse> getAllWithdrawals(String status) {
        List<WithdrawalEntity> list;
        if (status != null && !status.trim().isEmpty()) {
            list = withdrawalRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
        } else {
            list = withdrawalRepository.findAll();
        }
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WithdrawalResponse approveWithdrawal(Long withdrawalId, Long adminId, String adminNote) {
        WithdrawalEntity withdrawal = getWithdrawalOrThrow(withdrawalId);

        if (!"PENDING".equals(withdrawal.getStatus())) {
            throw new IllegalArgumentException(
                    "Chỉ có thể approve withdrawal ở trạng thái PENDING (hiện tại: " + withdrawal.getStatus() + ")");
        }

        withdrawal.setStatus("APPROVED");
        withdrawal.setAdminNote(adminNote);
        withdrawal.setProcessedAt(LocalDateTime.now());
        WithdrawalEntity saved = withdrawalRepository.save(withdrawal);

        log.info("Withdrawal APPROVED: id={}, adminId={}", withdrawalId, adminId);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public WithdrawalResponse rejectWithdrawal(Long withdrawalId, Long adminId, String adminNote) {
        WithdrawalEntity withdrawal = getWithdrawalOrThrow(withdrawalId);

        // Chỉ PENDING mới được REJECT
        if (!"PENDING".equals(withdrawal.getStatus())) {
            throw new IllegalArgumentException(
                    "Chỉ có thể reject withdrawal ở trạng thái PENDING (hiện tại: " + withdrawal.getStatus() + ")");
        }

        withdrawal.setStatus("REJECTED");
        withdrawal.setAdminNote(adminNote);
        withdrawal.setProcessedAt(LocalDateTime.now());
        withdrawalRepository.save(withdrawal);

        // Hoàn tiền từ freezing → available balance + ghi WalletTransaction WITHDRAWAL_REFUND
        walletService.unfreezeBalance(
                withdrawal.getUser().getId(),
                withdrawal.getAmount(),
                withdrawal.getId()
        );

        log.info("Withdrawal REJECTED: id={}, adminId={}, amount hoàn về={}", withdrawalId, adminId, withdrawal.getAmount());
        return mapToResponse(withdrawal);
    }

    @Override
    @Transactional
    public WithdrawalResponse completeWithdrawal(Long withdrawalId, Long adminId) {
        WithdrawalEntity withdrawal = getWithdrawalOrThrow(withdrawalId);

        // Chỉ APPROVED → COMPLETED
        if (!"APPROVED".equals(withdrawal.getStatus())) {
            throw new IllegalArgumentException(
                    "Chỉ có thể complete withdrawal ở trạng thái APPROVED (hiện tại: " + withdrawal.getStatus() + ")");
        }

        withdrawal.setStatus("COMPLETED");
        withdrawal.setProcessedAt(LocalDateTime.now());
        withdrawalRepository.save(withdrawal);

        // Khấu trừ freezing balance + ghi WalletTransaction WITHDRAWAL
        walletService.deductFreezeBalance(
                withdrawal.getUser().getId(),
                withdrawal.getAmount(),
                withdrawal.getId()
        );

        log.info("Withdrawal COMPLETED: id={}, adminId={}, amount={}", withdrawalId, adminId, withdrawal.getAmount());
        return mapToResponse(withdrawal);
    }

    // ===== HELPERS =====

    private WithdrawalEntity getWithdrawalOrThrow(Long withdrawalId) {
        if (withdrawalId == null) throw new IllegalArgumentException("Withdrawal ID không được để trống");
        return withdrawalRepository.findById(withdrawalId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu rút tiền ID: " + withdrawalId));
    }

    private WithdrawalResponse mapToResponse(WithdrawalEntity entity) {
        WithdrawalResponse response = new WithdrawalResponse();
        response.setId(entity.getId());
        if (entity.getUser() != null) response.setUserId(entity.getUser().getId());
        if (entity.getContract() != null) response.setContractId(entity.getContract().getId());
        response.setAmount(entity.getAmount());
        response.setBankName(entity.getBankName());
        response.setBankAccountNumber(entity.getBankAccountNumber());
        response.setAccountHolderName(entity.getAccountHolderName());
        response.setStatus(entity.getStatus());
        response.setAdminNote(entity.getAdminNote());
        response.setCreatedAt(entity.getCreatedAt());
        response.setProcessedAt(entity.getProcessedAt());
        return response;
    }
}
