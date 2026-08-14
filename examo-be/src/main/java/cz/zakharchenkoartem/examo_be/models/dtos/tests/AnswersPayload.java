package cz.zakharchenkoartem.examo_be.models.dtos.tests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AnswersPayload(
        @NotBlank(message = "Question ID is required") String questionId,

        @NotNull(message = "Answer detail cannot be null") @Valid AnswerDetail answer) {
}
