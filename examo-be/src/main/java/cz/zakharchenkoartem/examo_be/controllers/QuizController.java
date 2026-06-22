package cz.zakharchenkoartem.examo_be.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import cz.zakharchenkoartem.examo_be.services.JwtService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@Controller
@RequestMapping("/quizzes")
public class QuizController {

    private JwtService jwtService;

    @Autowired
    public QuizController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @GetMapping("/search")
    public ResponseEntity<String> getMethodName(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);

        Integer authorId = jwtService.extractUserId(token);

        return ResponseEntity.ok("");
    }
}
