package com.example.demo_prj_intern.service;

import com.example.demo_prj_intern.dto.request.WithdrawalRequest;
import com.example.demo_prj_intern.dto.respone.WithdrawalResponse;

import java.util.List;

public interface WithdrawalService {

    /**
     * Freelancer tạo yêu cầu rút tiền.
     * Rule: chỉ 1 PENDING per contract tại một thời điểm.
     * Freeze amount từ available → freezing balance.
     */
    WithdrawalResponse createWithdrawal(WithdrawalRequest request);

    /**
     * Freelancer xem danh sách withdrawal của mình.
     */
    List<WithdrawalResponse> getMyWithdrawals(Long freelancerId);

    // ===== ADMIN ACTIONS =====

    /**
     * Admin xem tất cả withdrawals, có thể filter theo status.
     */
    List<WithdrawalResponse> getAllWithdrawals(String status);

    /**
     * Admin approve withdrawal: PENDING → APPROVED.
     * Không chuyển khoản thật — chỉ đánh dấu đã duyệt.
     */
    WithdrawalResponse approveWithdrawal(Long withdrawalId, Long adminId, String adminNote);

    /**
     * Admin reject withdrawal: PENDING → REJECTED.
     * Hoàn tiền từ freezing → available balance.
     * Ghi WalletTransaction WITHDRAWAL_REFUND.
     */
    WithdrawalResponse rejectWithdrawal(Long withdrawalId, Long adminId, String adminNote);

    /**
     * Admin complete withdrawal: APPROVED → COMPLETED.
     * Admin đã chuyển khoản thật thủ công, đánh dấu đã hoàn tất.
     * Khấu trừ freezing balance.
     * Ghi WalletTransaction WITHDRAWAL.
     */
    WithdrawalResponse completeWithdrawal(Long withdrawalId, Long adminId);
}
