package com.example.demo_prj_intern.dto.respone;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class MilestoneResponse {
    private Long id;
    private Long contractId;
    private String title;
    private String description;
    private BigDecimal amount;
    private LocalDateTime deadline;
    private String status; // PENDING, FUNDED, SUBMITTED, RELEASED
    private LocalDateTime createdAt;
    private MilestoneSubmissionResponse submission;
}
