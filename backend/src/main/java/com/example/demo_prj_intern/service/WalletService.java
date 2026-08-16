package com.example.demo_prj_intern.service;

import com.example.demo_prj_intern.dto.request.DepositRequest;
import com.example.demo_prj_intern.dto.respone.WalletResponse;
import com.example.demo_prj_intern.dto.respone.WalletTransactionResponse;

import java.util.List;

public interface WalletService {
    // 1. Lấy thông tin ví của user (nếu chưa có thì tự tạo mới ví 0 VNĐ)
    WalletResponse getWalletByUserId(Long userId);

    // 2. Nạp tiền vào ví của User (DEPOSIT) — cũ giữ lại cho WalletController/direct deposit
    WalletResponse deposit(DepositRequest request);

    // 3. Client giải ngân/thanh toán tiền Cột mốc (Milestone) cho Freelancer (direct)
    WalletResponse payMilestone(Long clientId, Long milestoneId);

    // 4. Lấy danh sách lịch sử giao dịch ví của User
    List<WalletTransactionResponse> getTransactionsByUserId(Long userId);

    // ===== INTERNAL HELPERS — dùng bởi PaymentService, EscrowService, WithdrawalService =====

    /**
     * Cộng tiền vào available balance của user.
     * Tự động khởi tạo Wallet nếu chưa có.
     * Ghi WalletTransaction.
     *
     * @param userId       user nhận tiền
     * @param amount       số tiền cộng (dương)
     * @param txType       loại giao dịch: DEPOSIT, ESCROW_RELEASE, WITHDRAWAL_REFUND
     * @param refType      loại reference: PAYMENT, MILESTONE, WITHDRAWAL
     * @param refId        id của entity tương ứng
     */
    void creditWallet(Long userId, java.math.BigDecimal amount, String txType, String refType, Long refId);

    /**
     * Trừ tiền từ available balance của user.
     * Throw nếu balance không đủ hoặc wallet không ACTIVE.
     * Ghi WalletTransaction.
     *
     * @param userId       user bị trừ tiền
     * @param amount       số tiền trừ (dương — sẽ được lưu với giá trị âm)
     * @param txType       loại giao dịch: ESCROW_HOLD
     * @param refType      loại reference: CONTRACT
     * @param refId        id của entity tương ứng
     */
    void debitWallet(Long userId, java.math.BigDecimal amount, String txType, String refType, Long refId);

    /**
     * Chuyển tiền từ available balance sang freezing balance (khi tạo Withdrawal).
     * Throw nếu balance không đủ.
     */
    void freezeBalance(Long userId, java.math.BigDecimal amount);

    /**
     * Hoàn trả tiền từ freezing balance về available balance (khi Withdrawal bị REJECTED).
     */
    void unfreezeBalance(Long userId, java.math.BigDecimal amount, Long withdrawalId);

    /**
     * Khấu trừ freezing balance khi Withdrawal được COMPLETED.
     */
    void deductFreezeBalance(Long userId, java.math.BigDecimal amount, Long withdrawalId);

    /**
     * Lấy hoặc khởi tạo Wallet Entity (internal use).
     */
    com.example.demo_prj_intern.entity.WalletEntity getOrCreateWallet(Long userId);
}
