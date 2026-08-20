package cz.zakharchenkoartem.examo_be.controllers;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import cz.zakharchenkoartem.examo_be.exceptions.ForbiddenException;
import cz.zakharchenkoartem.examo_be.models.documents.QuizDocument;
import cz.zakharchenkoartem.examo_be.models.entities.QuizEntity;
import cz.zakharchenkoartem.examo_be.models.entities.QuizShare;
import cz.zakharchenkoartem.examo_be.models.entities.Test;
import cz.zakharchenkoartem.examo_be.models.entities.User;
import cz.zakharchenkoartem.examo_be.models.entities.QuizEntity.Visibility;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.QuizEntityRepository;
import cz.zakharchenkoartem.examo_be.services.QuizService;
import cz.zakharchenkoartem.examo_be.services.QuizSharesService;
import cz.zakharchenkoartem.examo_be.services.TestService;
import cz.zakharchenkoartem.examo_be.services.UserService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequestMapping("/quizzes")
public class QuizController {

    private final QuizService quizService;
    private final QuizSharesService quizSharesService;
    private final QuizEntityRepository quizEntityRepository;
    private final TestService testService;
    private final UserService userService;

    public QuizController(QuizService quizService,
            QuizSharesService quizSharesService, QuizEntityRepository quizEntityRepository, TestService testService,
            UserService userService) {
        this.quizService = quizService;
        this.quizSharesService = quizSharesService;
        this.quizEntityRepository = quizEntityRepository;
        this.testService = testService;
        this.userService = userService;
    }

    // TODO: Make non-detail controllers return only neccesary info to frontend (no
    // questions, etc.)
    @GetMapping("/search")
    public ResponseEntity<List<QuizDocument>> search(@RequestParam String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<QuizDocument> quizzes = quizService.search(keyword);

        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<QuizDocument>> getRecentQuizzes(Principal principal, @RequestParam List<String> uuids) {
        if (uuids == null || uuids.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<UUID> uuidList = uuids.stream()
                .map(UUID::fromString)
                .toList();

        List<QuizEntity> entities = quizEntityRepository.findAllById(uuidList);

        List<String> allowedUuids = entities.stream()
                .filter(quiz -> quiz.getVisibility() == QuizEntity.Visibility.PUBLIC)
                .map(quiz -> quiz.getId().toString())
                .toList();

        if (allowedUuids.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<QuizDocument> quizzes = quizService.getQuizzesByIds(allowedUuids);

        return ResponseEntity.ok(quizzes);
    }

    @GetMapping()
    public ResponseEntity<List<QuizDocument>> getMyQuizzes(Principal principal,
            @RequestParam(required = false) String keyword, @RequestParam(required = false) Boolean isFavorite,
            @RequestParam(required = false) String visibility, @RequestParam(required = false) Boolean isAuthor) {

        Integer userId = Integer.valueOf(principal.getName());

        List<QuizDocument> quizzes = quizService.getMyQuizzes(userId, keyword, isFavorite, visibility, isAuthor);

        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<QuizDocument> getQuizDetail(Principal principal, @PathVariable String uuid) {
        Integer userId = Integer.valueOf(principal.getName());

        // 1. Ensure the user has access (this automatically creates a share if it's
        // public)
        QuizShare share = quizSharesService.ensureAccess(userId, uuid);

        // 2. Fetch and return the quiz payload from MongoDB
        QuizDocument quiz = quizService.getQuizById(uuid);

        quiz.setFavorite(share.getFavorite());

        return ResponseEntity.ok(quiz);
    }

    @PutMapping("/favorite/{uuid}")
    public ResponseEntity<Boolean> saveToFavorite(Principal principal, @PathVariable String uuid) {
        Integer userId = Integer.valueOf(principal.getName());

        quizSharesService.ensureAccess(userId, uuid);

        Boolean isFavorite = quizSharesService.toggleFavorite(userId, uuid);

        return ResponseEntity.ok(isFavorite);
    }

    @GetMapping("/{uuid}/tests")
    public ResponseEntity<List<Test>> getQuizTests(Principal principal, @PathVariable String uuid,
            @RequestParam(required = false) String type) {
        Integer userId = Integer.valueOf(principal.getName());

        QuizEntity quiz = quizService.getQuizEntityById(uuid);

        if (!quiz.getAuthor().getId().equals(userId)) {
            throw new ForbiddenException("Access denied, you are not an author of this quiz.");
        }

        List<Test> tests = testService.getQuizTests(uuid, type);

        return ResponseEntity.ok(tests);
    }

    @GetMapping("/{uuid}/tests/{testId}")
    public ResponseEntity<Test> getQuizTestDetail(Principal principal, @PathVariable String uuid,
            @PathVariable Long testId,
            @RequestParam(required = false) String type) {
        Integer userId = Integer.valueOf(principal.getName());

        QuizEntity quiz = quizService.getQuizEntityById(uuid);

        if (!quiz.getAuthor().getId().equals(userId)) {
            throw new ForbiddenException("Access denied, you are not an author of this quiz.");
        }

        Test test = testService.getTest(testId);

        return ResponseEntity.ok(test);
    }

    @PostMapping("/create")
    public ResponseEntity<QuizDocument> createQuiz(Principal principal, @RequestBody QuizDocument quizPayload) {

        Integer authorId = Integer.valueOf(principal.getName());

        User author = userService.getUser(authorId);

        quizPayload.setId(UUID.randomUUID().toString());
        quizPayload.setAuthorId(author.getId());
        quizPayload.setAuthor(author.getUsername());
        quizPayload.setUpdatedAt(LocalDateTime.now());

        QuizDocument savedQuiz = quizService.saveQuizDocument(quizPayload);

        try {
            QuizEntity pgQuiz = new QuizEntity();
            pgQuiz.setId(UUID.fromString(savedQuiz.getId()));
            pgQuiz.setName(savedQuiz.getTitle());
            pgQuiz.setAuthor(author);
            pgQuiz.setVisibility(Visibility.PRIVATE);

            QuizShare authorShare = new QuizShare();
            authorShare.setQuiz(pgQuiz);
            authorShare.setUser(author);
            authorShare.setAccessLevel(QuizShare.AccessLevel.EDIT);
            authorShare.setFavorite(false);

            pgQuiz.getShares().add(authorShare);

            quizEntityRepository.save(pgQuiz);
        } catch (Exception e) {
            quizService.deleteQuizDocument(savedQuiz.getId());

            throw new RuntimeException(e);
        }

        return ResponseEntity.ok(savedQuiz);
    }

    @PutMapping("/{uuid}/edit")
    public ResponseEntity<QuizDocument> editQuiz(
            Principal principal,
            @PathVariable String uuid,
            @RequestBody QuizDocument quizPayload) {

        Integer authorId = Integer.valueOf(principal.getName());

        QuizDocument updatedQuiz = quizService.updateQuiz(uuid, quizPayload, authorId);

        return ResponseEntity.ok(updatedQuiz);
    }

}
