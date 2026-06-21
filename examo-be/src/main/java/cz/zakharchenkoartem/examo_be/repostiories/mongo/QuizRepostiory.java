package cz.zakharchenkoartem.examo_be.repostiories.mongo;

import cz.zakharchenkoartem.examo_be.models.documents.Quiz;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuizRepostiory extends MongoRepository<Quiz, String> {
    List<Quiz> findByAuthorId(Integer authorId);

    List<Quiz> findByAuthorIdAndTitle(Integer authorId, String title);

    List<Quiz> findByTitleContainingIgnoreCase(String keyword);

    List<Quiz> findByQuestionsType(String type);
}
