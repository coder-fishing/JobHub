package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.ProjectEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

    // Get list project by userId of Client
    List<ProjectEntity> findByClientId(Long clientId);

    // Pagging and sorting by status
    Page<ProjectEntity> findByStatus(String status, Pageable pageable);

    // Find project by title and status
    Page<ProjectEntity> findByTitleContainingAndStatus(String title, String status, Pageable pageable);

    // Full-Text Search nâng cao trên MySQL
   /* @Query(value = "SELECT * FROM projects WHERE MATCH(title, description) AGAINST(:keyword IN NATURAL LANGUAGE MODE) AND status = 'OPEN'",
            nativeQuery = true)
    Page<ProjectEntity> searchProjectsFullText(@Param("keyword") String keyword, Pageable pageable);*/
}
