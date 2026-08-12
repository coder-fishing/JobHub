package com.example.demo_prj_intern.dto.respone;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProposalResponse {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long freelancerId;
    private String freelancerName;
    private BigDecimal proposedPrice;
    private Integer estimatedDays;
    private String coverLetter;
    private String status;
    private LocalDateTime createdAt;
}