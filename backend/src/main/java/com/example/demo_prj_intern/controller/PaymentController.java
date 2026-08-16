package com.example.demo_prj_intern.controller;

import com.example.demo_prj_intern.dto.request.DepositRequest;
import com.example.demo_prj_intern.dto.respone.PaymentResponse;
import com.example.demo_prj_intern.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.payos.type.Webhook;

import java.util.Map;

/**
 * Controller xử lý nạp tiền qua payOS.
 * POST /api/payments/create  — Client tạo link thanh toán
 * POST /api/payments/webhook — payOS gửi kết quả giao dịch (không cần JWT, đã permitAll)
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Client tạo link nạp tiền vào ví.
     * URL: POST http://localhost:8080/api/payments/create?userId=1
     * Body: { "userId": 1, "amount": 100000 }
     */
    @PostMapping("/create")
    public ResponseEntity<?> createPayment(
            @RequestBody(required = false) DepositRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Body không được để trống. Cần truyền JSON chứa userId và amount.");
        }
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("userId là tham số bắt buộc");
        }
        if (request.getAmount() == null) {
            throw new IllegalArgumentException("amount là tham số bắt buộc");
        }
        PaymentResponse response = paymentService.createPaymentLink(request.getUserId(), request.getAmount());
        return ResponseEntity.ok(response);
    }

    /**
     * Webhook endpoint nhận kết quả thanh toán từ payOS.
     * Không yêu cầu JWT — đã cấu hình permitAll trong SecurityConfig.
     * Idempotent: gọi nhiều lần với cùng orderCode chỉ cộng tiền một lần.
     */
    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Object>> handleWebhook(@RequestBody Webhook webhookBody) {
        log.info("payOS webhook received");
        paymentService.handleWebhook(webhookBody);
        return ResponseEntity.ok(Map.of("success", true));
    }
}