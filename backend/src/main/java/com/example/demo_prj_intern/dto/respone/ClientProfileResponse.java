package com.example.demo_prj_intern.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientProfileResponse {
    private Long id;
    private Long userId;
    private String email;
    private String companyName;
    private String companyWebsite;
    private String industry;
    private String companySize;
    private String bio;
    private String location;
    private String avatarUrl;
    private String taxCode;

    // Hiring Statistics
    private Long totalProjectsPosted;
    private Long totalHiredCount;
    private Double hireRate;
    private BigDecimal totalSpent;
    private LocalDateTime memberSince;
}
