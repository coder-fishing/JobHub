package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.ContractEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<ContractEntity, Long> {

    // Find contract of project
    Optional<ContractEntity> findByProjectId(Long projectId);

    // Get list contract of one client
    List<ContractEntity> findByClientId(Long clientId);

    // Get list contract of one freelancer is doing
    List<ContractEntity> findByFreelancerId(Long freelancerId);
}
