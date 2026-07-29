package com.example.demo_prj_intern.controller;

import com.example.demo_prj_intern.dto.request.DepositRequest;
import com.example.demo_prj_intern.dto.respone.WalletResponse;
import com.example.demo_prj_intern.dto.respone.WalletTransactionResponse;
import com.example.demo_prj_intern.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    // 1. Lấy thông tin số dư ví của User
    // URL: GET http://localhost:8080/api/wallet/user/1
    @GetMapping("/user/{userId}")
    public ResponseEntity<WalletResponse> getWalletByUserId(@PathVariable("userId") Long userId) {
        WalletResponse response = walletService.getWalletByUserId(userId);
        return ResponseEntity.ok(response);
    }

    // 2. Nạp tiền vào ví
    // URL: POST http://localhost:8080/api/wallet/deposit
    @PostMapping("/deposit")
    public ResponseEntity<WalletResponse> deposit(@RequestBody(required = false) DepositRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Nội dung Body không được để trống. Cần truyền JSON chứa userId và amount.");
        }
        WalletResponse response = walletService.deposit(request);
        return ResponseEntity.ok(response);
    }

    // 3. Client giải ngân / thanh toán tiền Cột mốc (Milestone) cho Freelancer
    // URL: POST http://localhost:8080/api/wallet/pay-milestone/1?clientId=1
    @PostMapping("/pay-milestone/{milestoneId}")
    public ResponseEntity<WalletResponse> payMilestone(
            @PathVariable("milestoneId") Long milestoneId,
            @RequestParam(value = "clientId", required = false) Long clientId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID là tham số bắt buộc trong URL (Ví dụ: ?clientId=1)");
        }
        WalletResponse response = walletService.payMilestone(clientId, milestoneId);
        return ResponseEntity.ok(response);
    }

    // 4. Xem lịch sử giao dịch ví của User
    // URL: GET http://localhost:8080/api/wallet/transactions/1
    @GetMapping("/transactions/{userId}")
    public ResponseEntity<List<WalletTransactionResponse>> getTransactionsByUserId(@PathVariable("userId") Long userId) {
        List<WalletTransactionResponse> response = walletService.getTransactionsByUserId(userId);
        return ResponseEntity.ok(response);
    }
}
