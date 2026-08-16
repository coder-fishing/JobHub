package com.example.demo_prj_intern.dto.respone;

import lombok.Data;
import java.math.BigDecimal;

@Data

// Hiển thi thông tin số dư
public class WalletResponse {
    private Long walletId;
    private Long userId;
    private BigDecimal balance;
    private BigDecimal freezingBalance;
    private String status; // ACTIVE, FROZEN
}