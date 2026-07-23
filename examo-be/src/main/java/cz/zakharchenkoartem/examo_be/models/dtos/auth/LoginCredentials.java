package cz.zakharchenkoartem.examo_be.models.dtos.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginCredentials(
        @NotBlank(message = "Email must not be empty") @Email(message = "Incorrect email format") String email,

        @NotBlank(message = "Password must not be empty") String password) {
}
