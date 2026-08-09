package com.example.demo_prj_intern.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FreelancerRequest {
    private String fullName;
    private String title;
    private String bio;
    private String skills;
    private BigDecimal hourlyRate;
    private String portfolioUrl;
    private String clientId;
}
