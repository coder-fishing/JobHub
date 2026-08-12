
package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.ProjectEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

   //  Get list project by userId of Client
    List<ProjectEntity> findByClientId(Long clientId);

    // Pagging and sorting by status
    Page<ProjectEntity> findByStatus(String status, Pageable pageable);

    // Find project by title and status
    Page<ProjectEntity> findByTitleContainingAndStatus(String title, String status, Pageable pageable);
    @Query("""
        SELECT p FROM ProjectEntity p
        WHERE (:keyword IS NULL OR :keyword = '' OR
               LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:statuses IS NULL OR p.status IN :statuses)
          AND (:maxBudget IS NULL OR p.budget <= :maxBudget)
          AND (:skill IS NULL OR :skill = '' OR
               LOWER(p.requiredSkills) LIKE LOWER(CONCAT('%', :skill, '%')))
        """)
    Page<ProjectEntity> searchProjects(
            @Param("keyword") String keyword,
            @Param("statuses") List<String> statuses,
            @Param("maxBudget") BigDecimal maxBudget,
            @Param("skill") String skill,
            Pageable pageable
    );
}
