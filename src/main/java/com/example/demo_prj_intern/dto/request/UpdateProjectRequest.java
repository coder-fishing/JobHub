package com.example.demo_prj_intern.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateProjectRequest {
    private String title;
    private String description;
    private BigDecimal budget;
    private LocalDate deadline;
    private Integer maxFreelancers;
    private String status; // e.g. OPEN, IN_PROGRESS, COMPLETED, CANCELLED
}
