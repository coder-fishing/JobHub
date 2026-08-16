package com.example.demo_prj_intern.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
// Freelancer yêu cầu rút tiền từ ví
public class WithdrawalRequest {
    private Long freelancerId;
    private Long contractId;      // Contract liên quan (enforce 1 PENDING per contract)
    private BigDecimal amount;
    private String bankName;
    private String bankAccountNumber;
    private String accountHolderName;
}
