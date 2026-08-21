package cz.zakharchenkoartem.examo_be.services;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import cz.zakharchenkoartem.examo_be.exceptions.AccessDeniedException;
import cz.zakharchenkoartem.examo_be.exceptions.NotFoundException;
import cz.zakharchenkoartem.examo_be.models.documents.ProvidedAnswer;
import cz.zakharchenkoartem.examo_be.models.documents.Question;
import cz.zakharchenkoartem.examo_be.models.documents.QuestionOption;
import cz.zakharchenkoartem.examo_be.models.documents.QuizDocument;
import cz.zakharchenkoartem.examo_be.models.documents.QuizSnapshot;
import cz.zakharchenkoartem.examo_be.models.documents.SubmissionAnswer;
import cz.zakharchenkoartem.examo_be.models.documents.TestSession;
import cz.zakharchenkoartem.examo_be.models.documents.TestSubmissionDocument;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.AnswersPayload;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.CreateTestPayload;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.TestDTO;
import cz.zakharchenkoartem.examo_be.models.entities.Participant;
import cz.zakharchenkoartem.examo_be.models.entities.Test;
import cz.zakharchenkoartem.examo_be.repostiories.mongo.TestSessionRepository;
import cz.zakharchenkoartem.examo_be.repostiories.mongo.TestSubmissionDocumentRepository;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.TestRepository;
import jakarta.transaction.Transactional;

@Service
public class TestService {
    private final TestRepository testRepository;
    private final QuizSharesService quizSharesService;
    private final TestSessionRepository testSessionRepository;
    private final QuizService quizService;
    private final TestSubmissionDocumentRepository submissionRepository;
    private final ParticipantService participantService;

