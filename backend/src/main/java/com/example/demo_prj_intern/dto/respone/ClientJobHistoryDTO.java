package com.example.demo_prj_intern.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientJobHistoryDTO {
    private Long id;
    private String title;
    private BigDecimal budget;
    private String status;
    private LocalDateTime createdAt;
    private Integer maxFreelancers;
}
