package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

    // Tìm payment theo orderCode (dùng trong webhook idempotency check)
    Optional<PaymentEntity> findByOrderCode(Long orderCode);

    // Lấy danh sách payments của một user
    List<PaymentEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
}
