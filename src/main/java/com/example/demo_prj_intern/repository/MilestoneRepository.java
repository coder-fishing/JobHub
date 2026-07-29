package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.MilestoneEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MilestoneRepository extends JpaRepository<MilestoneEntity, Long> {

    // Get all milestone of one contract
    List<MilestoneEntity> findByContractId(Long contractId);
}
