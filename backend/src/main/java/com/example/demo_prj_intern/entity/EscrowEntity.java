package com.example.demo_prj_intern.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Escrow gắn 1-1 với Contract.
 * Tự động được tạo với status PENDING khi Contract được tạo.
 * Client fund → FUNDED, Milestone release → PARTIALLY_RELEASED → RELEASED.
 */
@Entity
@Table(name = "escrows", indexes = {
        @Index(name = "idx_escrow_contract_id", columnList = "contract_id")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class EscrowEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false, unique = true)
    private ContractEntity contract;

    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "remaining_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal remainingAmount;

    @Column(name = "status", length = 30)
    private String status = "PENDING"; // PENDING, FUNDED, PARTIALLY_RELEASED, RELEASED, REFUNDED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
