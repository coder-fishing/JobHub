package com.example.demo_prj_intern.dto.respone;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data


// trả về chi tiết cho FE hiển thị lên
public class ProjectResponse {
    private Long id;
    private Long clientId;
    private String clientEmail;
    private String title;
    private String description;
    private BigDecimal budget;
    private String requiredSkills;
    private Integer maxFreelancers;
    private String status;           // OPEN, IN_PROGRESS, COMPLETED, CANCELLED
    private LocalDate deadline;
    private LocalDateTime createdAt;
}
