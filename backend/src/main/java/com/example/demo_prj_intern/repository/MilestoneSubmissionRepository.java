package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.MilestoneSubmissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
// 2. Sửa tham số đầu tiên thành MilestoneSubmissionEntity
public interface MilestoneSubmissionRepository extends JpaRepository<MilestoneSubmissionEntity, Long> {

    Optional<MilestoneSubmissionEntity> findByMilestoneId(Long milestoneId);
}