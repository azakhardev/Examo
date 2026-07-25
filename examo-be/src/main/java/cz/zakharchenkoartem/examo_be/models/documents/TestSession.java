package cz.zakharchenkoartem.examo_be.models.documents;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Id;

@Document(collection = "test_sessions")
public class TestSession {
    @Id
    private String id;

    private Long testId;
    private Integer userId;
    private String title;

    // Status Tracking
    private SessionStatus status = SessionStatus.IN_PROGRESS;
    private LocalDateTime startedAt;
    private LocalDateTime expiresAt; // The exact moment they run out of time
    private LocalDateTime hardDeadline;

    // The actual test data locked in for this user
    private List<Question> questions;

    @JsonIgnore
    // A map of Question ID -> List of selected Option IDs (or free text)
    private Map<String, List<String>> currentAnswers = new HashMap<>();

    public enum SessionStatus {
        IN_PROGRESS,
        SUBMITTED,
        EXPIRED
    }

    public TestSession() {

    }

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

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public LocalDateTime getHardDeadline() {
        return hardDeadline;
    }

    public void setHardDeadline(LocalDateTime hardDedline) {
        this.hardDeadline = hardDedline;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public Map<String, List<String>> getCurrentAnswers() {
        return currentAnswers;
    }

    public void setCurrentAnswers(Map<String, List<String>> currentAnswers) {
        this.currentAnswers = currentAnswers;
    }

}
