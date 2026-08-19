package cz.zakharchenkoartem.examo_be.models.dtos.tests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressUserDto {
    private Integer id;
    private String username;
    private String email;
    private String name;
    private String surname;
}
