package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity, Long> {
    Optional<OtpEntity> findByEmailAndPurpose(String email, String purpose);
    void deleteByEmailAndPurpose(String email, String purpose);
}
