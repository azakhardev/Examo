package cz.zakharchenkoartem.examo_be.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import cz.zakharchenkoartem.examo_be.repostiories.postgres.QuizBlockRepository;

@Service
public class QuizBlocksService {

    private final QuizBlockRepository quizBlockRepository;

    public QuizBlocksService(QuizBlockRepository quizBlockRepository) {
        this.quizBlockRepository = quizBlockRepository;
    }

    public boolean isUserBlocked(Integer userId, UUID quizId) {
        return quizBlockRepository.findByUser_IdAndQuiz_Id(userId, quizId).isPresent();
    }

}
