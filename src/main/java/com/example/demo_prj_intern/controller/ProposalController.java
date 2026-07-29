package com.example.demo_prj_intern.controller;

import com.example.demo_prj_intern.dto.request.ProposalRequest;
import com.example.demo_prj_intern.dto.respone.ProposalResponse;
import com.example.demo_prj_intern.service.ProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proposal")
@RequiredArgsConstructor
public class ProposalController {

    private final ProposalService proposalService;

    // 1. Freelancer nộp hồ sơ ứng tuyển (Apply)
    // URL: POST http://localhost:8080/api/proposal
    @PostMapping
    public ResponseEntity<ProposalResponse> applyToProject(@RequestBody ProposalRequest request) {
        ProposalResponse response = proposalService.applyToProject(request);
        return ResponseEntity.ok(response);
    }

    // 2. Client xem danh sách hồ sơ ứng tuyển vào dự án của mình
    // URL: GET http://localhost:8080/api/proposal/project/1?clientId=1
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProposalResponse>> getProposalsByProject(
            @PathVariable("projectId") Long projectId,
            @RequestParam(value = "clientId", required = false) Long clientId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID là tham số bắt buộc trong URL (Ví dụ: ?clientId=1)");
        }
        List<ProposalResponse> response = proposalService.getProposalsByProject(clientId, projectId);
        return ResponseEntity.ok(response);
    }

    // 3. Freelancer xem danh sách hồ sơ ứng tuyển chính mình đã nộp
    // URL: GET http://localhost:8080/api/proposal/freelancer/2
    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<ProposalResponse>> getProposalsByFreelancer(
            @PathVariable("freelancerId") Long freelancerId) {
        List<ProposalResponse> response = proposalService.getProposalsByFreelancer(freelancerId);
        return ResponseEntity.ok(response);
    }

    // 4. Client đồng ý/chọn hồ sơ ứng tuyển của Freelancer (Duyệt)
    // URL: POST http://localhost:8080/api/proposal/1/accept?clientId=1
    @PostMapping("/{proposalId}/accept")
    public ResponseEntity<ProposalResponse> acceptProposal(
            @PathVariable("proposalId") Long proposalId,
            @RequestParam(value = "clientId", required = false) Long clientId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID là tham số bắt buộc trong URL (Ví dụ: ?clientId=1)");
        }
        ProposalResponse response = proposalService.acceptProposal(clientId, proposalId);
        return ResponseEntity.ok(response);
    }

    // 5. Client từ chối hồ sơ ứng tuyển của Freelancer
    // URL: POST http://localhost:8080/api/proposal/1/reject?clientId=1
    @PostMapping("/{proposalId}/reject")
    public ResponseEntity<ProposalResponse> rejectProposal(
            @PathVariable("proposalId") Long proposalId,
            @RequestParam(value = "clientId", required = false) Long clientId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID là tham số bắt buộc trong URL (Ví dụ: ?clientId=1)");
        }
        ProposalResponse response = proposalService.rejectProposal(clientId, proposalId);
        return ResponseEntity.ok(response);
    }
}
