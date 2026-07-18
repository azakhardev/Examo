package cz.zakharchenkoartem.examo_be.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import cz.zakharchenkoartem.examo_be.models.documents.QuizDocument;
import cz.zakharchenkoartem.examo_be.services.JwtService;
import cz.zakharchenkoartem.examo_be.services.QuizService;
import cz.zakharchenkoartem.examo_be.services.UserService;

import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequestMapping("/quizzes")
public class QuizController {

    private JwtService jwtService;
    private UserService userService;
    private QuizService quizService;

    public QuizController(JwtService jwtService, UserService userService, QuizService quizService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.quizService = quizService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<QuizDocument>> search(@RequestParam String keyword) {

        List<QuizDocument> quizzes = quizService.search(keyword);

        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<QuizDocument>> getRecentQuizzes(@RequestParam List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        List<QuizDocument> quizzes = quizService.getQuizzesByIds(ids);
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
}
