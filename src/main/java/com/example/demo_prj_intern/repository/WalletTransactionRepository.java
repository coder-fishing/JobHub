package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.WalletTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WalletTransactionRepository extends JpaRepository<WalletTransactionEntity, Long> {

    // Get all wallet transaction of one wallet
    List<WalletTransactionEntity> findByWalletId(Long walletId);
}
