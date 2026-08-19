package cz.zakharchenkoartem.examo_be.models.dtos.tests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantProgress {
    private int answers;
    private int totalQuestions;
    private ProgressUserDto user;
}
