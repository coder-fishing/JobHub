package com.example.demo_prj_intern.service;

import com.example.demo_prj_intern.dto.respone.EscrowResponse;
import com.example.demo_prj_intern.entity.EscrowEntity;

public interface EscrowService {

    /**
     * Tạo Escrow PENDING mới cho Contract (gọi khi Contract vừa được tạo).
     * Nếu Escrow đã tồn tại thì bỏ qua (idempotent).
     */
    EscrowEntity createEscrowForContract(Long contractId);

    /**
     * Client fund Contract: debit wallet của client, chuyển Escrow → FUNDED.
     * Throw nếu: wallet không ACTIVE, balance không đủ, hoặc Escrow đã FUNDED.
     */
    EscrowResponse fundContract(Long clientId, Long contractId);

    /**
     * Release tiền cho Freelancer khi một Milestone được approve.
     * Trừ remainingAmount, credit wallet Freelancer.
     * Cập nhật Escrow status: PARTIALLY_RELEASED hoặc RELEASED.
     * Idempotent: milestone đã RELEASED thì bỏ qua.
     */
    void releaseMilestone(Long milestoneId);

    /**
     * Lấy thông tin Escrow theo contractId.
     */
    EscrowResponse getEscrowByContractId(Long contractId);
}
