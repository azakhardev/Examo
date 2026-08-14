package cz.zakharchenkoartem.examo_be.models.dtos.tests;

import java.util.List;

public record AnswerDetail(
        // Populated only for OPEN questions; null otherwise
        String text,

        // Populated only for CHOICE questions; null otherwise
        List<String> optionIds,

        Boolean skipped) {
}
