package com.example.demo_prj_intern.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
// Nap tien vao tai khoan
public class DepositRequest {
    private Long userId;
    private BigDecimal amount;
}