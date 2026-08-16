package com.example.demo_prj_intern.controller;

import com.example.demo_prj_intern.dto.request.WithdrawalRequest;
import com.example.demo_prj_intern.dto.respone.WithdrawalResponse;
import com.example.demo_prj_intern.service.WithdrawalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller quản lý yêu cầu rút tiền.
 *
 * Freelancer:
 *   POST /api/withdrawal/create          — Tạo yêu cầu rút tiền
 *   GET  /api/withdrawal/my?freelancerId= — Xem danh sách withdrawal của mình
 *
 * Admin:
 *   GET  /api/withdrawal/admin/list?status= — Xem tất cả (có thể filter)
 *   POST /api/withdrawal/admin/{id}/approve?adminId= — Approve
 *   POST /api/withdrawal/admin/{id}/reject?adminId=&note= — Reject
 *   POST /api/withdrawal/admin/{id}/complete?adminId= — Complete
 */
@RestController
@RequestMapping("/api/withdrawal")
@RequiredArgsConstructor
public class WithdrawalController {

    private final WithdrawalService withdrawalService;

    // Freelancer tạo yêu cầu rút tiền
    @PostMapping("/create")
    public ResponseEntity<WithdrawalResponse> createWithdrawal(@RequestBody WithdrawalRequest request) {
        WithdrawalResponse response = withdrawalService.createWithdrawal(request);
        return ResponseEntity.ok(response);
    }

    // Freelancer xem danh sách withdrawal của mình
    @GetMapping("/my")
    public ResponseEntity<List<WithdrawalResponse>> getMyWithdrawals(
            @RequestParam(value = "freelancerId") Long freelancerId) {
        return ResponseEntity.ok(withdrawalService.getMyWithdrawals(freelancerId));
    }

    // ===== ADMIN ENDPOINTS =====

    // Admin xem tất cả withdrawals (filter theo status nếu có)
    // URL: GET /api/withdrawal/admin/list?status=PENDING
    @GetMapping("/admin/list")
    public ResponseEntity<List<WithdrawalResponse>> getAllWithdrawals(
            @RequestParam(value = "status", required = false) String status) {
        return ResponseEntity.ok(withdrawalService.getAllWithdrawals(status));
    }

    // Admin approve
    // URL: POST /api/withdrawal/admin/1/approve?adminId=1&note=OK
    @PostMapping("/admin/{id}/approve")
    public ResponseEntity<WithdrawalResponse> approveWithdrawal(
            @PathVariable("id") Long withdrawalId,
            @RequestParam(value = "adminId") Long adminId,
            @RequestParam(value = "note", required = false) String note) {
        WithdrawalResponse response = withdrawalService.approveWithdrawal(withdrawalId, adminId, note);
        return ResponseEntity.ok(response);
    }

    // Admin reject (hoàn tiền về ví)
    // URL: POST /api/withdrawal/admin/1/reject?adminId=1&note=Thông tin không hợp lệ
    @PostMapping("/admin/{id}/reject")
    public ResponseEntity<WithdrawalResponse> rejectWithdrawal(
            @PathVariable("id") Long withdrawalId,
            @RequestParam(value = "adminId") Long adminId,
            @RequestParam(value = "note", required = false) String note) {
        WithdrawalResponse response = withdrawalService.rejectWithdrawal(withdrawalId, adminId, note);
        return ResponseEntity.ok(response);
    }

    // Admin complete (đã chuyển khoản thật thủ công)
    // URL: POST /api/withdrawal/admin/1/complete?adminId=1
    @PostMapping("/admin/{id}/complete")
    public ResponseEntity<WithdrawalResponse> completeWithdrawal(
            @PathVariable("id") Long withdrawalId,
            @RequestParam(value = "adminId") Long adminId) {
        WithdrawalResponse response = withdrawalService.completeWithdrawal(withdrawalId, adminId);
        return ResponseEntity.ok(response);
    }
}
