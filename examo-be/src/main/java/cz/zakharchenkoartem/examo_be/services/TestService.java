package cz.zakharchenkoartem.examo_be.services;

import java.util.List;

import org.springframework.stereotype.Service;

import cz.zakharchenkoartem.examo_be.exceptions.NotFoundException;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.TestDTO;
import cz.zakharchenkoartem.examo_be.models.entities.Test;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.TestRepository;

@Service
public class TestService {
    private final TestRepository testRepository;
    private final QuizSharesService quizSharesService;

    public TestService(TestRepository testRepository, QuizSharesService quizSharesService) {
        this.testRepository = testRepository;
        this.quizSharesService = quizSharesService;
    }

    public List<TestDTO> getForeignTests(Integer userId, String type) {

        Boolean isHistory = "history".equalsIgnoreCase(type);

        return testRepository.findForeignTests(userId, isHistory, false).stream()
                .map(p -> TestDTO.builder()
                        .id(p.getId())
                        .authorName(p.getAuthorName())
                        .title(p.getTitle())
                        .startAt(p.getStartAt())
                        .endAt(p.getEndAt())
                        .timeLimitMinutes(p.getTimeLimitMinutes())
                        .maxPoints(p.getMaxPoints())
                        .totalGainedPoints(
                                p.getTotalGainedPoints() != null ? p.getTotalGainedPoints().intValue() : null)
                        .submittedAt(p.getSubmittedAt())
                        .build())
                .toList();

    }

    public TestDTO getForeignTestDetail(Integer userId, Long testId) {
        Test test = testRepository.findById(testId).orElseThrow(() -> new NotFoundException("Test not found"));

        quizSharesService.getShare(userId, test.getQuizId().toString());

        return TestDTO.builder()
                .id(test.getId())
                .title(test.getTitle())
                .description(test.getDescription())
                .build();
    }
}
