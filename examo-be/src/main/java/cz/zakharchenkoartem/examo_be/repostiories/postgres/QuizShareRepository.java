package cz.zakharchenkoartem.examo_be.repostiories.postgres;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import cz.zakharchenkoartem.examo_be.models.entities.QuizShare;

public interface QuizShareRepository extends JpaRepository<QuizShare, Long> {
    QuizShare findByUser_IdAndQuiz_Id(Integer userId, UUID quizId);
}
