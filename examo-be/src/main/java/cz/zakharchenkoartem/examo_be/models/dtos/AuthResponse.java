package cz.zakharchenkoartem.examo_be.models.dtos;

public record AuthResponse(
        String token,
        AuthUser user) {
}
