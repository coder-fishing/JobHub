package com.example.demo_prj_intern.service;

import com.example.demo_prj_intern.dto.request.DepositRequest;
import com.example.demo_prj_intern.dto.respone.WalletResponse;
import com.example.demo_prj_intern.dto.respone.WalletTransactionResponse;

import java.util.List;

public interface WalletService {
    // 1. Lấy thông tin ví của user (nếu chưa có thì tự tạo mới ví 0 VNĐ)
    WalletResponse getWalletByUserId(Long userId);

    // 2. Nạp tiền vào ví của User (DEPOSIT)
    WalletResponse deposit(DepositRequest request);

    // 3. Client giải ngân/thanh toán tiền Cột mốc (Milestone) cho Freelancer
    WalletResponse payMilestone(Long clientId, Long milestoneId);

    // 4. Lấy danh sách lịch sử giao dịch ví của User
    List<WalletTransactionResponse> getTransactionsByUserId(Long userId);
}
