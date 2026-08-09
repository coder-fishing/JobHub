package com.example.demo_prj_intern.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "projects",
        indexes = {
            @Index(name = "idx_project_title", columnList = "title"), // Tối ưu tìm kiếm theo Tiêu đề
            @Index(name = "idx_project_status_created", columnList = "status, created_at") // Tối ưu lọc việc đang tuyển và sắp xếp mới nhất
    })
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor

public class ProjectEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private UserEntity client;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "budget", nullable = false, precision = 12, scale = 2)
    private BigDecimal budget;

    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;

    @Column(name = "attachment_url", length = 255)
    private String attachmentUrl;

    @Column(name = "max_freelancers")
    private Integer maxFreelancers = 1;

    @Column(name = "status", length = 20)
    private String status = "OPEN"; // 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
}
