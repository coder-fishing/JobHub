package com.example.demo_prj_intern.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "milestone_submissions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MilestoneSubmissionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "milestone_id", nullable = false, unique = true)
    private MilestoneEntity milestone;

    @Column(name = "freelancer_note", columnDefinition = "TEXT")
    private String freelancerNote;

    @Column(name = "submission_url", length = 255)
    private String submissionUrl;

    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}