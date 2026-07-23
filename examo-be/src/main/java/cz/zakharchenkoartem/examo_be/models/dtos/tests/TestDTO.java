package cz.zakharchenkoartem.examo_be.models.dtos.tests;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record TestDTO(
        Long id,
        String authorName,
        String title,
        String description,
        String accessCode,
        LocalDateTime startAt,
        LocalDateTime endAt,
        Integer timeLimitMinutes,
        Integer totalGainedPoints,
        LocalDateTime submittedAt,
        Integer totalParticipants,
        Integer maxPoints,
        Integer totalSubmissions) {
}
