package cz.zakharchenkoartem.examo_be.models.documents;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.mongodb.core.mapping.Document;

import org.springframework.data.annotation.Id;
import lombok.Builder;

@Builder
@Document(collection = "test_submissions")
public class TestSubmissionDocument {
    @Id
    @Builder.Default()
    private String id = UUID.randomUUID().toString();

    private Long testId;

    private Long userId;

    private String author;

    private String title;

    private Double totalPointsGained;

    private LocalDateTime start;

    private Instant submittedAt;

    private LocalDateTime end;

    private List<SubmissionAnswer> answers;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String auhtor) {
        this.author = auhtor;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getTotalPointsGained() {
        return totalPointsGained;
    }

    public void setTotalPointsGained(Double totalPointsGained) {
        this.totalPointsGained = totalPointsGained;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    public void setEnd(LocalDateTime end) {
        this.end = end;
    }

    public List<SubmissionAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<SubmissionAnswer> answers) {
        this.answers = answers;
    }

}
