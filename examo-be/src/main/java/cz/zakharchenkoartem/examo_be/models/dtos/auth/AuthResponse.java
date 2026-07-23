package cz.zakharchenkoartem.examo_be.models.dtos.auth;

public record AuthResponse(
                String token,
                AuthUser user) {
}
