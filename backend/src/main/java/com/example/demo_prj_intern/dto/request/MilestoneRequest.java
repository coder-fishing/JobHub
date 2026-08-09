package com.example.demo_prj_intern.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data

// Tạo các giai đoạn giải ngân cho hợp đồng
public class MilestoneRequest {
    private Long contractId;
    private String title;
    private String description;
    private BigDecimal amount;
    private LocalDateTime deadline;
}