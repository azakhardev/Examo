package cz.zakharchenkoartem.examo_be.models.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "test_submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "submission_id", nullable = false)
    private UUID submissionId;

    @Column(name = "submitted_at", nullable = false, insertable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT NOW()")
    private LocalDateTime submittedAt;

    @Column(name = "total_gained_points", columnDefinition = "FLOAT DEFAULT 0")
    private Double totalGainedPoints = 0.0;

    // Default constructor required by JPA
    public Submission() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Test getTest() {
        return test;
    }

    public void setTest(Test test) {
        this.test = test;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public UUID getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(UUID submissionId) {
        this.submissionId = submissionId;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Double getTotalGainedPoints() {
        return totalGainedPoints;
    }

    public void setTotalGainedPoints(Double totalGainedPoints) {
        this.totalGainedPoints = totalGainedPoints;
    }
}