package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.EscrowEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EscrowRepository extends JpaRepository<EscrowEntity, Long> {

    // Lấy escrow theo contractId (dùng nhiều nhất)
    Optional<EscrowEntity> findByContractId(Long contractId);
}
