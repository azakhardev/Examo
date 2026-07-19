package cz.zakharchenkoartem.examo_be.models.documents;

import org.springframework.data.mongodb.core.mapping.Field;

public class QuestionOption {
    @Field("id")
    private String id;

    private String text;

    private Boolean isCorrect;

    public QuestionOption(String id, String text, Boolean isCorrect) {
        this.id = id;
        this.text = text;
        this.isCorrect = isCorrect;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((text == null) ? 0 : text.hashCode());
        result = prime * result + ((isCorrect == null) ? 0 : isCorrect.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        QuestionOption other = (QuestionOption) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (text == null) {
            if (other.text != null)
                return false;
        } else if (!text.equals(other.text))
            return false;
        if (isCorrect == null) {
            if (other.isCorrect != null)
                return false;
        } else if (!isCorrect.equals(other.isCorrect))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "QuestionOption [id=" + id + ", text=" + text + ", isCorrect=" + isCorrect + "]";
    }

}
