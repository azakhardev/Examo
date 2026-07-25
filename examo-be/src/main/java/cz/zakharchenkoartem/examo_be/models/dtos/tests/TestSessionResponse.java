package cz.zakharchenkoartem.examo_be.models.dtos.tests;

import cz.zakharchenkoartem.examo_be.models.documents.TestSession;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestSessionResponse {
    private Boolean isParticipating;
    private TestSession test;
}
