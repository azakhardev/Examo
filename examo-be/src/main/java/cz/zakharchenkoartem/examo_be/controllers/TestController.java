package cz.zakharchenkoartem.examo_be.controllers;

import cz.zakharchenkoartem.examo_be.repostiories.postgres.ParticipantRepository;
import cz.zakharchenkoartem.examo_be.services.QuizService;
import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import cz.zakharchenkoartem.examo_be.exceptions.AccessDeniedException;
import cz.zakharchenkoartem.examo_be.exceptions.BadRequestException;
import cz.zakharchenkoartem.examo_be.exceptions.ForbiddenException;
import cz.zakharchenkoartem.examo_be.models.documents.QuizDocument;
import cz.zakharchenkoartem.examo_be.models.documents.TestSession;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.AnswersPayload;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.CreateTestPayload;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.JoinTestBody;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.TestDTO;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.TestSessionResponse;
import cz.zakharchenkoartem.examo_be.models.entities.Participant;
import cz.zakharchenkoartem.examo_be.models.entities.Test;
import cz.zakharchenkoartem.examo_be.services.ParticipantService;
import cz.zakharchenkoartem.examo_be.services.QuizSharesService;
import cz.zakharchenkoartem.examo_be.services.TestService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/tests")
public class TestController {
    private final QuizService quizService;
    private final TestService testService;
    private final QuizSharesService quizSharesService;
    private final ParticipantService participantService;

    public TestController(TestService testService, QuizSharesService quizSharesService,
            ParticipantService participantService, ParticipantRepository participantRepository,
            QuizService quizService) {
        this.testService = testService;
        this.quizSharesService = quizSharesService;
        this.participantService = participantService;
        this.quizService = quizService;

    }

    @GetMapping("/student")
    public ResponseEntity<List<TestDTO>> getForeignTests(Principal principal,
            @RequestParam(required = false) String type) {
        Integer userId = Integer.valueOf(principal.getName());

        List<TestDTO> tests = testService.getForeignTests(userId, type);

        return ResponseEntity.ok(tests);
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<TestDTO> getForeignTestDetail(Principal principal,
            @PathVariable Long id) {
        Integer userId = Integer.valueOf(principal.getName());

        TestDTO test = testService.getForeignTestDetail(userId, id);

        return ResponseEntity.ok(test);
    }

    // @GetMapping("/{id}/submitted")
    // public ResponseEntity<Test> getSubmittedTestDetail(Principal principal,
    // @PathVariable Integer id) {
    // Integer userId = Integer.valueOf(principal.getName());

    // Check if user is quiz author or if is accessing its own result, if not,
    // reject

    // // Return test submission document
    // return ResponseEntity.ok(null);
    // }

    @PostMapping("/{id}/join")
    public ResponseEntity<Boolean> joinTest(Principal principal, @PathVariable Long id,
            @RequestBody JoinTestBody body) {
        Integer userId = Integer.valueOf(principal.getName());

        Test test = testService.getTest(id);

        quizSharesService.getShare(userId, test.getQuizId().toString());

        if (body.accessCode() == null || !body.accessCode().equals(test.getAccessCode())) {
            throw new AccessDeniedException("Incorrect access code");
        }

        participantService.createParticipation(userId, id);

        testService.createAndSaveTestSession(test, userId);

        return ResponseEntity.ok(true);
    }

    @GetMapping("/{id}/session")
    public ResponseEntity<TestSessionResponse> getTestSession(Principal principal, @PathVariable Long id) {
        Integer userId = Integer.valueOf(principal.getName());

        TestSession session = testService.getTestSession(id, userId);
        if (session != null) {
            return ResponseEntity.ok(
                    TestSessionResponse.builder()
                            .isParticipating(true)
                            .test(session)
                            .build());
        }

        return ResponseEntity.ok(
                TestSessionResponse.builder()
                        .isParticipating(false)
                        .test(null)
                        .build());

    }

    @PostMapping("/create")
    public ResponseEntity<Test> postMethodName(Principal principal, @Valid @RequestBody CreateTestPayload payload) {
        Integer userId = Integer.valueOf(principal.getName());

        QuizDocument quiz = quizService.getQuizById(payload.quizId());

        if (!userId.equals(quiz.getAuthorId())) {
            throw new AccessDeniedException("You cant create test for this quiz");
        }

        if (!testService.canCreateTest(quiz, payload.questionsCount(), payload.maxPoints())) {
            throw new BadRequestException("You cant create test with selected points and question count.");
        }

        String snapshotId = quizService.saveSnapshot(quiz).getId();

        try {
            Test test = testService.createTest(payload, snapshotId);
            return ResponseEntity.ok(test);

        } catch (Exception ex) {
            quizService.deleteSnapshot(snapshotId);
            throw ex;
        }
    }

    // TODO: Print test endpoint
    // @GetMapping("/{id}/print")
    // public String getMethodName(@RequestParam String param, @PathVariable Long
    // id) {
    // return new String();
    // }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Double> submitTest(
            Principal principal,
            @PathVariable Long id,
            @Valid @RequestBody List<AnswersPayload> answers) {

        Integer userId = Integer.valueOf(principal.getName());

        // Security check: Does the user have an active, unexpired session?
        TestSession sesion = testService.getTestSession(id, userId);
        Participant participant = participantService.getParticipation(userId, id);

        if (participant.getSubmittedAt() != null) {
            throw new ForbiddenException("You have already submitted this test");
        }

        // Evaluate answers, save to Mongo, update Postgres, and handle transactions
        Double gainedPoints = testService.evaluateAndSaveSubmission(id, userId, answers);

        if (sesion != null) {
            testService.deleteTestSession(sesion);
        }

        // Return the final score
        return ResponseEntity.ok(gainedPoints);
    }

}
