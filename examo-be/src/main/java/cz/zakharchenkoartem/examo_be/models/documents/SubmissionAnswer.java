package cz.zakharchenkoartem.examo_be.models.documents;

import java.util.List;

import lombok.Builder;

@Builder
public class SubmissionAnswer {
    private String id;
    private Double gainedPoints;
    private Question question;
    private List<ProvidedAnswer> answer;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Double getGainedPoints() {
        return gainedPoints;
    }

    public void setGainedPoints(Double gainedPoints) {
        this.gainedPoints = gainedPoints;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public List<ProvidedAnswer> getAnswer() {
        return answer;
    }

    public void setAnswer(List<ProvidedAnswer> answer) {
        this.answer = answer;
    }

}