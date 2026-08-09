package com.example.demo_prj_intern.dto.request;

import lombok.Data;

@Data

// Freelancer nộp bài cho từng giai đoạn
public class MilestoneSubmissionRequest {
    private Long milestoneId;
    private String freelancerNote;
    private String submissionUrl;
}