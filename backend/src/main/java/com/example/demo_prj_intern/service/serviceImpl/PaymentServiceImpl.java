package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.dto.respone.PaymentResponse;
import com.example.demo_prj_intern.entity.PaymentEntity;
import com.example.demo_prj_intern.entity.UserEntity;
import com.example.demo_prj_intern.repository.PaymentRepository;
import com.example.demo_prj_intern.repository.UserRepository;
import com.example.demo_prj_intern.service.PaymentService;
import com.example.demo_prj_intern.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {

    private final PayOS payOS;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final WalletService walletService;

    @Value("${app.frontend.redirect-uri:http://localhost:3000}")
    private String frontendBaseUrl;

    @Override
    @Transactional
    public PaymentResponse createPaymentLink(Long userId, BigDecimal amount) {
        if (userId == null) throw new IllegalArgumentException("User ID không được để trống");
        if (amount == null || amount.compareTo(BigDecimal.valueOf(1000)) < 0) {
            throw new IllegalArgumentException("Số tiền nạp tối thiểu là 1.000 VNĐ");
        }

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));

        // Tạo orderCode duy nhất
        long orderCode = System.currentTimeMillis();

        // Đảm bảo không trùng orderCode (cực kỳ hiếm nhưng safe)
        while (paymentRepository.findByOrderCode(orderCode).isPresent()) {
            orderCode = System.currentTimeMillis() + (long)(Math.random() * 1000);
        }

        // Tạo PaymentEntity PENDING trước khi gọi payOS (để có thể track nếu payOS lỗi)
        PaymentEntity payment = new PaymentEntity();
        payment.setUser(user);
        payment.setOrderCode(orderCode);
        payment.setAmount(amount);
        payment.setStatus("PENDING");
        payment.setDescription("Nap tien vao vi");
        paymentRepository.save(payment);

        try {
            // Gọi payOS v2 API
            CreatePaymentLinkRequest paymentLinkRequest = CreatePaymentLinkRequest.builder()
                    .orderCode(orderCode)
                    .amount(amount.longValue())
                    .description("Nap tien vao vi")
                    .returnUrl(frontendBaseUrl + "/payment/success")
                    .cancelUrl(frontendBaseUrl + "/payment/cancel")
                    .build();

            var responseData = payOS.paymentRequests().create(paymentLinkRequest);

            // Lưu checkoutUrl vào payment
            String checkoutUrl = responseData.getCheckoutUrl();
            payment.setCheckoutUrl(checkoutUrl);
            paymentRepository.save(payment);

            // Map sang response
            PaymentResponse response = new PaymentResponse();
            response.setPaymentId(payment.getId());
            response.setUserId(userId);
            response.setOrderCode(orderCode);
            response.setAmount(amount);
            response.setStatus("PENDING");
            response.setCheckoutUrl(checkoutUrl);
            response.setCreatedAt(payment.getCreatedAt());
            return response;

        } catch (Exception e) {
            // Nếu payOS lỗi, đánh dấu payment FAILED
            payment.setStatus("FAILED");
            paymentRepository.save(payment);
            throw new RuntimeException("Không thể tạo link thanh toán payOS: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void handleWebhook(Webhook webhookBody) {
        try {
            // Verify chữ ký từ payOS
            WebhookData data = payOS.webhooks().verify(webhookBody);

            long orderCode = data.getOrderCode();
            log.info("payOS webhook received: orderCode={}, code={}", orderCode, data.getCode());

            // Tìm payment theo orderCode
            PaymentEntity payment = paymentRepository.findByOrderCode(orderCode)
                    .orElseGet(() -> {
                        // Webhook từ payOS test / không có trong DB — bỏ qua an toàn
                        log.warn("Webhook nhận được orderCode={} không tồn tại trong DB — bỏ qua", orderCode);
                        return null;
                    });

            if (payment == null) return;

            // IDEMPOTENCY: Nếu đã PAID rồi thì bỏ qua, không cộng tiền lần 2
            if ("PAID".equals(payment.getStatus())) {
                log.info("Webhook orderCode={} đã được xử lý trước đó (status=PAID) — bỏ qua", orderCode);
                return;
            }

            String code = data.getCode();

            if ("00".equals(code) || "PAID".equalsIgnoreCase(code)) {
                // Thanh toán thành công → cộng tiền vào ví
                payment.setStatus("PAID");
                paymentRepository.save(payment);

                // Cộng tiền vào wallet (tạo WalletTransaction DEPOSIT)
                walletService.creditWallet(
                        payment.getUser().getId(),
                        payment.getAmount(),
                        "DEPOSIT",
                        "PAYMENT",
                        payment.getId()
                );
                log.info("Nạp tiền thành công: userId={}, amount={}, orderCode={}",
                        payment.getUser().getId(), payment.getAmount(), orderCode);

            } else {
                // Thanh toán thất bại / bị hủy
                payment.setStatus("CANCELLED");
                paymentRepository.save(payment);
                log.info("Webhook orderCode={} không thành công, code={}", orderCode, code);
            }

        } catch (Exception e) {
            log.error("Lỗi xử lý webhook payOS: {}", e.getMessage(), e);
            throw new RuntimeException("Xác thực webhook thất bại: " + e.getMessage());
        }
    }
}
