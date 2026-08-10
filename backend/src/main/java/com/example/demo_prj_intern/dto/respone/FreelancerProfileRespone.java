package com.example.demo_prj_intern.dto.respone;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FreelancerProfileRespone {
    private Long id;
    private Long userId;
    private String email;
    private String fullName;
    private String title;
    private String bio;
    private String skills;
    private BigDecimal hourlyRate;
    private String portfolioUrl;
    private String avatarUrl;
}
