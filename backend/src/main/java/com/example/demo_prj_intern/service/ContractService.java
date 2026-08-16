package com.example.demo_prj_intern.service;

import com.example.demo_prj_intern.dto.request.CreateContractRequest;
import com.example.demo_prj_intern.dto.respone.ContractResponse;
import com.example.demo_prj_intern.dto.respone.EscrowResponse;

import java.util.List;

public interface ContractService {
    // 1. Tạo mới hợp đồng
    ContractResponse createContract(Long clientId, CreateContractRequest request);

    // 2. Lấy thông tin chi tiết của 1 hợp đồng
    ContractResponse getContractById(Long contractId);

    // 3. Lấy danh sách hợp đồng của 1 Client
    List<ContractResponse> getContractsByClientId(Long clientId);

    // 4. Lấy danh sách hợp đồng của 1 Freelancer
    List<ContractResponse> getContractsByFreelancerId(Long freelancerId);

    // 5. Đánh dấu hoàn thành hợp đồng
    ContractResponse completeContract(Long clientId, Long contractId);

    // 6. Client fund escrow cho hợp đồng (debit wallet của client)
    EscrowResponse fundContract(Long clientId, Long contractId);

    // 7. Lấy thông tin Escrow của hợp đồng
    EscrowResponse getEscrow(Long contractId);
}
