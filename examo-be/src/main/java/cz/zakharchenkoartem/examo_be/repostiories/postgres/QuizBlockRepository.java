package cz.zakharchenkoartem.examo_be.repostiories.postgres;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import cz.zakharchenkoartem.examo_be.models.entities.QuizBlock;

public interface QuizBlockRepository extends JpaRepository<QuizBlock, Long> {
    Optional<QuizBlock> findByUser_IdAndQuiz_Id(Integer userId, UUID quizId);
}
