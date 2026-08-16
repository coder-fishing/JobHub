package com.example.demo_prj_intern.dto.respone;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
// Response sau khi tạo payment link payOS
public class PaymentResponse {
    private Long paymentId;
    private Long userId;
    private Long orderCode;
    private BigDecimal amount;
    private String status;
    private String checkoutUrl;
    private LocalDateTime createdAt;
}
