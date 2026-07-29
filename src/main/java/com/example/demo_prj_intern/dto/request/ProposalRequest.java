package com.example.demo_prj_intern.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;
import java.math.BigDecimal;

@Data
// Freelancer nộp báo giá
public class ProposalRequest {
    private Long projectId;
    private Long freelancerId;

    @JsonAlias({"bidAmount", "proposedPrice"})
    private BigDecimal proposedPrice;

    private Integer estimatedDays;
    private String coverLetter;
}