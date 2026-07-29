package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.FreelancerProfileEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface FreelancerProfileRepository extends JpaRepository<FreelancerProfileEntity, Long> {

    // Find Freelancer by userId
    Optional<FreelancerProfileEntity> findByUserId(Long userId);

    // Find by skill and account active status
    @Query("SELECT f FROM FreelancerProfileEntity f " +
            "WHERE f.user.role = 'FREELANCER' " +
            "AND f.user.status = 'ACTIVE' " +
            "AND f.skills LIKE %:skillKeyword%")
    Page<FreelancerProfileEntity> searchBySkill(
            @Param("skillKeyword") String skillKeyword,
            Pageable pageable
    );
}
