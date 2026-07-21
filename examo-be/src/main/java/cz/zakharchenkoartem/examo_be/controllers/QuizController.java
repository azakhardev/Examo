package cz.zakharchenkoartem.examo_be.controllers;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import cz.zakharchenkoartem.examo_be.models.documents.QuizDocument;
import cz.zakharchenkoartem.examo_be.models.entities.QuizEntity;
import cz.zakharchenkoartem.examo_be.models.entities.QuizShare;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.QuizEntityRepository;
import cz.zakharchenkoartem.examo_be.services.QuizService;
import cz.zakharchenkoartem.examo_be.services.QuizSharesService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@Controller
@RequestMapping("/quizzes")
public class QuizController {

    private final QuizService quizService;
    private final QuizSharesService quizSharesService;
    private final QuizEntityRepository quizEntityRepository;

    public QuizController(QuizService quizService,
            QuizSharesService quizSharesService, QuizEntityRepository quizEntityRepository) {
        this.quizService = quizService;
        this.quizSharesService = quizSharesService;
        this.quizEntityRepository = quizEntityRepository;
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

    @GetMapping("")
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
}
