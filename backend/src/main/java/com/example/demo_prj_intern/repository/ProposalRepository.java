package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.ProposalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProposalRepository extends JpaRepository<ProposalEntity, Long> {

    // Get all proposals by projectId ( for client chose )
    List<ProposalEntity> findByProjectId(Long projectId);

    // Get all proposals by freelancerId ( for freelancer check )
    List<ProposalEntity> findByFreelancerId(Long freelancerId);

    // Check freelancer submitted for this project
    Optional<ProposalEntity> findByProjectIdAndFreelancerId(Long projectId, Long freelancerId);
}
