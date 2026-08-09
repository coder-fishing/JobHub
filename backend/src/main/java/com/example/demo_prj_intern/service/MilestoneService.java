package com.example.demo_prj_intern.service;

import com.example.demo_prj_intern.dto.request.MilestoneRequest;
import com.example.demo_prj_intern.dto.request.MilestoneSubmissionRequest;
import com.example.demo_prj_intern.dto.respone.MilestoneResponse;
import com.example.demo_prj_intern.dto.respone.MilestoneSubmissionResponse;

import java.util.List;

public interface MilestoneService {
    // 1. Client tạo mới cột mốc cho hợp đồng
    MilestoneResponse createMilestone(Long clientId, MilestoneRequest request);

    // 2. Lấy danh sách các cột mốc của 1 hợp đồng
    List<MilestoneResponse> getMilestonesByContractId(Long contractId);

    // 3. Lấy thông tin chi tiết 1 cột mốc
    MilestoneResponse getMilestoneById(Long milestoneId);

    // 4. Freelancer nộp bài sản phẩm cho cột mốc (Milestone Submission)
    MilestoneSubmissionResponse submitMilestoneWork(Long freelancerId, MilestoneSubmissionRequest request);

    // 5. Client duyệt bài nộp cột mốc và chuyển trạng thái sang RELEASED (Đã duyệt & hoàn thành cột mốc)
    MilestoneResponse releaseMilestone(Long clientId, Long milestoneId);
}
