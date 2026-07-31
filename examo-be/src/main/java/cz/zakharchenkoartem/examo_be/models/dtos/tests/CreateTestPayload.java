package cz.zakharchenkoartem.examo_be.models.dtos.tests;

import java.time.LocalDateTime;
import jakarta.validation.constraints.*;

public record CreateTestPayload(
        @NotBlank(message = "Title cannot be empty") @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters") String title,
        @Size(max = 500, message = "Description cannot exceed 500 characters") String description,
        @NotNull(message = "Start time is required") @FutureOrPresent(message = "Start time cannot be in the past") LocalDateTime startTime,
        @NotNull(message = "End time is required") @Future(message = "End time must be in the future") LocalDateTime endTime,
        @NotNull(message = "Questions count is required") @Min(value = 1, message = "Must include at least 1 question") Integer questionsCount,
        @NotNull(message = "Time limit is required") @Min(value = 1, message = "Time limit must be at least 1 minute") Integer timeLimit,
        @NotNull(message = "Max points is required") @Positive(message = "Max points must be greater than zero") Integer maxPoints,
        @NotNull(message = "Allow review flag is required") Boolean allowReview,
        @NotBlank(message = "Quiz ID is required") String quizId) {

}
