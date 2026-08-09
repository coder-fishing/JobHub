package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.WalletEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WalletRepository extends JpaRepository<WalletEntity, Long> {

    // Get wallet by user id
    Optional<WalletEntity> findByUserId(Long userId);
}
