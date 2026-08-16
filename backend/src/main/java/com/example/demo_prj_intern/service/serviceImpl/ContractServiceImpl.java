package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.dto.request.CreateContractRequest;
import com.example.demo_prj_intern.dto.respone.ContractResponse;
import com.example.demo_prj_intern.dto.respone.EscrowResponse;
import com.example.demo_prj_intern.entity.ContractEntity;
import com.example.demo_prj_intern.entity.FreelancerProfileEntity;
import com.example.demo_prj_intern.entity.ProjectEntity;
import com.example.demo_prj_intern.entity.ProposalEntity;
import com.example.demo_prj_intern.repository.*;
import com.example.demo_prj_intern.service.ContractService;
import com.example.demo_prj_intern.service.EscrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final ProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final UserRepository userRepository;
    @Lazy
    private final EscrowService escrowService;

    @Override
    @Transactional
    public ContractResponse createContract(Long clientId, CreateContractRequest request) {
        if (clientId == null) throw new IllegalArgumentException("Client ID cannot be null");

        if (request == null) throw new IllegalArgumentException("Contract request cannot be null");

        if (request.getProjectId() == null) throw  new IllegalArgumentException("Project ID cannot be null");

        if (request.getProposalId() == null ) throw new IllegalArgumentException("Proposal ID cannot be null");

        // 1. Check Project Exist
        ProjectEntity project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        // 2. Check owner project
        if (project.getClient() == null || !clientId.equals(project.getClient().getId())) {
            throw new IllegalArgumentException("Client does not own the project");
        }

        // 3. Check proposal
        ProposalEntity proposal = proposalRepository.findById(request.getProposalId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ứng tuyển với ID: " + request.getProposalId()));

        // 4. Check proposal in this porject
        if (proposal.getProject() == null || !project.getId().equals(proposal.getProject().getId())) {
            throw new IllegalArgumentException("Proposal does not belong to the project");
        }

        // 5. Check profile acceted
        if (!"ACCEPTED".equalsIgnoreCase(proposal.getStatus())) {
            throw new IllegalArgumentException("Proposal is not accepted");
        }

        // 6. Create Contract
        ContractEntity contract = new ContractEntity();
        contract.setProject(project);
        contract.setProposal(proposal);
        contract.setClient(project.getClient());
        contract.setFreelancer(proposal.getFreelancer());
        contract.setFinalPrice(proposal.getProposedPrice());
        contract.setContractStatus("PROCESSING");

        ContractEntity savedContract = contractRepository.save(contract);

        // 7. Tự động tạo Escrow PENDING cho contract mới
        escrowService.createEscrowForContract(savedContract.getId());

        return mapToResponse(savedContract);
    }

    @Override
    public ContractResponse getContractById(Long contractId) {
        ContractEntity entity = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found with ID: " + contractId));

        return mapToResponse(entity);
    }

    @Override
    public List<ContractResponse> getContractsByClientId(Long clientId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID cannot be null");
        }
        if (!userRepository.existsById(clientId)) {
            throw new IllegalArgumentException("Client not found with ID: " + clientId);
        }
        return contractRepository.findByClientId(clientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ContractResponse> getContractsByFreelancerId(Long freelancerId) {
        if (freelancerId == null)
            throw new IllegalArgumentException("Freelancer ID cannot be null");

        if (!userRepository.existsById(freelancerId))
            throw new IllegalArgumentException("Freelancer not found with ID: " + freelancerId);

        return contractRepository.findByFreelancerId(freelancerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ContractResponse completeContract(Long clientId, Long contractId) {
        if ( clientId == null) throw new IllegalArgumentException("Client ID cannot be null");
        if ( contractId == null) throw new IllegalArgumentException("Contract ID cannot be null");

        ContractEntity contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found with ID: " + contractId));

        // Check quyền sở hữu của Client
        if (contract.getClient() == null || !clientId.equals(contract.getClient().getId())) {
            throw new IllegalArgumentException("Client does not own the contract");
        }

        if (!"PROCESSING".equalsIgnoreCase(contract.getContractStatus())) {
            throw new IllegalArgumentException("Hợp đồng này không ở trạng thái PROCESSING để hoàn thành (Trạng thái hiện tại: " + contract.getContractStatus() + ")");
        }
        contract.setContractStatus("COMPLETED");
        contract.setCompletedAt(LocalDateTime.now());
        ContractEntity savedContract = contractRepository.save(contract);
        return mapToResponse(savedContract);
    }

    private ContractResponse mapToResponse(ContractEntity entity) {
        ContractResponse response = new ContractResponse();

        response.setId(entity.getId());

        // Project
        if(entity.getProject() != null ) {
            response.setProjectId(entity.getProject().getId());
            response.setProjectTitle(entity.getProject().getTitle());
        }

        // Client
        if(entity.getClient() != null) {
            response.setClientId(entity.getClient().getId());
            response.setClientEmail(entity.getClient().getEmail());
        }

        // Freelancer
        if(entity.getFreelancer() != null) {
            response.setFreelancerId(entity.getFreelancer().getId());

            // FreelancerName
            String name = freelancerProfileRepository.findByUserId(entity.getFreelancer().getId())
                    .map(FreelancerProfileEntity::getFullName)
                    .orElse(null);

            response.setFreelancerName(name);
        }

        // Proposal
        if (entity.getProposal() != null) {
            response.setProposalId(entity.getProposal().getId());
        }

        response.setFinalPrice(entity.getFinalPrice());
        response.setContractStatus(entity.getContractStatus());
        response.setCompletedAt(entity.getCompletedAt());
        return response;
    }

    // ===== MỚI: fundContract + getEscrow =====

    @Override
    @Transactional
    public EscrowResponse fundContract(Long clientId, Long contractId) {
        return escrowService.fundContract(clientId, contractId);
    }

    @Override
    public EscrowResponse getEscrow(Long contractId) {
        return escrowService.getEscrowByContractId(contractId);
    }
}
