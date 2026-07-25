package cz.zakharchenkoartem.examo_be.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import cz.zakharchenkoartem.examo_be.exceptions.AccessDeniedException;
import cz.zakharchenkoartem.examo_be.exceptions.NotFoundException;
import cz.zakharchenkoartem.examo_be.models.documents.TestSession;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.TestDTO;
import cz.zakharchenkoartem.examo_be.models.entities.Test;
import cz.zakharchenkoartem.examo_be.repostiories.mongo.TestSessionRepository;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.TestRepository;

@Service
public class TestService {
    private final TestRepository testRepository;
    private final QuizSharesService quizSharesService;
    private final TestSessionRepository testSessionRepository;

    public TestService(TestRepository testRepository, QuizSharesService quizSharesService,
            TestSessionRepository testSessionRepository) {
        this.testRepository = testRepository;
        this.quizSharesService = quizSharesService;
        this.testSessionRepository = testSessionRepository;
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
        Test test = this.getTest(testId);

        quizSharesService.getShare(userId, test.getQuizId().toString());

        return TestDTO.builder()
                .id(test.getId())
                .title(test.getTitle())
                .description(test.getDescription())
                .build();
    }

    public Test getTest(Long testId) {
        Test test = testRepository.findById(testId).orElseThrow(() -> new NotFoundException("Test not found"));

        return test;
    }

    public TestSession getTestSession(Long testId, Integer userId) {
        Optional<TestSession> sessionOpt = testSessionRepository.findByTestIdAndUserId(testId, userId);

        if (sessionOpt.isEmpty()) {
            return null;
        }

        TestSession session = sessionOpt.get();
        LocalDateTime now = LocalDateTime.now();

        if (session.getHardDeadline() != null && now.isAfter(session.getHardDeadline())) {
            throw new AccessDeniedException("The absolute deadline for this test has passed.");
        }
        if (session.getExpiresAt() != null && now.isAfter(session.getExpiresAt())) {
            throw new AccessDeniedException("Your time limit for this test has expired.");
        }

        return session;
    }

}
