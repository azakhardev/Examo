package cz.zakharchenkoartem.examo_be.repostiories.mongo;

import cz.zakharchenkoartem.examo_be.models.documents.QuizDocument;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuizDocumentRepostiory extends MongoRepository<QuizDocument, String> {
    List<QuizDocument> findByAuthorId(Integer authorId);

    List<QuizDocument> findByAuthorIdAndTitle(Integer authorId, String title);

    List<QuizDocument> findByTitleContainingIgnoreCase(String keyword);

    List<QuizDocument> findByQuestionsType(String type);

    Optional<QuizDocument> findById(String id);

    List<QuizDocument> findByIdIn(List<String> ids);
}
