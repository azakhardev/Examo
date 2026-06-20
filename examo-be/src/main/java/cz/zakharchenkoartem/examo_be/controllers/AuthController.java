package cz.zakharchenkoartem.examo_be.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.zakharchenkoartem.examo_be.models.dtos.AuthResponse;
import cz.zakharchenkoartem.examo_be.models.dtos.LoginCredentials;
import cz.zakharchenkoartem.examo_be.services.AuthService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginCredentials credentials) {

        AuthResponse response = authService.login(credentials.email(), credentials.password());

        return ResponseEntity.ok(response);
    }
}