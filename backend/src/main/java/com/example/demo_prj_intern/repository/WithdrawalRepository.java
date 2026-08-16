package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.WithdrawalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WithdrawalRepository extends JpaRepository<WithdrawalEntity, Long> {

    // Lấy danh sách withdrawal của một user
    List<WithdrawalEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Lấy danh sách withdrawal theo status (dùng cho Admin)
    List<WithdrawalEntity> findByStatusOrderByCreatedAtDesc(String status);

    // Kiểm tra đã có PENDING withdrawal cho contract này chưa (rule: 1 per contract)
    Optional<WithdrawalEntity> findByContractIdAndStatus(Long contractId, String status);

    // Lấy tất cả withdrawal của một contract
    List<WithdrawalEntity> findByContractIdOrderByCreatedAtDesc(Long contractId);
}
