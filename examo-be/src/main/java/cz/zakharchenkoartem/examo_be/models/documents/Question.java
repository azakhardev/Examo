package cz.zakharchenkoartem.examo_be.models.documents;

import java.util.List;

public class Question {
    private String id;

    private String type;

    private String questionText;

    private List<String> options;

    private List<String> correctAnswers;

    private Double maxPoints;

    private Double negativePoints;

    private String imageUrl;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public List<String> getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(List<String> correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Double getMaxPoints() {
        return maxPoints;
    }

    public void setMaxPoints(Double maxPoints) {
        this.maxPoints = maxPoints;
    }

    public Double getNegativePoints() {
        return negativePoints;
    }

    public void setNegativePoints(Double negativePoints) {
        this.negativePoints = negativePoints;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((type == null) ? 0 : type.hashCode());
        result = prime * result + ((questionText == null) ? 0 : questionText.hashCode());
        result = prime * result + ((options == null) ? 0 : options.hashCode());
        result = prime * result + ((correctAnswers == null) ? 0 : correctAnswers.hashCode());
        result = prime * result + ((maxPoints == null) ? 0 : maxPoints.hashCode());
        result = prime * result + ((negativePoints == null) ? 0 : negativePoints.hashCode());
        result = prime * result + ((imageUrl == null) ? 0 : imageUrl.hashCode());
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
        Question other = (Question) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (type == null) {
            if (other.type != null)
                return false;
        } else if (!type.equals(other.type))
            return false;
        if (questionText == null) {
            if (other.questionText != null)
                return false;
        } else if (!questionText.equals(other.questionText))
            return false;
        if (options == null) {
            if (other.options != null)
                return false;
        } else if (!options.equals(other.options))
            return false;
        if (correctAnswers == null) {
            if (other.correctAnswers != null)
                return false;
        } else if (!correctAnswers.equals(other.correctAnswers))
            return false;
        if (maxPoints == null) {
            if (other.maxPoints != null)
                return false;
        } else if (!maxPoints.equals(other.maxPoints))
            return false;
        if (negativePoints == null) {
            if (other.negativePoints != null)
                return false;
        } else if (!negativePoints.equals(other.negativePoints))
            return false;
        if (imageUrl == null) {
            if (other.imageUrl != null)
                return false;
        } else if (!imageUrl.equals(other.imageUrl))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Question [id=" + id + ", type=" + type + ", questionText=" + questionText + ", options=" + options
                + ", correctAnswers=" + correctAnswers + ", maxPoints=" + maxPoints + ", negativePoints="
                + negativePoints + ", imageUrl=" + imageUrl + "]";
    }

}
