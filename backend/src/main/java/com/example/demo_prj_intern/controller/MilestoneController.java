package com.example.demo_prj_intern.controller;

import com.example.demo_prj_intern.dto.request.MilestoneRequest;
import com.example.demo_prj_intern.dto.request.MilestoneSubmissionRequest;
import com.example.demo_prj_intern.dto.respone.MilestoneResponse;
import com.example.demo_prj_intern.dto.respone.MilestoneSubmissionResponse;
import com.example.demo_prj_intern.service.MilestoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milestone")
@RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneService milestoneService;

    // 1. Client tạo cột mốc công việc cho hợp đồng
    // URL: POST http://localhost:8080/api/milestone?clientId=1
    @PostMapping
    public ResponseEntity<MilestoneResponse> createMilestone(
            @RequestParam(value = "clientId", required = false) Long clientId,
            @RequestBody(required = false) MilestoneRequest request) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID là tham số bắt buộc trong URL (Ví dụ: ?clientId=1)");
        }
        if (request == null) {
            throw new IllegalArgumentException("Nội dung Body không được để trống.");
        }
        MilestoneResponse response = milestoneService.createMilestone(clientId, request);
        return ResponseEntity.ok(response);
    }

    // 2. Lấy danh sách cột mốc theo ID hợp đồng
    // URL: GET http://localhost:8080/api/milestone/contract/1
    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<MilestoneResponse>> getMilestonesByContractId(
            @PathVariable("contractId") Long contractId) {
        List<MilestoneResponse> response = milestoneService.getMilestonesByContractId(contractId);
        return ResponseEntity.ok(response);
    }

    // 3. Lấy thông tin chi tiết 1 cột mốc
    // URL: GET http://localhost:8080/api/milestone/1
    @GetMapping("/{milestoneId}")
    public ResponseEntity<MilestoneResponse> getMilestoneById(
            @PathVariable("milestoneId") Long milestoneId) {
        MilestoneResponse response = milestoneService.getMilestoneById(milestoneId);
        return ResponseEntity.ok(response);
    }

    // 4. Freelancer nộp bài sản phẩm cho cột mốc
    // URL: POST http://localhost:8080/api/milestone/submit?freelancerId=2
    @PostMapping("/submit")
    public ResponseEntity<MilestoneSubmissionResponse> submitMilestoneWork(
            @RequestParam(value = "freelancerId", required = false) Long freelancerId,
            @RequestBody(required = false) MilestoneSubmissionRequest request) {
        if (freelancerId == null) {
            throw new IllegalArgumentException("Freelancer ID là tham số bắt buộc trong URL (Ví dụ: ?freelancerId=2)");
        }
        if (request == null) {
            throw new IllegalArgumentException("Nội dung Body không được để trống.");
        }
        MilestoneSubmissionResponse response = milestoneService.submitMilestoneWork(freelancerId, request);
        return ResponseEntity.ok(response);
    }

    // 5. Client nghiệm thu / duyệt sản phẩm của cột mốc
    // URL: POST http://localhost:8080/api/milestone/1/release?clientId=1
    @PostMapping("/{milestoneId}/release")
    public ResponseEntity<MilestoneResponse> releaseMilestone(
            @PathVariable("milestoneId") Long milestoneId,
            @RequestParam(value = "clientId", required = false) Long clientId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID là tham số bắt buộc trong URL (Ví dụ: ?clientId=1)");
        }
        MilestoneResponse response = milestoneService.releaseMilestone(clientId, milestoneId);
        return ResponseEntity.ok(response);
    }
}
