package cz.zakharchenkoartem.examo_be.models.dtos;

public record UpdateProfileBody(
                String name,
                String surname,
                String username,
                String email) {
}
