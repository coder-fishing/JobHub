package com.example.demo_prj_intern.controller;

import com.example.demo_prj_intern.dto.request.CreateContractRequest;
import com.example.demo_prj_intern.dto.respone.ContractResponse;
import com.example.demo_prj_intern.dto.respone.EscrowResponse;
import com.example.demo_prj_intern.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contract")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    // 1. Client tạo hợp đồng chính thức từ một Proposal đã được ACCEPTED
    // URL: POST http://localhost:8080/api/contract?clientId=1
    @PostMapping
    public ResponseEntity<ContractResponse> createContract(
            @RequestParam(value = "clientId", required = false) Long clientId,
            @RequestBody(required = false) CreateContractRequest request) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID là tham số bắt buộc trong URL (Ví dụ: ?clientId=1)");
        }
        if (request == null) {
            throw new IllegalArgumentException("Nội dung Body không được để trống. Cần truyền JSON chứa projectId và proposalId.");
        }
        ContractResponse response = contractService.createContract(clientId, request);
        return ResponseEntity.ok(response);
    }

    // 2. Lấy thông tin chi tiết hợp đồng theo ID
    // URL: GET http://localhost:8080/api/contract/1
    @GetMapping("/{contractId}")
    public ResponseEntity<ContractResponse> getContractById(@PathVariable("contractId") Long contractId) {
        ContractResponse response = contractService.getContractById(contractId);
        return ResponseEntity.ok(response);
    }

    // 3. Lấy danh sách hợp đồng của một Client
    // URL: GET http://localhost:8080/api/contract/client/1
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ContractResponse>> getContractsByClientId(@PathVariable("clientId") Long clientId) {
        List<ContractResponse> response = contractService.getContractsByClientId(clientId);
        return ResponseEntity.ok(response);
    }

    // 4. Lấy danh sách hợp đồng của một Freelancer
    // URL: GET http://localhost:8080/api/contract/freelancer/2
    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<ContractResponse>> getContractsByFreelancerId(@PathVariable("freelancerId") Long freelancerId) {
        List<ContractResponse> response = contractService.getContractsByFreelancerId(freelancerId);
        return ResponseEntity.ok(response);
    }

    // 5. Client xác nhận hoàn thành hợp đồng
    // URL: POST http://localhost:8080/api/contract/1/complete?clientId=1
    @PostMapping("/{contractId}/complete")
    public ResponseEntity<ContractResponse> completeContract(
            @PathVariable("contractId") Long contractId,
            @RequestParam(value = "clientId", required = false) Long clientId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID là tham số bắt buộc trong URL (Ví dụ: ?clientId=1)");
        }
        ContractResponse response = contractService.completeContract(clientId, contractId);
        return ResponseEntity.ok(response);
    }

    // 6. Client fund escrow cho hợp đồng (debit wallet của client)
    // URL: POST http://localhost:8080/api/contract/1/fund?clientId=1
    @PostMapping("/{contractId}/fund")
    public ResponseEntity<EscrowResponse> fundContract(
            @PathVariable("contractId") Long contractId,
            @RequestParam(value = "clientId", required = false) Long clientId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID là tham số bắt buộc trong URL (Ví dụ: ?clientId=1)");
        }
        EscrowResponse response = contractService.fundContract(clientId, contractId);
        return ResponseEntity.ok(response);
    }

    // 7. Lấy thông tin Escrow của hợp đồng
    // URL: GET http://localhost:8080/api/contract/1/escrow
    @GetMapping("/{contractId}/escrow")
    public ResponseEntity<EscrowResponse> getEscrow(@PathVariable("contractId") Long contractId) {
        EscrowResponse response = contractService.getEscrow(contractId);
        return ResponseEntity.ok(response);
    }
}
