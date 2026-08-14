package cz.zakharchenkoartem.examo_be.models.documents;

import lombok.Builder;

@Builder
public class ProvidedAnswer {
    private String text;
    private Boolean correct;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Boolean getCorrect() {
        return correct;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }

}
