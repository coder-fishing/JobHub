package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.dto.request.DepositRequest;
import com.example.demo_prj_intern.dto.respone.WalletResponse;
import com.example.demo_prj_intern.dto.respone.WalletTransactionResponse;
import com.example.demo_prj_intern.entity.*;
import com.example.demo_prj_intern.repository.*;
import com.example.demo_prj_intern.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final UserRepository userRepository;
    private final MilestoneRepository milestoneRepository;

    @Override
    @Transactional
    public WalletResponse getWalletByUserId(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID không được để trống");
        }
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));

        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> {
                    WalletEntity newWallet = new WalletEntity();
                    newWallet.setUser(user);
                    newWallet.setBalance(BigDecimal.ZERO);
                    newWallet.setFreezingBalance(BigDecimal.ZERO);
                    return walletRepository.save(newWallet);
                });

        return mapToResponse(wallet);
    }

    @Override
    @Transactional
    public WalletResponse deposit(DepositRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Nội dung yêu cầu không được để trống");
        }
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User ID không được để trống");
        }
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền nạp phải lớn hơn 0");
        }

        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + request.getUserId()));

        WalletEntity wallet = walletRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    WalletEntity newWallet = new WalletEntity();
                    newWallet.setUser(user);
                    newWallet.setBalance(BigDecimal.ZERO);
                    newWallet.setFreezingBalance(BigDecimal.ZERO);
                    return walletRepository.save(newWallet);
                });

        // Nạp tiền vào ví
        wallet.setBalance(wallet.getBalance().add(request.getAmount()));
        WalletEntity savedWallet = walletRepository.save(wallet);

        // Ghi lại lịch sử giao dịch nạp tiền
        WalletTransactionEntity transaction = new WalletTransactionEntity();
        transaction.setWallet(savedWallet);
        transaction.setAmount(request.getAmount());
        transaction.setTransactionType("DEPOSIT");
        walletTransactionRepository.save(transaction);

        return mapToResponse(savedWallet);
    }

    @Override
    @Transactional
    public WalletResponse payMilestone(Long clientId, Long milestoneId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID không được để trống");
        }
        if (milestoneId == null) {
            throw new IllegalArgumentException("Milestone ID không được để trống");
        }

        // Tìm cột mốc
        MilestoneEntity milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cột mốc với ID: " + milestoneId));

        ContractEntity contract = milestone.getContract();
        if (contract == null || contract.getClient() == null || !clientId.equals(contract.getClient().getId())) {
            throw new IllegalArgumentException("Bạn không có quyền thanh toán cho cột mốc của hợp đồng này");
        }

        // Đảm bảo trạng thái cột mốc chưa được giải ngân trước đó
        if ("RELEASED".equalsIgnoreCase(milestone.getStatus())) {
            throw new IllegalArgumentException("Cột mốc này đã được thanh toán giải ngân trước đó rồi");
        }

        BigDecimal amountToPay = milestone.getAmount();
        if (amountToPay == null || amountToPay.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền của cột mốc không hợp lệ");
        }

        // Lấy ví Client
        WalletEntity clientWallet = walletRepository.findByUserId(clientId)
                .orElseThrow(() -> new RuntimeException("Chưa khởi tạo ví cho Client ID: " + clientId));

        // Kiểm tra số dư ví Client
        if (clientWallet.getBalance().compareTo(amountToPay) < 0) {
            throw new IllegalArgumentException("Số dư ví của bạn không đủ (" + clientWallet.getBalance() + " VNĐ) để thanh toán cột mốc này (" + amountToPay + " VNĐ). Vui lòng nạp thêm tiền vào ví!");
        }

        // Lấy ví Freelancer
        UserEntity freelancer = contract.getFreelancer();
        if (freelancer == null) {
            throw new RuntimeException("Không tìm thấy thông tin Freelancer trong hợp đồng");
        }

        WalletEntity freelancerWallet = walletRepository.findByUserId(freelancer.getId())
                .orElseGet(() -> {
                    WalletEntity newWallet = new WalletEntity();
                    newWallet.setUser(freelancer);
                    newWallet.setBalance(BigDecimal.ZERO);
                    newWallet.setFreezingBalance(BigDecimal.ZERO);
                    return walletRepository.save(newWallet);
                });

        // 1. Trừ tiền ví Client
        clientWallet.setBalance(clientWallet.getBalance().subtract(amountToPay));
        walletRepository.save(clientWallet);

        // 2. Cộng tiền ví Freelancer
        freelancerWallet.setBalance(freelancerWallet.getBalance().add(amountToPay));
        walletRepository.save(freelancerWallet);

        // 3. Ghi lịch sử giao dịch trừ tiền cho Client
        WalletTransactionEntity clientTx = new WalletTransactionEntity();
        clientTx.setWallet(clientWallet);
        clientTx.setAmount(amountToPay.negate());
        clientTx.setTransactionType("ESCROW_RELEASE");
        clientTx.setReferenceId(milestone.getId());
        walletTransactionRepository.save(clientTx);

        // 4. Ghi lịch sử giao dịch nhận tiền cho Freelancer
        WalletTransactionEntity freelancerTx = new WalletTransactionEntity();
        freelancerTx.setWallet(freelancerWallet);
        freelancerTx.setAmount(amountToPay);
        freelancerTx.setTransactionType("ESCROW_RELEASE");
        freelancerTx.setReferenceId(milestone.getId());
        walletTransactionRepository.save(freelancerTx);

        // 5. Cập nhật trạng thái Milestone sang RELEASED
        milestone.setStatus("RELEASED");
        milestoneRepository.save(milestone);

        return mapToResponse(clientWallet);
    }

    @Override
    public List<WalletTransactionResponse> getTransactionsByUserId(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID không được để trống");
        }
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ví cho User ID: " + userId));

        return walletTransactionRepository.findByWalletId(wallet.getId()).stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    // ===== HELPER: Map entity sang response =====
    private WalletResponse mapToResponse(WalletEntity entity) {
        WalletResponse response = new WalletResponse();
        response.setWalletId(entity.getId());
        if (entity.getUser() != null) {
            response.setUserId(entity.getUser().getId());
        }
        response.setBalance(entity.getBalance());
        response.setFreezingBalance(entity.getFreezingBalance());
        response.setStatus(entity.getStatus());
        return response;
    }

    private WalletTransactionResponse mapToTransactionResponse(WalletTransactionEntity entity) {
        WalletTransactionResponse response = new WalletTransactionResponse();
        response.setId(entity.getId());
        if (entity.getWallet() != null) {
            response.setWalletId(entity.getWallet().getId());
        }
        response.setAmount(entity.getAmount());
        response.setBalanceBefore(entity.getBalanceBefore());
        response.setBalanceAfter(entity.getBalanceAfter());
        response.setTransactionType(entity.getTransactionType());
        response.setReferenceType(entity.getReferenceType());
        response.setReferenceId(entity.getReferenceId());
        response.setCreatedAt(entity.getCreatedAt());
        return response;
    }

    // ===== INTERNAL HELPERS =====

    /**
     * Cộng tiền vào available balance (balance) của user.
     * Tự khởi tạo Wallet nếu chưa có.
     * Ghi WalletTransaction với amount dương.
     */
    @Override
    @Transactional
    public void creditWallet(Long userId, BigDecimal amount, String txType, String refType, Long refId) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền cộng phải lớn hơn 0");
        }
        WalletEntity wallet = getOrCreateWallet(userId);

        BigDecimal before = wallet.getBalance();
        wallet.setBalance(before.add(amount));
        walletRepository.save(wallet);

        recordTransaction(wallet, txType, amount, before, wallet.getBalance(), refType, refId);
    }

    /**
     * Trừ tiền từ available balance (balance) của user.
     * Throw nếu wallet không ACTIVE hoặc balance không đủ.
     * Ghi WalletTransaction với amount âm.
     */
    @Override
    @Transactional
    public void debitWallet(Long userId, BigDecimal amount, String txType, String refType, Long refId) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền trừ phải lớn hơn 0");
        }
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Chưa có ví cho userId: " + userId + ". Vui lòng nạp tiền trước."));

        if (!"ACTIVE".equals(wallet.getStatus())) {
            throw new IllegalArgumentException("Ví của bạn đang bị khóa (FROZEN), không thể thực hiện giao dịch.");
        }
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Số dư không đủ. Hiện có: " + wallet.getBalance() + " VNĐ, cần: " + amount + " VNĐ");
        }

        BigDecimal before = wallet.getBalance();
        wallet.setBalance(before.subtract(amount));
        walletRepository.save(wallet);

        recordTransaction(wallet, txType, amount.negate(), before, wallet.getBalance(), refType, refId);
    }

    /**
     * Chuyển từ available balance sang freezing balance khi tạo Withdrawal.
     */
    @Override
    @Transactional
    public void freezeBalance(Long userId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền phải lớn hơn 0");
        }
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ví cho userId: " + userId));

        if (!"ACTIVE".equals(wallet.getStatus())) {
            throw new IllegalArgumentException("Ví đang bị khóa (FROZEN)");
        }
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Số dư không đủ để yêu cầu rút. Hiện có: " + wallet.getBalance() + " VNĐ");
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setFreezingBalance(wallet.getFreezingBalance().add(amount));
        walletRepository.save(wallet);
    }

    /**
     * Hoàn trả từ freezing balance về available balance khi Withdrawal bị REJECTED.
     * Ghi WalletTransaction WITHDRAWAL_REFUND.
     */
    @Override
    @Transactional
    public void unfreezeBalance(Long userId, BigDecimal amount, Long withdrawalId) {
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ví cho userId: " + userId));

        BigDecimal before = wallet.getBalance();
        wallet.setBalance(before.add(amount));
        wallet.setFreezingBalance(wallet.getFreezingBalance().subtract(amount));
        walletRepository.save(wallet);

        recordTransaction(wallet, "WITHDRAWAL_REFUND", amount, before, wallet.getBalance(), "WITHDRAWAL", withdrawalId);
    }

    /**
     * Khấu trừ freezing balance khi Withdrawal COMPLETED (chuyển khoản thật đã xảy ra).
     * Ghi WalletTransaction WITHDRAWAL.
     */
    @Override
    @Transactional
    public void deductFreezeBalance(Long userId, BigDecimal amount, Long withdrawalId) {
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ví cho userId: " + userId));

        BigDecimal freezeBefore = wallet.getFreezingBalance();
        wallet.setFreezingBalance(freezeBefore.subtract(amount));
        walletRepository.save(wallet);

        // Ghi transaction với balance = freezingBalance (không ảnh hưởng available)
        recordTransaction(wallet, "WITHDRAWAL", amount.negate(), wallet.getBalance(), wallet.getBalance(), "WITHDRAWAL", withdrawalId);
    }

    /**
     * Lấy hoặc khởi tạo Wallet cho user.
     */
    @Override
    @Transactional
    public WalletEntity getOrCreateWallet(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));
        return walletRepository.findByUserId(userId).orElseGet(() -> {
            WalletEntity newWallet = new WalletEntity();
            newWallet.setUser(user);
            newWallet.setBalance(BigDecimal.ZERO);
            newWallet.setFreezingBalance(BigDecimal.ZERO);
            newWallet.setStatus("ACTIVE");
            return walletRepository.save(newWallet);
        });
    }

    /**
     * Tạo WalletTransactionEntity và lưu vào DB.
     */
    private void recordTransaction(WalletEntity wallet, String txType, BigDecimal amount,
                                   BigDecimal balanceBefore, BigDecimal balanceAfter,
                                   String refType, Long refId) {
        WalletTransactionEntity tx = new WalletTransactionEntity();
        tx.setWallet(wallet);
        tx.setTransactionType(txType);
        tx.setAmount(amount);
        tx.setBalanceBefore(balanceBefore);
        tx.setBalanceAfter(balanceAfter);
        tx.setReferenceType(refType);
        tx.setReferenceId(refId);
        walletTransactionRepository.save(tx);
    }
}
