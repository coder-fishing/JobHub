package com.example.demo_prj_intern.service;

import com.example.demo_prj_intern.dto.respone.PaymentResponse;
import vn.payos.type.Webhook;

import java.math.BigDecimal;

public interface PaymentService {

    /**
     * Tạo payment link payOS cho Client nạp tiền.
     * Lưu PaymentEntity PENDING và trả về checkoutUrl.
     */
    PaymentResponse createPaymentLink(Long userId, BigDecimal amount);

    /**
     * Xử lý webhook từ payOS (idempotent).
     * Chỉ cộng tiền vào Wallet một lần khi Payment chuyển sang PAID.
     */
    void handleWebhook(Webhook webhookBody);
}
