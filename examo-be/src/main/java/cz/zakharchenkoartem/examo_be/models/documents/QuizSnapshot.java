package cz.zakharchenkoartem.examo_be.models.documents;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Document(collection = "quiz_snapshots")
public class QuizSnapshot {

    @Id
    private String id = UUID.randomUUID().toString();

    private String originalQuizId;
    private Instant snapshotDate;
    private List<Question> questions;

    public QuizSnapshot() {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOriginalQuizId() {
        return originalQuizId;
    }

    public void setOriginalQuizId(String originalQuizId) {
        this.originalQuizId = originalQuizId;
    }

    public Instant getSnapshotDate() {
        return snapshotDate;
    }

    public void setSnapshotDate(Instant snapshotDate) {
        this.snapshotDate = snapshotDate;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

}
