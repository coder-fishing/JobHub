package com.example.demo_prj_intern.dto.respone;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ContractResponse {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long clientId;
    private String clientEmail;
    private Long freelancerId;
    private String freelancerName;
    private Long proposalId;
    private BigDecimal finalPrice;
    private String contractStatus; // PROCESSING, COMPLETED, DISPUTED
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
