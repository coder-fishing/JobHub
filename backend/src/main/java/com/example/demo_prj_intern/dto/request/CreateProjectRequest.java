package com.example.demo_prj_intern.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CreateProjectRequest {
    private String title;
    private String description;
    private BigDecimal budget;
    private String requirements;
    private LocalDate deadline;
    private Integer maxFreelancers;
}
