package com.example.demo_prj_intern.dto.respone;

import lombok.*;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectFilterStatsResponse {

    // Số lượng dự án theo từng trạng thái (OPEN, IN_PROGRESS, COMPLETED...)
    private Map<String, Long> statusCounts;

    // Số lượng dự án theo từng kỹ năng (Next.js, React, Spring Boot...)
    private Map<String, Long> skillCounts;

    // (Tùy chọn) Tổng số lượng tất cả dự án trong CSDL
    private Long totalProjects;
}