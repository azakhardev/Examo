package cz.zakharchenkoartem.examo_be.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import cz.zakharchenkoartem.examo_be.exceptions.AccessDeniedException;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.JoinTestBody;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.TestDTO;
import cz.zakharchenkoartem.examo_be.models.entities.Test;
import cz.zakharchenkoartem.examo_be.services.ParticipantService;
import cz.zakharchenkoartem.examo_be.services.QuizSharesService;
import cz.zakharchenkoartem.examo_be.services.TestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/tests")
public class TestController {
    private final TestService testService;
    private final QuizSharesService quizSharesService;
    private final ParticipantService participantService;

    public TestController(TestService testService, QuizSharesService quizSharesService,
            ParticipantService participantService) {
        this.testService = testService;
        this.quizSharesService = quizSharesService;
        this.participantService = participantService;

    }

    @GetMapping("/student")
    public ResponseEntity<List<TestDTO>> getForeignTests(Principal principal,
            @RequestParam(required = false) String type) {
        // returns upcoming or historical
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

        return ResponseEntity.ok(true);
    }

    // TODO: Get test questions - algorithm that creates unuique test and saves it
    // in memory/mongo?

}
