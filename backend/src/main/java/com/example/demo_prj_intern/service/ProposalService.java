package com.example.demo_prj_intern.service;

import com.example.demo_prj_intern.dto.request.ProposalRequest;
import com.example.demo_prj_intern.dto.respone.ProposalResponse;
import java.util.List;

public interface ProposalService {
    // Freelancer nộp báo giá (Apply)
    ProposalResponse applyToProject(ProposalRequest request);

    // Lấy danh sách hồ sơ đã apply vào một dự án (Dành cho Client xem)
    List<ProposalResponse> getProposalsByProject(Long clientId, Long projectId);

    // Lấy danh sách tất cả hồ sơ apply vào các dự án của Client
    List<ProposalResponse> getClientProposals(Long clientId);

    // Lấy danh sách các hồ sơ freelancer đã gửi
    List<ProposalResponse> getProposalsByFreelancer(Long freelancerId);

    // Đồng ý chọn freelancer (Chuyển proposal sang ACCEPTED, các hồ sơ khác của dự án sang REJECTED, dự án sang IN_PROGRESS)
    ProposalResponse acceptProposal(Long clientId, Long proposalId);

    // Từ chối hồ sơ ứng tuyển
    ProposalResponse rejectProposal(Long clientId, Long proposalId);
}
