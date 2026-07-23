package cz.zakharchenkoartem.examo_be.models.dtos;

import java.time.LocalDateTime;

public record TestResponse(
        Long id,
        String title,
        String description,
        String authorName,
        LocalDateTime startAt,
        LocalDateTime endAt,

        Integer timeLimitMinutes,
        Integer totalPoints,
        Integer maxPoints,
        Integer participantsCount) {
}
