package cz.zakharchenkoartem.examo_be.models.dtos.tests;

import java.time.LocalDateTime;

public interface TestProjection {
    Long getId();

    String getTitle();

    String getAuthorName();

    LocalDateTime getStartAt();

    LocalDateTime getEndAt();

    Integer getTimeLimitMinutes();

    Integer getMaxPoints();

    Double getTotalGainedPoints();

    LocalDateTime getSubmittedAt();
}
