package com.example.demo_prj_intern.dto.request;

import lombok.Data;

@Data

// Client bấm chốt Freelancer để tạo Hợp đồng
public class CreateContractRequest {
    private Long projectId;
    private Long proposalId;
}