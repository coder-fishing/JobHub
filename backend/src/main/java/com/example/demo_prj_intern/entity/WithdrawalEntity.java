package com.example.demo_prj_intern.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Yêu cầu rút tiền của Freelancer.
 * Gắn với Contract để enforce rule: 1 PENDING per contract.
 * Freelancer có 3 contract → tối đa 3 withdrawal PENDING cùng lúc.
 */
@Entity
@Table(name = "withdrawals", indexes = {
        @Index(name = "idx_withdrawal_user_id", columnList = "user_id"),
        @Index(name = "idx_withdrawal_contract_id", columnList = "contract_id"),
        @Index(name = "idx_withdrawal_status", columnList = "status")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class WithdrawalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    /**
     * Contract liên quan đến withdrawal.
     * Dùng để enforce rule: 1 PENDING withdrawal per contract.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private ContractEntity contract;

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "bank_account_number", length = 50)
    private String bankAccountNumber;

    @Column(name = "account_holder_name", length = 100)
    private String accountHolderName;

    @Column(name = "status", length = 20)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED, COMPLETED

    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
