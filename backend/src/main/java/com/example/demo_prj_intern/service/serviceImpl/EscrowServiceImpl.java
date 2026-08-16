package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.dto.respone.EscrowResponse;
import com.example.demo_prj_intern.entity.ContractEntity;
import com.example.demo_prj_intern.entity.EscrowEntity;
import com.example.demo_prj_intern.entity.MilestoneEntity;
import com.example.demo_prj_intern.repository.ContractRepository;
import com.example.demo_prj_intern.repository.EscrowRepository;
import com.example.demo_prj_intern.repository.MilestoneRepository;
import com.example.demo_prj_intern.service.EscrowService;
import com.example.demo_prj_intern.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class EscrowServiceImpl implements EscrowService {

    private final EscrowRepository escrowRepository;
    private final ContractRepository contractRepository;
    private final MilestoneRepository milestoneRepository;
    private final WalletService walletService;

    @Override
    @Transactional
    public EscrowEntity createEscrowForContract(Long contractId) {
        // Idempotent: nếu đã tồn tại thì trả về luôn
        return escrowRepository.findByContractId(contractId).orElseGet(() -> {
            ContractEntity contract = contractRepository.findById(contractId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng ID: " + contractId));

            BigDecimal totalAmount = contract.getFinalPrice() != null
                    ? contract.getFinalPrice()
                    : BigDecimal.ZERO;

            EscrowEntity escrow = new EscrowEntity();
            escrow.setContract(contract);
            escrow.setTotalAmount(totalAmount);
            escrow.setRemainingAmount(BigDecimal.ZERO); // Chưa được fund
            escrow.setStatus("PENDING");
            return escrowRepository.save(escrow);
        });
    }

    @Override
    @Transactional
    public EscrowResponse fundContract(Long clientId, Long contractId) {
        if (clientId == null) throw new IllegalArgumentException("Client ID không được để trống");
        if (contractId == null) throw new IllegalArgumentException("Contract ID không được để trống");

        ContractEntity contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng ID: " + contractId));

        // Kiểm tra quyền sở hữu
        if (contract.getClient() == null || !clientId.equals(contract.getClient().getId())) {
            throw new IllegalArgumentException("Bạn không phải chủ hợp đồng này");
        }

        // Lấy escrow (phải tồn tại vì được tạo cùng Contract)
        EscrowEntity escrow = escrowRepository.findByContractId(contractId)
                .orElseGet(() -> createEscrowForContract(contractId));

        // Idempotency: đã FUNDED rồi thì không fund lại
        if (!"PENDING".equals(escrow.getStatus())) {
            throw new IllegalArgumentException(
                    "Hợp đồng này đã được fund (trạng thái Escrow hiện tại: " + escrow.getStatus() + ")");
        }

        BigDecimal amount = contract.getFinalPrice();
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền hợp đồng không hợp lệ");
        }

        // Debit wallet Client → ESCROW_HOLD
        walletService.debitWallet(clientId, amount, "ESCROW_HOLD", "CONTRACT", contractId);

        // Cập nhật Escrow → FUNDED
        escrow.setRemainingAmount(amount);
        escrow.setStatus("FUNDED");
        escrowRepository.save(escrow);

        log.info("Escrow FUNDED: contractId={}, clientId={}, amount={}", contractId, clientId, amount);
        return mapToResponse(escrow);
    }

    @Override
    @Transactional
    public void releaseMilestone(Long milestoneId) {
        MilestoneEntity milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy milestone ID: " + milestoneId));

        // Idempotency: đã RELEASED rồi thì bỏ qua
        if ("RELEASED".equals(milestone.getStatus())) {
            log.warn("Milestone {} đã ở trạng thái RELEASED — bỏ qua release", milestoneId);
            return;
        }

        ContractEntity contract = milestone.getContract();
        if (contract == null) throw new RuntimeException("Milestone không có contract");

        EscrowEntity escrow = escrowRepository.findByContractId(contract.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy Escrow cho contract ID: " + contract.getId()
                        + ". Vui lòng fund hợp đồng trước."));

        if (!"FUNDED".equals(escrow.getStatus()) && !"PARTIALLY_RELEASED".equals(escrow.getStatus())) {
            throw new IllegalArgumentException(
                    "Escrow chưa được fund hoặc không ở trạng thái hợp lệ để release (hiện tại: " + escrow.getStatus() + ")");
        }

        BigDecimal milestoneAmount = milestone.getAmount();
        if (milestoneAmount == null || milestoneAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền milestone không hợp lệ");
        }
        if (escrow.getRemainingAmount().compareTo(milestoneAmount) < 0) {
            throw new IllegalArgumentException(
                    "Escrow không đủ tiền để release (còn lại: " + escrow.getRemainingAmount()
                    + " VNĐ, cần: " + milestoneAmount + " VNĐ)");
        }

        Long freelancerId = contract.getFreelancer().getId();

        // Credit wallet Freelancer → ESCROW_RELEASE
        walletService.creditWallet(freelancerId, milestoneAmount, "ESCROW_RELEASE", "MILESTONE", milestoneId);

        // Cập nhật Escrow remaining
        BigDecimal newRemaining = escrow.getRemainingAmount().subtract(milestoneAmount);
        escrow.setRemainingAmount(newRemaining);

        if (newRemaining.compareTo(BigDecimal.ZERO) == 0) {
            escrow.setStatus("RELEASED");
        } else {
            escrow.setStatus("PARTIALLY_RELEASED");
        }
        escrowRepository.save(escrow);

        log.info("Escrow release: milestoneId={}, freelancerId={}, amount={}, escrowRemaining={}",
                milestoneId, freelancerId, milestoneAmount, newRemaining);
    }

    @Override
    public EscrowResponse getEscrowByContractId(Long contractId) {
        EscrowEntity escrow = escrowRepository.findByContractId(contractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Escrow cho contractId: " + contractId));
        return mapToResponse(escrow);
    }

    private EscrowResponse mapToResponse(EscrowEntity entity) {
        EscrowResponse response = new EscrowResponse();
        response.setEscrowId(entity.getId());
        if (entity.getContract() != null) {
            response.setContractId(entity.getContract().getId());
        }
        response.setTotalAmount(entity.getTotalAmount());
        response.setRemainingAmount(entity.getRemainingAmount());
        response.setStatus(entity.getStatus());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }
}
