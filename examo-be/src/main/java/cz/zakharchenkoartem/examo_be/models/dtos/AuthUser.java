package cz.zakharchenkoartem.examo_be.models.dtos;

public record AuthUser(
        Integer userId,
        String username,
        String email) {
}