    public TestService(TestRepository testRepository, QuizSharesService quizSharesService,
            TestSessionRepository testSessionRepository, QuizService quizService,
            TestSubmissionDocumentRepository submissionRepository, ParticipantService participantService) {
        this.testRepository = testRepository;
        this.quizSharesService = quizSharesService;
        this.testSessionRepository = testSessionRepository;
        this.quizService = quizService;
        this.submissionRepository = submissionRepository;
        this.participantService = participantService;
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

    public List<Test> getQuizTests(String uuid, String type) {

        Boolean isLive = "live".equalsIgnoreCase(type);

        return testRepository.findQuizTests(UUID.fromString(uuid), isLive);
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

    public void deleteTestSession(TestSession session) {
        testSessionRepository.delete(session);
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

    @Transactional
    public Double evaluateAndSaveSubmission(Long testId, Integer userId, List<AnswersPayload> answers) {
        TestSubmissionDocument submission = evaluateTestSubmission(testId, userId, answers);

        TestSubmissionDocument savedSubmission = submissionRepository.save(submission);

        Participant participant = participantService.getParticipation(userId, testId);
        participant.setSubmittedAt(LocalDateTime.now());
        participant.setSubmissionId(UUID.fromString(savedSubmission.getId()));
        participant.setTotalGainedPoints(savedSubmission.getTotalPointsGained());

        participantService.save(participant);

        return savedSubmission.getTotalPointsGained();
    }

    public TestSubmissionDocument evaluateTestSubmission(Long testId, Integer userId, List<AnswersPayload> answers) {
        Test test = this.getTest(testId);

        QuizDocument quiz = quizService.getQuizDocumentById(test.getQuizId().toString());
        List<Question> quizQuestions = quiz.getQuestions();

        var submission = TestSubmissionDocument.builder()
                .testId(testId)
                .userId(Long.valueOf(userId))
                .title(test.getTitle())
                .author(quiz.getAuthor())
                .start(test.getStartAt())
                .submittedAt(Instant.now())
                .end(test.getEndAt());

        Double currentPoints = 0.0; // Matched to Question's Double type
        List<SubmissionAnswer> submissionAnswers = new ArrayList<>();

        for (AnswersPayload answer : answers) {
            // 1. Find the matching question from the quiz pool
            Question question = quizQuestions.stream()
                    .filter(q -> q.getId().equals(answer.questionId()))
                    .findFirst()
                    .orElse(null);

            if (question == null)
                continue;

            Double gainedPoints = 0D;
            List<ProvidedAnswer> providedAnswers = new ArrayList<>();

            // 2. Grade based on question type
            if ("OPEN".equalsIgnoreCase(question.getType())) {
                String studentText = answer.answer().text();

                if (studentText != null && !studentText.isBlank()) {
                    String normalizedStudentText = studentText.trim();
                    boolean isCorrect = false;

                    // Check if the teacher provided predefined correct options for this OPEN
                    // question
                    boolean hasPredefinedAnswers = question.getOptions() != null &&
                            question.getOptions().stream().anyMatch(o -> Boolean.TRUE.equals(o.getIsCorrect()));

                    if (hasPredefinedAnswers) {
                        // Attempt auto-grading: check if student text matches any correct option
                        // (case-insensitive)
                        isCorrect = question.getOptions().stream()
                                .filter(o -> Boolean.TRUE.equals(o.getIsCorrect()))
                                .anyMatch(o -> o.getText() != null &&
                                        o.getText().trim().equalsIgnoreCase(normalizedStudentText));

                        if (isCorrect) {
                            gainedPoints += (question.getMaxPoints() != null ? question.getMaxPoints() : 0D);
                        } else {
                            Double negativePenalty = question.getNegativePoints() != null ? question.getNegativePoints()
                                    : 0D;
                            gainedPoints -= negativePenalty;
                        }
                    } else {
                        // No predefined answers exist -> Requires manual grading later
                        gainedPoints = 0D;
                        isCorrect = false;
                    }

                    providedAnswers.add(ProvidedAnswer.builder()
                            .text(studentText) // Save the exact text the student typed
                            .correct(isCorrect)
                            .build());
                }
            } else {
                // Handle Choice Questions (SINGLE, MULTIPLE, TRUE_FALSE)
                List<String> selectedIds = answer.answer().optionIds();

                if (selectedIds != null && !selectedIds.isEmpty()) {
                    // Count how many correct options exist for proportional grading
                    long correctOptionsCount = question.getOptions().stream()
                            .filter(o -> Boolean.TRUE.equals(o.getIsCorrect()))
                            .count();

                    double pointsPerCorrect = correctOptionsCount > 0
                            ? (question.getMaxPoints() / (double) correctOptionsCount)
                            : 0.0;

                    double negativePenalty = question.getNegativePoints() != null
                            ? question.getNegativePoints()
                            : 0.0;

                    // Evaluate each selected option
                    for (String optId : selectedIds) {
                        // FIX: Use orElse(null) instead of ifPresent() lambda
                        QuestionOption matchedOpt = question.getOptions().stream()
                                .filter(o -> o.getId().equals(optId))
                                .findFirst()
                                .orElse(null);

                        if (matchedOpt != null) {
                            boolean isCorrect = Boolean.TRUE.equals(matchedOpt.getIsCorrect());

                            if (isCorrect) {
                                gainedPoints += pointsPerCorrect;
                            } else {
                                gainedPoints -= negativePenalty;
                            }

                            providedAnswers.add(ProvidedAnswer.builder()
                                    .text(matchedOpt.getText())
                                    .correct(isCorrect)
                                    .build());
                        }
                    }
                }
            }

            // 3. Update total test points
            currentPoints += gainedPoints;

            // 4. Build the final answer document, passing the Question directly!
            submissionAnswers.add(SubmissionAnswer.builder()
                    .id(UUID.randomUUID().toString())
                    .question(question) // <-- Directly embedding your Question model
                    .answer(providedAnswers)
                    .gainedPoints(gainedPoints)
                    .build());
        }

        // 5. Attach graded arrays and totals to the root builder
        submission.answers(submissionAnswers);
        submission.totalPointsGained(currentPoints);

        return submission.build();
    }

    public void createAndSaveTestSession(Test test, Integer userId) {
        // 1. Fetch the frozen snapshot for this test (NOT the live quiz pool)
        QuizSnapshot snapshot = quizService.getSnapshot(test.getSnapshotId().toString());

        // 2. Generate the randomized valid subset of questions
        int targetPointsScaled = (int) Math.round(test.getMaxPoints() * 10);
        List<Question> userQuestions = generateRandomQuestionSubset(
                snapshot.getQuestions(),
                test.getQuestionsCount(),
                targetPointsScaled);

        // 3. Create the TestSession document
        TestSession session = new TestSession();
        session.setTestId(test.getId());
        session.setUserId(userId);
        session.setTitle(test.getTitle());
        session.setStatus(TestSession.SessionStatus.IN_PROGRESS);

        // Set timers based on current time and test limits
        LocalDateTime now = LocalDateTime.now();
        session.setStartedAt(now);
        session.setExpiresAt(now.plusMinutes(test.getTimeLimitMinutes()));
        session.setHardDeadline(test.getEndAt());

        session.setQuestions(userQuestions);
        session.setCurrentAnswers(new HashMap<>());

        // 4. Save to MongoDB
        testSessionRepository.save(session);
    }

    /**
     * Finds a valid subset of questions matching the exact count and sum.
     */
    private List<Question> generateRandomQuestionSubset(List<Question> pool, int requiredCount, int targetSum) {
        // Shuffle to ensure a different random subset for every user
        List<Question> randomizedPool = new ArrayList<>(pool);
        Collections.shuffle(randomizedPool);

        // Memoization table: 0 = unvisited, 1 = true (path exists), 2 = false (dead
        // end)
        // Using byte[][][] instead of Boolean[][][] saves ~90% memory overhead
        byte[][][] memo = new byte[randomizedPool.size()][requiredCount + 1][targetSum + 1];
        List<Question> selected = new ArrayList<>();

        if (dfsSubsetSearch(0, requiredCount, targetSum, randomizedPool, memo, selected)) {
            return selected;
        }

        throw new IllegalStateException(
                "Failed to generate a valid question combination. Validation failed during creation.");
    }

    /**
     * Recursive DFS with memoization to find exactly 1 valid combination.
     */
    private boolean dfsSubsetSearch(int index, int remainingK, int remainingSum,
            List<Question> pool, byte[][][] memo, List<Question> selected) {
        // Base success case
        if (remainingK == 0 && remainingSum == 0)
            return true;

        // Base failure cases (out of bounds, exceeded sum, or out of items)
        if (remainingK <= 0 || remainingSum < 0 || index >= pool.size())
            return false;

        // Return cached result if already visited
        if (memo[index][remainingK][remainingSum] != 0) {
            return memo[index][remainingK][remainingSum] == 1;
        }

        Question currentQuestion = pool.get(index);
        int scaledPoints = (int) Math.round(currentQuestion.getMaxPoints() * 10);

        // Branch 1: TRY INCLUDING the current question
        selected.add(currentQuestion);
        if (dfsSubsetSearch(index + 1, remainingK - 1, remainingSum - scaledPoints, pool, memo, selected)) {
            memo[index][remainingK][remainingSum] = 1;
            return true;
        }
        // Backtrack (remove it if this branch failed)
        selected.remove(selected.size() - 1);

        // Branch 2: TRY SKIPPING the current question
        if (dfsSubsetSearch(index + 1, remainingK, remainingSum, pool, memo, selected)) {
            memo[index][remainingK][remainingSum] = 1;
            return true;
        }

        // Cache failure
        memo[index][remainingK][remainingSum] = 2;
        return false;
    }

}
