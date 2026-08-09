package com.example.demo_prj_intern.dto.respone;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MilestoneSubmissionResponse {
    private Long id;
    private Long milestoneId;
    private String freelancerNote;
    private String submissionUrl;
    private LocalDateTime submittedAt;
}
