package cz.zakharchenkoartem.examo_be.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import cz.zakharchenkoartem.examo_be.exceptions.AccessDeniedException;
import cz.zakharchenkoartem.examo_be.exceptions.NotFoundException;
import cz.zakharchenkoartem.examo_be.models.documents.Question;
import cz.zakharchenkoartem.examo_be.models.documents.QuizDocument;
import cz.zakharchenkoartem.examo_be.models.documents.QuizSnapshot;
import cz.zakharchenkoartem.examo_be.models.documents.TestSession;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.CreateTestPayload;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.TestDTO;
import cz.zakharchenkoartem.examo_be.models.entities.Test;
import cz.zakharchenkoartem.examo_be.repostiories.mongo.TestSessionRepository;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.TestRepository;

@Service
public class TestService {
    private final TestRepository testRepository;
    private final QuizSharesService quizSharesService;
    private final TestSessionRepository testSessionRepository;
    private final QuizService quizService;

    public TestService(TestRepository testRepository, QuizSharesService quizSharesService,
            TestSessionRepository testSessionRepository, QuizService quizService) {
        this.testRepository = testRepository;
        this.quizSharesService = quizSharesService;
        this.testSessionRepository = testSessionRepository;
        this.quizService = quizService;
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

    public Boolean canCreateTest(QuizDocument quiz, Integer questionsCount, Integer maxPoints) {

        if (quiz.getQuestions().size() < questionsCount) {
            return false;
        }

        // 2. Extract all point values into a sorted list
        List<Double> sortedPoints = quiz.getQuestions().stream()
                .map(Question::getMaxPoints)
                .sorted()
                .toList();

        // 3. Minimum possible sum check (sum of K smallest questions)
        double minPossibleSum = sortedPoints.subList(0, questionsCount).stream()
                .mapToDouble(Double::doubleValue).sum();
        if (maxPoints < minPossibleSum) {
            return false;
        }

        // 4. Maximum possible sum check (sum of K largest questions)
        int total = sortedPoints.size();
        double maxPossibleSum = sortedPoints.subList(total - questionsCount, total).stream()
                .mapToDouble(Double::doubleValue).sum();
        if (maxPoints > maxPossibleSum) {
            return false;
        }

        int[] scaledQuestionPoints = quiz.getQuestions().stream()
                .mapToInt(q -> (int) Math.round(q.getMaxPoints() * 10))
                .toArray();

        int scaledTargetPoints = maxPoints * 10;

        // 5. Knapsack DP Algorithm
        boolean[][] dp = new boolean[questionsCount + 1][scaledTargetPoints + 1];

        // Base case: 0 questions sum to 0 points
        dp[0][0] = true;

        for (int coin : scaledQuestionPoints) {
            for (int k = questionsCount; k >= 1; k--) {
                for (int s = scaledTargetPoints; s >= coin; s--) {
                    dp[k][s] = dp[k][s] || dp[k - 1][s - coin];
                }
            }
        }

        // Your answer is simply whether the top-right cell is true:
        return dp[questionsCount][scaledTargetPoints];
    }

    public Test createTest(CreateTestPayload payload, String snapshotId) {
        Test test = new Test();
        test.setQuizId(UUID.fromString(payload.quizId()));

        test.setSnapshotId(UUID.fromString(snapshotId));

        test.setTitle(payload.title());
        test.setDescription(payload.description());
        test.setStartAt(payload.startTime());
        test.setEndAt(payload.endTime());
        test.setTimeLimitMinutes(payload.timeLimit());
        test.setQuestionsCount(payload.questionsCount());
        test.setMaxPoints(payload.maxPoints());
        test.setAllowReview(payload.allowReview());

        test.setAccessCode(generateUniqueAccessCode());

        return testRepository.save(test);
    }

    private String generateUniqueAccessCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder code = new StringBuilder(10);
        for (int i = 0; i < 10; i++) {
            code.append(chars.charAt(ThreadLocalRandom.current().nextInt(chars.length())));
        }

        return code.toString();
    }

}
