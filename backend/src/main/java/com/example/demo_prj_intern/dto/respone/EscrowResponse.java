package com.example.demo_prj_intern.dto.respone;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
// Thông tin Escrow gắn với Contract
public class EscrowResponse {
    private Long escrowId;
    private Long contractId;
    private BigDecimal totalAmount;
    private BigDecimal remainingAmount;
    private String status; // PENDING, FUNDED, PARTIALLY_RELEASED, RELEASED, REFUNDED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
