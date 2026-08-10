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
    private final com.example.demo_prj_intern.service.AuthService authService;

    // 1. Freelancer nộp hồ sơ ứng tuyển (Apply)
    @PostMapping
    public ResponseEntity<ProposalResponse> applyToProject(@RequestBody ProposalRequest request) {
        com.example.demo_prj_intern.dto.respone.CurrentUserResponse currentUser = authService.getCurrentUser();
        if (!"FREELANCER".equals(currentUser.getRole())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Chỉ FREELANCER mới được gửi Proposal");
        }
        // Force the freelancer ID to be the authenticated user
        request.setFreelancerId(currentUser.getId());
        ProposalResponse response = proposalService.applyToProject(request);
        return ResponseEntity.ok(response);
    }

    // 2. Client xem danh sách hồ sơ ứng tuyển vào dự án của mình
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProposalResponse>> getProposalsByProject(@PathVariable("projectId") Long projectId) {
        com.example.demo_prj_intern.dto.respone.CurrentUserResponse currentUser = authService.getCurrentUser();
        if (!"CLIENT".equals(currentUser.getRole())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Chỉ CLIENT mới được xem danh sách Proposal theo Project");
        }
        List<ProposalResponse> response = proposalService.getProposalsByProject(currentUser.getId(), projectId);
        return ResponseEntity.ok(response);
    }

    // 3. Freelancer xem danh sách hồ sơ ứng tuyển chính mình đã nộp
    @GetMapping("/freelancer/me")
    public ResponseEntity<List<ProposalResponse>> getMyProposals() {
        com.example.demo_prj_intern.dto.respone.CurrentUserResponse currentUser = authService.getCurrentUser();
        if (!"FREELANCER".equals(currentUser.getRole())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Chỉ FREELANCER mới được xem Proposal cá nhân");
        }
        List<ProposalResponse> response = proposalService.getProposalsByFreelancer(currentUser.getId());
        return ResponseEntity.ok(response);
    }

    // 4. Client đồng ý/chọn hồ sơ ứng tuyển của Freelancer (Duyệt)
    @PostMapping("/{proposalId}/accept")
    public ResponseEntity<ProposalResponse> acceptProposal(@PathVariable("proposalId") Long proposalId) {
        com.example.demo_prj_intern.dto.respone.CurrentUserResponse currentUser = authService.getCurrentUser();
        if (!"CLIENT".equals(currentUser.getRole())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Chỉ CLIENT mới được Accept Proposal");
        }
        ProposalResponse response = proposalService.acceptProposal(currentUser.getId(), proposalId);
        return ResponseEntity.ok(response);
    }

    // 5. Client từ chối hồ sơ ứng tuyển của Freelancer
    @PostMapping("/{proposalId}/reject")
    public ResponseEntity<ProposalResponse> rejectProposal(@PathVariable("proposalId") Long proposalId) {
        com.example.demo_prj_intern.dto.respone.CurrentUserResponse currentUser = authService.getCurrentUser();
        if (!"CLIENT".equals(currentUser.getRole())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Chỉ CLIENT mới được Reject Proposal");
        }
        ProposalResponse response = proposalService.rejectProposal(currentUser.getId(), proposalId);
        return ResponseEntity.ok(response);
    }
}
