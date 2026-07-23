package cz.zakharchenkoartem.examo_be.models.dtos.auth;

public record AuthUser(
                Integer userId,
                String username,
                String email) {
}