package com.example.demo_prj_intern.dto.respone;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class WalletTransactionResponse {
    private Long id;
    private Long walletId;
    private BigDecimal amount;
    private String transactionType; // DEPOSIT, ESCROW_HOLD, ESCROW_RELEASE, WITHDRAW, REFUND
    private Long referenceId;
    private LocalDateTime createdAt;
}
