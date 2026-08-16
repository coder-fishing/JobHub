package com.example.demo_prj_intern.dto.respone;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
// Thông tin yêu cầu rút tiền
public class WithdrawalResponse {
    private Long id;
    private Long userId;
    private Long contractId;
    private BigDecimal amount;
    private String bankName;
    private String bankAccountNumber;
    private String accountHolderName;
    private String status;     // PENDING, APPROVED, REJECTED, COMPLETED
    private String adminNote;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
}
